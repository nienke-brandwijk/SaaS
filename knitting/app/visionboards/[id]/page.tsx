import { getCurrentUser } from "../../../lib/auth";
import VisionBoardDetailClient from "./client";
import { getVisionBoardByID } from "../../../src/controller/visionboard.controller";
import { getBoardComponents } from "../../../src/controller/component.controller";
import { getBoardImages } from "../../../src/controller/image.controller";
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const boardID = parseInt(params.id);
  const resolvedParams = await params;

  if (isNaN(boardID)) {
    notFound();
  }

  try {
    // Fetch alle data parallel
    const [board, components, images] = await Promise.all([
      getVisionBoardByID(boardID),
      getBoardComponents(boardID),
      getBoardImages(boardID)
    ]);

    if (!board) {
      notFound();
    }

    // Check of user eigenaar is
    if (user?.id !== board.userID) {
      notFound(); // Of redirect naar unauthorized page
    }

    return (
      <VisionBoardDetailClient
        user={user}
        board={board}
        components={components}
        images={images}
      />
    );
  } catch (error) {
    console.error('Error loading vision board:', error);
    notFound();
  }
}