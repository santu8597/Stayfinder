import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/models/Property"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const city = searchParams.get("city")
    const type = searchParams.get("type")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const guests = searchParams.get("guests")
    const amenities = searchParams.get("amenities")

    // Build query
    const query: any = { isActive: true }

    if (city) {
      query["location.city"] = { $regex: city, $options: "i" }
    }

    if (type) {
      query.type = type
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseInt(minPrice)
      if (maxPrice) query.price.$lte = Number.parseInt(maxPrice)
    }

    if (guests) {
      query.guests = { $gte: Number.parseInt(guests) }
    }

    if (amenities) {
      const amenityList = amenities.split(",")
      query.amenities = { $in: amenityList }
    }

    const skip = (page - 1) * limit

    const properties = await Property.find(query)
      .populate("host", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Property.countDocuments(query)

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Get properties error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const authData = await authenticateRequest(request)
    if (!authData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const property = await Property.create({
      ...body,
      host: authData.userId,
    })

    const populatedProperty = await Property.findById(property._id).populate("host", "firstName lastName avatar")

    return NextResponse.json(
      {
        message: "Property created successfully",
        property: populatedProperty,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create property error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
