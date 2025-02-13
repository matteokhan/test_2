import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log(request)

  return NextResponse.redirect(new URL('/success', request.url))
}
