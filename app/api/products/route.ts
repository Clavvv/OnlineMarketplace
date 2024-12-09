import { NextResponse } from "next/server"
import { sendQuery } from "../../../utils/db_connector"

const columnMappings: Record<string, string> = {

    productName: 'product_name',
    productPrice: 'product_price',
    productBrand: 'brand',
    productSize: 'size',
}

const categoryIDMappings: Record<string, number> = {
    "shirtK": 1,
    "shirtM": 2,
    "shirtW": 3,
    "shoesK": 4,
    "shoesM": 5,
    "shoesW": 6,
    "pantsK": 7,
    "pantsM": 8,
    "pantsW": 9
}


export async function GET() {

    let query = `SELECT p.product_id, p.brand, p.size_id, p.product_name, c.category_name, c.demographic
                    FROM products p
                    JOIN categories c on p.category_id = c.category_id;`
    const responseData = await sendQuery(query)
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function PUT(request: Request) {

    const { productID, productName, brand } = await request.json()
    const getCategoryIdByProductID = `SELECT p.product_id, c.category_id
                                        FROM products p
                                        JOIN sizes s ON p.size_id = s.size_id
                                        JOIN categories c on s.category_id = c.category_id
                                        WHERE p.product_id = ${productID}`


    const getCategoryIdByProductIDResponse = await sendQuery(getCategoryIdByProductID)
    const { category_id } = getCategoryIdByProductIDResponse[0]

    const testQuery = `WITH updated_product AS (
                        UPDATE products p
                        SET
                        product_name = '${productName}',
                        brand = '${brand}',
                        category_id = ${category_id}
                    WHERE
                        product_id = ${productID}
                    RETURNING *)
                    SELECT 
                    p.product_id,
                    p.product_name,
                    p.brand,
                    p.size_id,
                    c.category_name,
                    c.demographic
                    FROM updated_product p
                    JOIN categories c ON p.category_id = c.category_id;`

    try {
        const databaseResponse = await sendQuery(testQuery)
        const updatedProduct = databaseResponse[0]
        console.log(databaseResponse)

        return new Response(JSON.stringify(updatedProduct), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        })


    } catch (error) {
        console.error("Error updating product:", error);
    }

    return new Response(JSON.stringify({ 'test': 'not real response' }))
}

export async function DELETE(request: Request) {

    const queryData = await request.json()
    let query = `DELETE FROM products WHERE product_id = ${queryData.product_id}`
    const databaseResponse = await sendQuery(query)

    return new Response(JSON.stringify({ data: databaseResponse }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function POST(request: Request) {

    const queryData = await request.json()
    const { productName, brand, size, demographic, category } = queryData
    const category_id = categoryIDMappings[category + demographic]

    const sizeQuery = `
        SELECT size_id FROM sizes
            WHERE category_id = ${category_id}
            AND size = '${size}'
        LIMIT 1;`

    try {

        const sizeResponse = await sendQuery(sizeQuery)
        const { size_id } = sizeResponse[0]
        if (!size_id) {
            return new Response(JSON.stringify({ error: 'given size was not valid for product' }), { status: 404 })
        }

        console.log(size_id)
        console.log(productName, brand, size, demographic, category_id)

        const insertQuery = `INSERT INTO products (product_name, brand, size_id, category_id)
                            VALUES ('${productName}', '${brand}', ${size_id}, ${category_id})
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