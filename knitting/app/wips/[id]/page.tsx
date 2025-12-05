import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/auth";
import { getUserWIPDetails } from "../../../src/controller/wipDetails.controller";
import { WIPDetails } from "../../../src/domain/wipDetails";
import WIPPageClient from "./client";
import { getWIPComments } from "../../../src/controller/comment.controller";
import { getWipCalculations } from "../../../src/controller/calculation.controller"; 
import { Calculation } from "../../../src/domain/calculation";
import { VisionBoard } from "../../../src/domain/visionboard";
import { getBoardsByUserID } from "../../../src/service/visionboard.service";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    
    const { id } = await params;
    const wipID = parseInt(id);
    
    if (!user?.id) {
        redirect(`/login?redirect=/wips/${id}`); 
    }

    let wipData: WIPDetails | null = null;
    const comments = await getWIPComments(wipID);
    let calculations: Calculation[] = [];
    let visionBoardsData: VisionBoard[] = [];

    if (user?.id) { 
        const allWipDetails = await getUserWIPDetails(user.id);

        wipData = allWipDetails.find(wip => wip.wipID === wipID) || null;

        if (wipData) {
            calculations = await getWipCalculations(wipID); 
        }

        visionBoardsData = await getBoardsByUserID(user.id);
    }

    return (
        <WIPPageClient 
        user={user} 
        wipData={wipData}
        comments={comments}
        calculations={calculations}
        visionBoardsData = {visionBoardsData} />
    )
    
}