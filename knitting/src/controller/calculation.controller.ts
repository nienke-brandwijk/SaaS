import { createCalculation as createCalculationService } from '../service/calculation.service';

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