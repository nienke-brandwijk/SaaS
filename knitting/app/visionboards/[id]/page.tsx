import { getCurrentUser } from "../../../lib/auth";
import VisionBoardClient from "../client";

export default async function Page() {
    const user = await getCurrentUser();
      
      return (
        <VisionBoardClient
          user = {user}
        />
      )
}