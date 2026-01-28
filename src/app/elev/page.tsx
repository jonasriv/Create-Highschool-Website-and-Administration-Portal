import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import ElevSite from "./ElevSite";

export default async function ElevPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin?callbackUrl=/elev");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msConnected = Boolean((session as any).msConnected);

  return (
    <>
    {session.user &&
        <ElevSite
        user={session.user}
        msConnected={msConnected}
        />
    }
    </>
  );
}
