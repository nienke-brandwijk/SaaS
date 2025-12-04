import { redirect } from "react-router-dom";
import { getCurrentUser } from "../../lib/auth";
import CalculatorClient from "./client";
import { WIPS } from "../../src/domain/wips";
import { WIPDetails } from "../../src/domain/wipDetails";
import { getUserWIPDetails } from "../../src/controller/wipDetails.controller";
import { getWIPSByUserID } from "../../src/service/wips.service";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  let wipsData: WIPS[] = [];

  if (user?.id) {
    wipsData = await getWIPSByUserID(user.id);
  }

  
  return (
    <CalculatorClient
      user = {user}
      wipsData={wipsData} 
    />
  )
}