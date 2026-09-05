import { API_BASE_URL } from './connection'
import type { ChecklistResponse } from '../types/checklist'

export async function generateChecklist(productName: string, intendedUse: string): Promise<ChecklistResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/checklist/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: productName, intended_use: intendedUse }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data as ChecklistResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.warn('Network error or CORS issue.');
    }
    throw error;
  }
}
