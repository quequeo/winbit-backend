/**
 * Google Sheets API service
 * Reads data from Google Sheets using the Sheets API v4
 */

interface SheetValuesResponse {
  values: string[][];
}

export async function getDashboardSheetData(): Promise<{
  headers: string[];
  rows: string[][];
  error: string | null;
}> {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
    const SHEET_NAME = 'DASHBOARD';

    if (!SHEET_ID || !API_KEY) {
      return {
        headers: [],
        rows: [],
        error: 'Google Sheets credentials not configured',
      };
    }

    // Fetch data from Google Sheets API
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A:Z?key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          headers: [],
          rows: [],
          error: `Sheet "${SHEET_NAME}" not found`,
        };
      }
      const errorText = await response.text();
      return {
        headers: [],
        rows: [],
        error: `Google Sheets API error: ${response.status} - ${errorText}`,
      };
    }

    const data: SheetValuesResponse = await response.json();
    const values = data.values || [];

    if (values.length === 0) {
      return {
        headers: [],
        rows: [],
        error: 'No data found in sheet',
      };
    }

    // First row is headers, rest are data rows
    const headers = values[0] || [];
    const rows = values.slice(1);

    return {
      headers,
      rows,
      error: null,
    };
  } catch (error) {
    return {
      headers: [],
      rows: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

