import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const authData = await authenticateRequest(request)
    if (!authData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findById(authData.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      isHost: user.isHost,
      isVerified: user.isVerified,
    }

    return NextResponse.json({ user: userData })
  } catch (error: any) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
