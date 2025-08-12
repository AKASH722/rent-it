import { Dashboard } from "@/features/rental-shop-dashboard";

export default async function Page(props) {
  const searchParams = await props.searchParams;
  const page = searchParams.page;
  return <Dashboard page={page} />;
}
