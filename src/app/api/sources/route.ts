import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SheetConnection } from "@/lib/source-connection-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RawConnectionFile = {
  id: string;
  name: string;
  url: string;
};

type RawConnectionInput = {
  id?: unknown;
  type?: unknown;
  name?: unknown;
  url?: unknown;
  files?: unknown;
};

function isRawConnectionFile(value: unknown): value is RawConnectionFile {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      "name" in value &&
      "url" in value &&
      typeof value.id === "string" &&
      typeof value.name === "string" &&
      typeof value.url === "string"
  );
}

function normalizeConnection(input: RawConnectionInput | null | undefined): SheetConnection | null {
  if (!input || typeof input !== "object") return null;
  if (!input.id || !input.name || !input.url || !input.type) return null;
  if (input.type !== "sheet" && input.type !== "folder") return null;

  const files = Array.isArray(input.files)
    ? input.files
        .filter((file): file is RawConnectionFile => isRawConnectionFile(file))
        .map((file) => ({ id: file.id, name: file.name, url: file.url }))
    : undefined;

  return {
    id: String(input.id),
    type: input.type,
    name: String(input.name),
    url: String(input.url),
    files
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userEmail = (url.searchParams.get("userEmail") || "").trim().toLowerCase();

    if (!userEmail) {
      return NextResponse.json({ error: "userEmail wajib diisi." }, { status: 400 });
    }

    const rows = await prisma.dataSourceConnection.findMany({
      where: { userEmail },
      orderBy: { createdAt: "asc" }
    });

    const connections: SheetConnection[] = rows
      .map((row: { id: string; type: string; name: string; url: string; files: unknown }) =>
        normalizeConnection({
          id: String(row.id ?? ""),
          type: String(row.type ?? ""),
          name: String(row.name ?? ""),
          url: String(row.url ?? ""),
          files: Array.isArray(row.files) ? row.files : undefined
        })
      )
      .filter((item: SheetConnection | null): item is SheetConnection => Boolean(item));

    return NextResponse.json({ connections });
  } catch {
    return NextResponse.json({ error: "Gagal memuat source connections." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userEmail?: string;
      connections?: RawConnectionInput[];
    };

    const userEmail = (body.userEmail || "").trim().toLowerCase();
    const rawConnections = Array.isArray(body.connections) ? body.connections : [];

    if (!userEmail) {
      return NextResponse.json({ error: "userEmail wajib diisi." }, { status: 400 });
    }

    const connections = rawConnections
      .map((item) => normalizeConnection(item))
      .filter((item: SheetConnection | null): item is SheetConnection => Boolean(item));

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.dataSourceConnection.deleteMany({ where: { userEmail } });

      if (connections.length > 0) {
        await tx.dataSourceConnection.createMany({
          data: connections.map((conn) => ({
            id: conn.id,
            userEmail,
            type: conn.type,
            name: conn.name,
            url: conn.url,
            files: conn.files
          }))
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan source connections." }, { status: 500 });
  }
}
