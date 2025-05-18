import { expect } from "@playwright/test";

export async function initializeDatabase({ request }) {
    // Clean database
    const cleanDbResponse = await request.post("/parabank/services/bank/cleanDB");
    expect(cleanDbResponse.status()).toBe(204);
    
    // Initialize database
    const initDbResponse = await request.post("/parabank/services/bank/initializeDB");
    expect(initDbResponse.status()).toBe(204);
}