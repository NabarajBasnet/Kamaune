import { Dashboard } from "@/components/dashboard/dashboard";

export async function generateMetadate() {
  return ({
    title: "Dashboard Overview - Kamaune",
    description: "Dashboard overview page"
  })
}

export default function Page() {
  return (
    <Dashboard />
  );
}
