import { getAllProducts } from "@/db/product";
import { DashboardClient } from "./dashboard-client";

export async function Dashboard() {
  const products = await getAllProducts();

  const mappedProducts = products.map((p) => ({
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    category: p.category?.name || "Uncategorized",
    owner: p.owner?.name || "Unknown",
    price: p.basePricePerDay ?? 0,
    basePricePerDay: p.basePricePerDay ?? 0,
    basePricePerHour: p.basePricePerHour ?? 0,
    basePricePerWeek: p.basePricePerWeek ?? 0,
    lateFeePerHour: p.LateFeePerHour ?? 0,
    units: p.units ?? 1,
    imageUrl: p.imageUrl || "",
    createdAt: p.createdAt?.toISOString?.() || "",
    description: p.description || "",
  }));

  return <DashboardClient products={mappedProducts} />;
}
