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
    price: p.basePricePerDay.toFixed(2) ?? 0,
    basePricePerDay: p.basePricePerDay.toFixed(2) ?? 0,
    basePricePerHour: p.basePricePerHour.toFixed(2) ?? 0,
    basePricePerWeek: p.basePricePerWeek.toFixed(2) ?? 0,
    lateFeePerHour: p.LateFeePerHour.toFixed(2) ?? 0,
    units: p.units ?? 1,
    imageUrl: p.imageUrl || "",
    createdAt: p.createdAt?.toISOString?.() || "",
    description: p.description || "",
  }));

  return <DashboardClient products={mappedProducts} />;
}
