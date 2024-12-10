import { NextResponse } from "next/server"
import {sendQuery, transactSQL} from "../../../utils/db_connector"

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
    console.log(queryData)
    const { transactionID, listingID } = queryData

    const deleteTransaction = `DELETE FROM transactions WHERE transaction_id = ${transactionID}`

    const markListingAvail = `UPDATE listings
                              SET
                                  status = 'Active'
                              WHERE 
                                  listing_id = ${listingID};`


    const databaseResponse = await transactSQL([deleteTransaction, markListingAvail])

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

        const insertTransaction = `INSERT INTO transactions (buyer_id, seller_id, listing_id)
                                   VALUES ('${buyerID}', '${sellerID}', '${listingID}')
                                   RETURNING *;`

        const markListingSold = `UPDATE listings
                                 SET 
                                    status = 'Sold'
                                 WHERE 
                                     listing_id = ${listingID};`

        const insertInPTtable = `INSERT INTO product_transactions (transaction_id, product_id)
                                 SELECT 
                                    t.transaction_id, 
                                    l.product_id
                                 FROM transactions t
                                 JOIN listings l 
                                 ON 
                                     t.listing_id = l.listing_id
                                 WHERE 
                                     t.listing_id = ${listingID}
                                 ORDER BY 
                                     t.transaction_id DESC
                                 LIMIT 1;`

        const databaseResponse = await transactSQL([insertTransaction, markListingSold, insertInPTtable])
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