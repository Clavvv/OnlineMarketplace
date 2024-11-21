import 'dotenv/config';
import { neon } from '@neondatabase/serverless';


export async function sendQuery(query:string) {

    const connString = process.env.DATABASE_URL


    if (!connString) {
        throw new Error("Missing Database connection data")
    }
    
    const sql = neon(connString);
    const response = await sql(query)

    return response
}