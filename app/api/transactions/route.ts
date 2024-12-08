import { NextResponse } from "next/server"
import { sendQuery } from "../../../utils/db_connector"

export async function GET() {

    let query = `SELECT * FROM transactions ORDER BY transaction_id ASC;`
    const responseData = await sendQuery(query)
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function PUT(request: Request) {

    const { transactionID, buyerID, sellerID, listingID, transactionDate } = await request.json()

    const updateQuery = `
                        UPDATE transactions 
                        SET 
                        buyer_id = '${buyerID}',
                        seller_id = '${sellerID}',
                        listing_id = '${listingID}',
                        transaction_date = '${transactionDate}' 
                        WHERE
                        transaction_id = ${transactionID}
                        RETURNING *;`

    try {
        const databaseResponse = await sendQuery(updateQuery)
        const updatedTransaction = databaseResponse[0]
        console.log(updatedTransaction)

        return new Response(JSON.stringify(updatedTransaction), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        })


    } catch (error) {
        console.error("Error updating transaction:", error);
    }

    return new Response(JSON.stringify({ 'test': 'not real response' }))
}

export async function DELETE(request: Request) {
    const queryData = await request.json()
    let query = `DELETE FROM transactions WHERE transaction_id = ${queryData.transaction_id}`
    const databaseResponse = await sendQuery(query)

    return new Response(JSON.stringify({ data: databaseResponse }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function POST(request: Request) {

    const queryData = await request.json()
    const { buyerID, sellerID, listingID, transactionDate } = queryData
    console.log(queryData)

    try {

        const insertQuery = `INSERT INTO transactions (buyer_id, seller_id, listing_id, transaction_date)
                            VALUES ('${buyerID}', '${sellerID}', '${listingID}', '${transactionDate}')
                            RETURNING *;`

        const databaseResponse = await sendQuery(insertQuery)
        console.log(databaseResponse)

        return new Response(JSON.stringify(databaseResponse), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        })

    } catch (error) {
        console.error('UH OH CODE NO WORKO', error)
    }
}