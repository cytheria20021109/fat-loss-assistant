import { NextResponse } from "next/server";
import { getSection } from "@/server/modules/portfolio/service";

/** 静态导出兼容：构建期为三个版块各固化一份 JSON */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { section: "etudes" },
    { section: "carriere" },
    { section: "intelligence" },
  ];
}

/** GET /api/v1/portfolio/:section — 单一版块（etudes | carriere | intelligence） */
export async function GET(
  _req: Request,
  { params }: { params: { section: string } }
) {
  const data = await getSection(params.section);
  if (!data) {
    return NextResponse.json({ error: "section introuvable" }, { status: 404 });
  }
  return NextResponse.json(data);
}
