import { notFound } from "next/navigation";
import { Product } from "@/features/rental-shop-product";
import { getProductBySlug } from "@/db/product";
import { findCurrentUser } from "@/db/user";

export default async function ProductPage({ params }) {
  const product = await getProductBySlug((await params).slug);

  if (!product) {
    notFound();
  }

  const user = await findCurrentUser();

  return <Product product={product} user={user} />;
}
