import { NextResponse } from "next/server";
import { getPortfolio } from "@/server/modules/portfolio/service";

/** GET /api/v1/portfolio — 全量语义空间数据 */
export async function GET() {
  const payload = await getPortfolio();
  return NextResponse.json(payload);
}
