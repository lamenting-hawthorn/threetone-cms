import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { secret, paths } = body as { secret?: string; paths?: string[] }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 })
  }

  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ revalidated: false, message: "No paths provided" }, { status: 400 })
  }

  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, now: Date.now(), paths })
}
