import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import Property from "@/models/Property"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const authData = await authenticateRequest(request)
    if (!authData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'guest' or 'host'

    const query: any = {}

    if (type === "guest") {
      query.guest = authData.userId
    } else if (type === "host") {
      query.host = authData.userId
    } else {
      // Return both guest and host bookings
      query.$or = [{ guest: authData.userId }, { host: authData.userId }]
    }

    const bookings = await Booking.find(query)
      .populate("property", "title images location price")
      .populate("guest", "firstName lastName avatar")
      .populate("host", "firstName lastName avatar")
      .sort({ createdAt: -1 })

    return NextResponse.json({ bookings })
  } catch (error: any) {
    console.error("Get bookings error:", error)
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
    const { propertyId, checkIn, checkOut, guests, specialRequests } = body

    // Get property details
    const property = await Property.findById(propertyId)
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if property can accommodate guests
    if (guests > property.guests) {
      return NextResponse.json({ error: "Property cannot accommodate this many guests" }, { status: 400 })
    }

    // Check for existing bookings in the date range
    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lte: new Date(checkIn) },
          checkOut: { $gt: new Date(checkIn) },
        },
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gte: new Date(checkOut) },
        },
        {
          checkIn: { $gte: new Date(checkIn) },
          checkOut: { $lte: new Date(checkOut) },
        },
      ],
    })

    if (existingBooking) {
      return NextResponse.json({ error: "Property is not available for the selected dates" }, { status: 400 })
    }

    // Calculate total price
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = nights * property.price

    // Create booking
    const booking = await Booking.create({
      property: propertyId,
      guest: authData.userId,
      host: property.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      specialRequests,
    })

    const populatedBooking = await Booking.findById(booking._id)
      .populate("property", "title images location price")
      .populate("guest", "firstName lastName avatar")
      .populate("host", "firstName lastName avatar")

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking: populatedBooking,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create booking error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
