// import { getCurrentUser } from "../../../lib/auth";
// import { WIPDetails } from "../../../src/domain/wipDetails";
// import { WIPS } from "../../../src/domain/wips";
// import { getWIPSByWipID } from "../../../src/service/wips.service";
// import WIPPageClient from "./client";

// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//     const user = await getCurrentUser();
    
//     const { id } = await params;
//     const WipID = parseInt(id);

//     let wipsData: WIPS[] = [];
//     let wipDetailsData: WIPDetails[] = [];

//     if (user?.id) { 
//         wipsData = await getWIPSByWipID(WipID);
//         wipDetailsData
//     }

//     return (
//         <WIPPageClient>
//             user={user}
//             wipsData={wipsData}
//         </WIPPageClient>
//     )
    
// }