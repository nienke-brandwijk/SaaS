import { redirect } from "react-router-dom";
import { getCurrentUser } from "../../lib/auth";
import VisionboardClient from "./client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;
    
  if (!user?.id) {
    redirect(`/login?redirect=/visionboards/${id}`); 
  }
  
  return (
    <VisionboardClient
      user = {user}
    />
  )
}