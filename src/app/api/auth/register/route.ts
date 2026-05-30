import { NextResponse } from "next/server";
import { createCredentialsUser } from "@/lib/auth-repo";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Semua kolom pendaftaran wajib diisi." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Konfirmasi kata sandi tidak cocok." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Kata sandi harus minimal 6 karakter." }, { status: 400 });
    }

    await createCredentialsUser({ name, email, password });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "Email institusi ini sudah terdaftar." }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Gagal menyimpan pendaftaran user ke database." },
      { status: 500 }
    );
  }
}
