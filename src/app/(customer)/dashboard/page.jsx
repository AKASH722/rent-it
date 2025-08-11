import { findCurrentUser } from "@/db/user";
import { LogoutDialog } from "@/features/auth";

export default async function Page() {
  const user = await findCurrentUser();
  return (
    <div>
      {JSON.stringify(user, null, 2)} <LogoutDialog />
    </div>
  );
}
