import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, badgeNumber, role, phone } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Check if badge number already exists
    const existingBadge = await prisma.user.findUnique({
      where: { badgeNumber }
    })

    if (existingBadge) {
      return NextResponse.json(
        { error: "Badge number already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        badgeNumber,
        role,
        phone,
        isActive: true,
      }
    })

    // Create personnel record
    await prisma.personnel.create({
      data: {
        userId: user.id,
        employeeId: badgeNumber,
        rank: role === "ADMIN" ? "Chief" : "Firefighter",
        status: "OFF_DUTY",
      }
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
