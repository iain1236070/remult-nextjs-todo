import ably from "ably/promises"
import { NextResponse } from "next/server"

export async function POST() {
  const token = await new ably.Rest(
    process.env["ABLY_API_KEY"]!
  ).auth.createTokenRequest({ capability: { "*": ["subscribe"] } })
  return NextResponse.json(token)
}
