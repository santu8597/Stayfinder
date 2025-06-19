import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/models/Property"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const property = await Property.findById(params.id).populate(
      "host",
      "firstName lastName avatar phone email createdAt",
    )

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({ property })
  } catch (error: any) {
    console.error("Get property error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const authData = await authenticateRequest(request)
    if (!authData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const property = await Property.findById(params.id)
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if user is the host
    if (property.host.toString() !== authData.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const updatedProperty = await Property.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate("host", "firstName lastName avatar")

    return NextResponse.json({
      message: "Property updated successfully",
      property: updatedProperty,
    })
  } catch (error: any) {
    console.error("Update property error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const authData = await authenticateRequest(request)
    if (!authData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const property = await Property.findById(params.id)
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check if user is the host
    if (property.host.toString() !== authData.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await Property.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: "Property deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete property error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
