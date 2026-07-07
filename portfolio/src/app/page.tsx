import Experience from "@/components/Experience";
import { getPortfolio } from "@/server/modules/portfolio/service";

/**
 * 首页（服务端组件）— 直接经由 service 层取数，
 * 与 /api/v1/portfolio 共享同一份领域逻辑。
 */
export default async function Home() {
  const data = await getPortfolio();
  return <Experience data={data} />;
}
