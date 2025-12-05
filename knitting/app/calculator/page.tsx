import { redirect } from "react-router-dom";
import { getCurrentUser } from "../../lib/auth";
import CalculatorClient from "./client";
import { WIPS } from "../../src/domain/wips";
import { getWIPSByUserID } from "../../src/service/wips.service";
import { getUserCalculations } from "../../src/controller/calculation.controller";
import { Calculation } from "../../src/domain/calculation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  let wipsData: WIPS[] = [];
  let calculationsData: Calculation[] = [];

  if (user?.id) {
    wipsData = await getWIPSByUserID(user.id);
    calculationsData = await getUserCalculations(user.id);
  }

  
  return (
    <CalculatorClient
      user = {user}
      wipsData={wipsData} 
      calculationsData={calculationsData}
    />
  )
}