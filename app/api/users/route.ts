import { sendQuery } from "../../../utils/db_connector"


//defining the format of the response object.
//this is how the frontend expects to see the keys formatted
interface ResponseObject {
    userID: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    feedbackScore: number;
    numItemsSold: number;
    numActiveListings: number;
}

//disgusting regex to replace _ with capital of the next char
const convertSnakeToCamel = (str: string): string =>
    str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

// Function to convert an object from snake_case to camelCase
function convertSnakeToCamelCaseForObject(obj: any): ResponseObject {
    const newObj: Partial<ResponseObject> = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const camelKey = convertSnakeToCamel(key);
            newObj[camelKey as keyof ResponseObject] = obj[key];
        }
    }

    return newObj as ResponseObject;
}

export async function PUT(request: Request) {

    const queryData = await request.json()
    const { firstName, lastName, email, phoneNumber, feedbackScore, numItemsSold, numActiveListings, userId } = queryData

    const updateQuery = `UPDATE users SET 
                        first_name = '${firstName}',
                        last_name = '${lastName}',
                        phone_number = '${phoneNumber}',
                        email = '${email}',
                        feedback_score = ${feedbackScore},
                        num_items_sold = ${numItemsSold},
                        num_active_listings = ${numActiveListings}
                        WHERE 
                        user_id = ${userId}
                        RETURNING *;`

    try {
        const databaseResponse = await sendQuery(updateQuery)
        const response = convertSnakeToCamelCaseForObject(databaseResponse[0])  // should only return one object since userId is unique

        console.log(response)

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('failed to update users', error)
        return new Response('failed to update user', { status: 500 })
    }
}

export async function GET(request: Request) {
    const selectAllQuery = `SELECT * FROM users ORDER BY user_id ASC;`;

    try {
        const databaseResponse = await sendQuery(selectAllQuery);
        const response: ResponseObject[] = [];

        // Change keys to match the way the frontend processes data 
        for (let obj of databaseResponse) {
            const newObj = convertSnakeToCamelCaseForObject(obj);
            response.push(newObj);
        }
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return new Response('Failed to fetch data', { status: 500 });
    }
}


export async function POST(request: Request) {

    // Will need to handle error and push to frontend if the phone_number and email are non-unique
    const queryData = await request.json()
    const { firstName, lastName, email, phoneNumber, feedbackScore, numItemsSold, numActiveListings } = queryData

    console.log(queryData)

    try {

        const insertQuery = `INSERT INTO users (first_name, last_name, phone_number, email, feedback_score, num_items_sold, num_active_listings)
                            VALUES ('${firstName}', '${lastName}', '${phoneNumber}', '${email}', ${feedbackScore}, ${numItemsSold}, ${numActiveListings})
                            RETURNING *;
                            `
        const databaseResponse = await sendQuery(insertQuery)
        const response: ResponseObject[] = []

        for (let obj of databaseResponse) {
            const newObj = convertSnakeToCamelCaseForObject(obj);
            response.push(newObj);
        }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        })

    } catch (error) {
        console.error('UH OH CODE NO WORKO', error)
    }
}



export async function DELETE(request:Request) {
    const queryData = await request.json()
    console.log(queryData)
    let deleteQuery = `DELETE FROM users WHERE user_id = ${queryData.userId}`

    const databaseResponse = await sendQuery(deleteQuery);
    return new Response(JSON.stringify({ data: databaseResponse }), {
        status: 200,
        headers: { 'Content-type': 'application/json' }
    })
}