import { transactSQL } from "../../../utils/db_connector"

export async function POST(request:Request){

    const queries = ['test test']
    const responseData = await transactSQL(queries)
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}