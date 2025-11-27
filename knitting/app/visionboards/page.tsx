import { getCurrentUser } from "../../lib/auth";
import VisionboardClient from "./client";

export default async function Page() {
  const user = await getCurrentUser();
  
  return (
    <VisionboardClient
      user = {user}
    />
  )
}