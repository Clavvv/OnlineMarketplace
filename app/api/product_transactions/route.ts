import { NextResponse } from "next/server"
import { sendQuery } from "../../../utils/db_connector"

export async function GET() {

    let query = `SELECT *
                        FROM product_transactions pt
                        JOIN transactions t ON pt.transaction_id = t.transaction_id
                        JOIN products p ON pt.product_id = p.product_id
                        WHERE t.transaction_id IS NOT NULL
                        ORDER BY pt.product_transaction_id ASC;`
    const responseData = await sendQuery(query)
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

// export async function PUT(request: Request) {
//
//     const { productsTransactionsID, transactionID, productID } = await request.json()
//
//     const updateQuery = `
//                         UPDATE product_transactions
//                         SET
//                         product_id = '${productID}',
//                         transaction_id = '${transactionID}'
//                         WHERE
//                         product_transaction_id = ${productsTransactionsID}
//                         RETURNING *;`
//
//     try {
//         const databaseResponse = await sendQuery(updateQuery)
//         const updatedEntry = databaseResponse[0]
//
//         return new Response(JSON.stringify(updatedEntry), {
//             status: 200,
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         })
//
//
//     } catch (error) {
//         console.error("Error updating entry:", error);
//     }
//
//     return new Response(JSON.stringify({ 'test': 'not real response' }))
// }
//
// export async function DELETE(request: Request) {
//     const queryData = await request.json()
//     let query = `DELETE FROM product_transactions WHERE product_transaction_id = ${queryData.pt_id}`
//     const databaseResponse = await sendQuery(query)
//
//     return new Response(JSON.stringify({ data: databaseResponse }), {
//         status: 200,
//         headers: { 'Content-type': 'application/json' }
//     })
// }
//
// export async function POST(request: Request) {
//
//     const queryData = await request.json()
//     const { transactionID, productID } = queryData
//     console.log(queryData)
//
//     try {
//
//         const insertQuery = `INSERT INTO product_transactions (transaction_id, product_id)
//                             VALUES ('${transactionID}', '${productID}')
//                             RETURNING *;`
//
//         const databaseResponse = await sendQuery(insertQuery)
//
//         return new Response(JSON.stringify(databaseResponse), {
//             status: 200,
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         })
//
//     } catch (error) {
//         console.error('UH OH CODE NO WORKO', error)
//     }
// }