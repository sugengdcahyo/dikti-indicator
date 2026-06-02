import { NextResponse } from "next/server";
import { resetPasswordByToken } from "@/lib/auth-repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };

    const token = (body.token || "").trim();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "Token, password, dan konfirmasi wajib diisi." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Konfirmasi kata sandi tidak cocok." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Kata sandi harus minimal 6 karakter." }, { status: 400 });
    }

    const success = await resetPasswordByToken(token, password);
    if (!success) {
      return NextResponse.json({ error: "Token reset tidak valid atau sudah kedaluwarsa." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal mereset password." }, { status: 500 });
  }
}
