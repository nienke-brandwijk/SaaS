import { getCurrentUser } from "../../../lib/auth";
import { getUserWIPDetails } from "../../../src/controller/wipDetails.controller";
import { WIPDetails } from "../../../src/domain/wipDetails";
import WIPPageClient from "./client";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    
    const { id } = await params;
    const wipID = parseInt(id);

    let wipData: WIPDetails | null = null;

    if (user?.id) { 
        const allWipDetails = await getUserWIPDetails(user.id);

        wipData = allWipDetails.find(wip => wip.wipID === wipID) || null;
    }

    return (
        <WIPPageClient 
        user={user} 
        wipData={wipData} />
    )
    
}