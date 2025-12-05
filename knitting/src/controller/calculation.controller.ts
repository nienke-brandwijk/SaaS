import { createCalculation as createCalculationService, getCalculationsByUserID as getCalculationsService, deleteCalculation as deleteCalculationService,
  deleteAllCalculationsByUserID as deleteAllCalculationsService, updateCalculationWipID as updateCalculationWipIDService
 } from '../service/calculation.service';

export const createNewCalculation = async (
  calculationInputX: string,
  calculationInputY: string,
  calculationOutput: string,
  calculationName: string,
  userID: string
) => {
  try {
    const newCalculation = await createCalculationService({
      calculationInputX,
      calculationInputY,
      calculationOutput,
      calculationName,
      userID,
      wipID: null,
    });
    
    return newCalculation;
  } catch (error) {
    console.error('Error creating calculation:', error);
    throw error;
  }
};

export const getUserCalculations = async (userID: string) => {
  try {
    const calculations = await getCalculationsService(userID);
    return calculations;
  } catch (error) {
    console.error('Error fetching calculations:', error);
    throw error;
  }
};

export const deleteCalculation = async (calculationID: number) => {
  try {
    await deleteCalculationService(calculationID);
    return { success: true };
  } catch (error) {
    console.error('Error deleting calculation:', error);
    throw error;
  }
};

export const deleteAllCalculations = async (userID: string) => { 
  try {
    await deleteAllCalculationsService(userID); 
    return { success: true };
  } catch (error) {
    console.error('Error deleting all calculations:', error);
    throw error;
  }
};

export const updateCalculationWipID = async (
  calculationID: number, 
  wipID: number
) => {
  try {
    const updatedCalculation = await updateCalculationWipIDService(calculationID, wipID);
    return updatedCalculation;
  } catch (error) {
    console.error('Error updating calculation wipID:', error);
    throw error;
  }
};