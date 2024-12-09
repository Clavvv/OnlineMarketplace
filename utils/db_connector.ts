import 'dotenv/config';
import { neon } from '@neondatabase/serverless';


export async function sendQuery(query:string) {

    const connString = process.env.DATABASE_URL

    if (!connString) {
        throw new Error("unable to connect to the database")
    }

    console.log(query)
    
    const sql = neon(connString);
    const response = await sql(query)

    return response
}

export async function transactSQL(queries:string[]){

    const connString = process.env.DATABASE_URL
    /*const input = [
        `INSERT INTO transactions 
          (buyer_id, seller_id, listing_id)
        VALUES 
          ('1', '4', '40')
        RETURNING *;`,
      
        `UPDATE listings
          SET status = 'sold'
        WHERE listing_id = 40;`
      ]*/


    if (!connString) {
        throw new Error('unable to connect to the database')
    }

    console.log('handling transaction: ', queries)
    const sql = neon(connString)

    let insertResult = null; // Variable to store the result of the INSERT query

    try {
        await sql('BEGIN');
        for (let query of queries) {
            const result = await sql(query);
            // Check if this is the INSERT query and capture its result
            if (query.trim().startsWith('INSERT INTO transactions')) {
                insertResult = result[0];
            }
        }
        await sql('COMMIT');
        // Return the result of the INSERT query
        return insertResult;
    } catch (error) {
        console.log('TRANSACTION FAILED...ROLLING BACK: ', error);
        await sql('ROLLBACK');
        throw error;
    }
}