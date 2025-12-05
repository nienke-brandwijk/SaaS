import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";
import WIPPageClient from "./client";
import { VisionBoard } from "../../src/domain/visionboard";
import { getBoardsByUserID } from "../../src/service/visionboard.service";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    
    const { id } = await params;
    let visionBoardsData: VisionBoard[] = [];

    if( user?.id) {
        visionBoardsData = await getBoardsByUserID(user.id);
    }

    return (
        <WIPPageClient 
        user={user}
        visionBoardsData = {visionBoardsData} />
    )
    
}