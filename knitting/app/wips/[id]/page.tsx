import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/auth";
import { getUserWIPDetails } from "../../../src/controller/wipDetails.controller";
import { WIPDetails } from "../../../src/domain/wipDetails";
import WIPPageClient from "./client";
import { getWIPComments } from "../../../src/controller/comment.controller";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    
    const { id } = await params;
    const wipID = parseInt(id);
    
    if (!user?.id) {
        redirect(`/login?redirect=/wips/${id}`); // GEBRUIK ID HIER
    }

    let wipData: WIPDetails | null = null;
    const comments = await getWIPComments(wipID);

    if (user?.id) { 
        const allWipDetails = await getUserWIPDetails(user.id);

        wipData = allWipDetails.find(wip => wip.wipID === wipID) || null;
    }

    return (
        <WIPPageClient 
        user={user} 
        wipData={wipData}
        comments={comments} />
    )
    
}