## Setup

 1. Database from https://turso.tech/
 2. Get database token
	 * https://docs.turso.tech/sdk/go/quickstart
 3. Create a .env file
 4. Add **PORT** to env file
	 * Example `PORT=3000`
 5. Add **TURSO_URL** to env file. 
	 * Example: `TURSO_URL={TURSO_DATABASE_URL}?authToken={TURSO_DATABASE_URL}`
 6. Create tables using SQL from turso\tables.sql
