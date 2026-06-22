import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import type { CheckoutPayload } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Ordering is not connected yet. Add your Supabase keys to .env.local and run the migrations.",
      },
      { status: 503 }
    );
  }

  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body?.items?.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (!body.customer_name?.trim() || !body.customer_email?.trim()) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (body.fulfillment_type === "delivery" && !body.address?.trim()) {
    return NextResponse.json(
      { error: "A delivery address is required for delivery orders." },
      { status: 400 }
    );
  }

  // place_order recomputes prices server-side and inserts atomically.
  const { data, error } = await supabase.rpc("place_order", {
    payload: {
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone ?? null,
      fulfillment_type: body.fulfillment_type,
      address: body.address ?? null,
      notes: body.notes ?? null,
      items: body.items.map((i) => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
      })),
    },
  });

  if (error) {
    console.error("[orders] place_order failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't place your order. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ orderId: data as string }, { status: 201 });
}
