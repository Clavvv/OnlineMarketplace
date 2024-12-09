import { NextResponse } from "next/server"
import {sendQuery, transactSQL} from "../../../utils/db_connector"

const columnMappings: Record<string, string> = {

    listingID: 'listing_ID',
    productID: 'product_ID',
    userID: 'userID',
    listingPrice: 'listing_price',
    status: 'status',
    condition: 'item_condition'
}


export async function GET() {

    let query = `SELECT * FROM listings ORDER BY listing_id ASC;`
    const responseData = await sendQuery(query)
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function PUT(request: Request) {
    const { listingID, productID, userID, listingPrice, status, condition } = await request.json();

    const updateQuery = `
        UPDATE listings 
        SET 
        product_id = '${productID}',
        user_id = '${userID}',
        listing_price = '${listingPrice}',
        status = '${status}',
        item_condition = '${condition}' 
        WHERE listing_id = ${listingID}
        RETURNING *;`;

    const deleteTransaction = `
        DELETE FROM transactions
        USING listings
        WHERE transactions.listing_id = listings.listing_id
        AND listings.status = 'Active';`

    try {
        const databaseResponse = await transactSQL([updateQuery, deleteTransaction]);
        const updatedListing = databaseResponse[0];

        return new Response(JSON.stringify(updatedListing), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error updating listing:', error);
        return new Response(JSON.stringify({ error: 'Failed to update listing' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(request: Request) {
    const queryData = await request.json()

    const deleteListing = `DELETE FROM listings WHERE listing_id = ${queryData.listing_id}`
    const deleteTransaction = `DELETE FROM transactions WHERE listing_id = ${queryData.listing_id}`

    const databaseResponse = await transactSQL([deleteListing, deleteTransaction])

    return new Response(JSON.stringify({ data: databaseResponse }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function POST(request: Request) {

    const queryData = await request.json()
    const { productID, userID, listingPrice, status, condition } = queryData
    console.log(queryData)

    try {

        const insertQuery = `INSERT INTO listings (product_id, user_id, listing_price, status, item_condition)
                            VALUES ('${productID}', '${userID}', ${listingPrice}, '${status}', '${condition}')
                            RETURNING *;`

        const databaseResponse = await sendQuery(insertQuery)

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