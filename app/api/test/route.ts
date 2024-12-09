import { sendTransaction } from "../../../utils/db_connector"

export async function POST(request:Request){

    const queries = ['test test']
    const responseData = await sendTransaction(queries)
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}