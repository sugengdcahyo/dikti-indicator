import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth-repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email institusi wajib diisi." }, { status: 400 });
    }

    const token = await requestPasswordReset(email);

    return NextResponse.json({
      ok: true,
      message: "Jika email terdaftar, instruksi reset password sudah dikirim.",
      debugResetToken: process.env.NODE_ENV === "development" ? token : undefined
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses permintaan reset password." },
      { status: 500 }
    );
  }
}
