import { NextResponse } from "next/server"
import { sendQuery } from "../../../utils/db_connector"

const columnMappings: Record<string, string> = {

    categoryID: 'category_ID',
    categoryName: 'category_name',
    demographic: 'demographic'
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

    let query = `SELECT * FROM categories;`
    const responseData = await sendQuery(query)
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function PUT(request: Request) {

    const { categoryID, categoryName, demographic } = await request.json()

    const updateQuery = `
                        UPDATE categories 
                        SET 
                        demographic = '${demographic}',
                        category_name = ${categoryName}
                        WHERE
                        category_id = ${categoryID}
                        RETURNING *;`

    try {
        const databaseResponse = await sendQuery(updateQuery)
        const updatedCategory = databaseResponse[0]

        return new Response(JSON.stringify(updatedCategory), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        })


    } catch (error) {
        console.error("Error updating category:", error);
    }

    return new Response(JSON.stringify({ 'test': 'not real response' }))
}

export async function DELETE(request: Request) {

    const queryData = await request.json()
    let query = `DELETE FROM categories WHERE category_id = ${queryData.category_id}`
    const databaseResponse = await sendQuery(query)

    return new Response(JSON.stringify({ data: databaseResponse }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function POST(request: Request) {

    const queryData = await request.json()
    const { categoryID, categoryName, demographic } = queryData
    // const category_id = categoryIDMappings[category + demographic]

    // const sizeQuery = `
    //     SELECT size_id FROM sizes
    //         WHERE category_id = ${category_id}
    //         AND size = '${size}'
    //     LIMIT 1;`

    try {

        // const sizeResponse = await sendQuery(sizeQuery)
        // const { size_id } = sizeResponse[0]
        // if (!size_id) {
        //     return new Response(JSON.stringify({ error: 'given size was not valid for product' }), { status: 404 })
        // }

        console.log(categoryName, demographic, categoryID)

        const insertQuery = `INSERT INTO categories (category_name, demographic, category_ID)
                            VALUES ('${categoryName}', '${demographic}', ${categoryID})
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