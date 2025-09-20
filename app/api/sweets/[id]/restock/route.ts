import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"
import { restockSchema } from "@/lib/validations"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = restockSchema.parse(body)

    // Get current sweet
    const sweet = await prisma.sweet.findUnique({
      where: { id: params.id },
    })

    if (!sweet) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    // Update sweet quantity
    const updatedSweet = await prisma.sweet.update({
      where: { id: params.id },
      data: {
        quantity: sweet.quantity + validatedData.quantity,
      },
    })

    return NextResponse.json({
      message: "Sweet restocked successfully",
      sweet: updatedSweet,
    })
  } catch (error) {
    console.error("Restock error:", error)
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
