import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { purchaseSchema } from "@/lib/validations"

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

    const body = await request.json()
    const validatedData = purchaseSchema.parse(body)

    const { data: sweet, error: sweetError } = await supabase.from("sweets").select("*").eq("id", params.id).single()

    if (sweetError || !sweet) {
      return NextResponse.json({ error: "Sweet not found" }, { status: 404 })
    }

    if (sweet.quantity < validatedData.quantity) {
      return NextResponse.json({ error: "Insufficient stock available" }, { status: 400 })
    }

    // Calculate total price
    const totalPrice = sweet.price * validatedData.quantity

    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert([
        {
          user_id: user.id,
          sweet_id: params.id,
          quantity: validatedData.quantity,
          total_price: totalPrice,
        },
      ])
      .select()
      .single()

    if (purchaseError) {
      console.error("Purchase creation error:", purchaseError)
      return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
    }

    // Update sweet quantity
    const { error: updateError } = await supabase
      .from("sweets")
      .update({ quantity: sweet.quantity - validatedData.quantity })
      .eq("id", params.id)

    if (updateError) {
      console.error("Sweet quantity update error:", updateError)
      return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Purchase completed successfully",
      purchase: {
        ...purchase,
        sweet: sweet,
      },
    })
  } catch (error) {
    console.error("Purchase error:", error)
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data", details: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
