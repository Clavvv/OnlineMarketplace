import { NextResponse } from "next/server"
import { sendQuery } from "../../../utils/db_connector"

const columnMappings: Record<string, string> = {

    productName: 'product_name',
    productPrice: 'product_price',
    productBrand: 'brand',
    productSize: 'size',
}

export async function POST(request: Request) {

    const queryData = await request.json()
    console.log(queryData)

    if (queryData.fetchAll) {
        let query = `SELECT * FROM products;`
        const responseData = await sendQuery(query)
        return new Response(JSON.stringify({data: responseData}), {
            status: 200,
            headers: {'Content-type': 'application/json'}
        })
    }

    else{
        console.log('custom query execution')
    }
}