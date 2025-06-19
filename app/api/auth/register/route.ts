import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    })

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    })

    // Return user data (without password) and token
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isHost: user.isHost,
      isVerified: user.isVerified,
    }

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: userData,
        token,
      },
      { status: 201 },
    )

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
