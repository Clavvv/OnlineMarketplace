import { NextResponse } from "next/server"
import { sendQuery } from "../../../utils/db_connector"

const columnMappings: Record<string, string> = {

    sizeID: 'size_ID',
    size: 'size',
    categoryID: 'category_id'
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

    // we use this join to only select sizes which have an 'active' category_id meaning if we delete the category_id in categories we wont
    // select the sizes which used to belong to that id. They still exist in the database though so you must be careful during later queries

    let query = `SELECT * FROM sizes s
                    JOIN categories c ON s.category_id = c.category_id;`

    const responseData = await sendQuery(query)
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function PUT(request: Request) {

    const { sizeID, size, categoryID } = await request.json()

    const updateQuery = `
                        UPDATE sizes
                        SET
                        size = '${size}',
                        category_id = '${categoryID}'
                        WHERE
                        size_id = ${sizeID}
                        RETURNING *;`

    try {
        const databaseResponse = await sendQuery(updateQuery)
        const updatedSize = databaseResponse[0]

        return new Response(JSON.stringify(updatedSize), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        })


    } catch (error) {
        console.error("Error updating size:", error);
    }

    return new Response(JSON.stringify({ 'test': 'not real response' }))
}

export async function DELETE(request: Request) {

    const queryData = await request.json()
    let query = `DELETE FROM sizes WHERE size_id = ${queryData.size_id}`
    const databaseResponse = await sendQuery(query)

    return new Response(JSON.stringify({ data: databaseResponse }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}

export async function POST(request: Request) {

    const queryData = await request.json()
    const { size, categoryID } = queryData

    try {

        console.log(size, categoryID)

        const insertQuery = `INSERT INTO sizes (size, category_id)
                            VALUES ('${size}', '${categoryID}')
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