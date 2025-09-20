import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { restockSchema } from "@/lib/validations"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !userProfile || userProfile.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = restockSchema.parse(body)

    const { data: sweet, error: sweetError } = await supabase.from("sweets").select("*").eq("id", params.id).single()

    if (sweetError || !sweet) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    const { data: updatedSweet, error: updateError } = await supabase
      .from("sweets")
      .update({ quantity: sweet.quantity + validatedData.quantity })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("Restock error:", updateError)
      return NextResponse.json({ error: "Failed to restock sweet" }, { status: 500 })
    }

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
