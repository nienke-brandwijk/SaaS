import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import WIPPageClient from "./client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    
    const { id } = await params;

    return (
        <WIPPageClient 
        user={user} />
    )
    
}