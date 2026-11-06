import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();

  const { encrypted_blob, content_type, max_opens, expires_in_hours } = body;

  const access_code = Math.random().toString(36).substring(2, 10).toUpperCase();

  const hours = expires_in_hours ?? 24;
  const expires_at = new Date(Date.now() + hours * 60 * 60 * 1000);

  const { data: transfer, error: transferError } = await supabase
    .from("transfers")
    .insert({
      access_code,
      pin_hash: "hash_placeholder",
      max_opens,
      expires_at: expires_at.toISOString(),
    })
    .select()
    .single();

  if (transferError) {
    return NextResponse.json({ error: transferError }, { status: 500 });
  }

  const { error: contentError } = await supabase
    .from("transfer_contents")
    .insert({
      transfer_id: transfer.id,
      content_type,
      encrypted_blob,
    });

  if (contentError) {
    return NextResponse.json({ error: contentError }, { status: 500 });
  }

  return NextResponse.json({ access_code: transfer.access_code }, { status: 201 });
}
