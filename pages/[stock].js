import { useRouter } from 'next/router'
import { getOAuth2Token, searchTweets } from './utils/twitter'

const { Client } = require('pg')

let token = ''

export async function getServerSideProps(context) {
    require('dotenv').config()
    const client = new Client()
     
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            console.log('connected')
        }
    })
    
    const res1 = await client.query('SELECT $1::text as message', ['Hello world!'])
    
    const res2 = await client.query('SELECT i.* FROM twitter_user AS u, tweet_information AS i WHERE u.tu_user_id = i.ti_user_id AND u.tu_username = \'investred\'')

    console.log(res1.rows[0].message)
    console.log(res2.rows[0])
    console.log(res2.rows[0].message)
    client.end()

    if(token == '') token = await getOAuth2Token()
    const data = await searchTweets(token, "$" + context.params.stock);
    if(data.success == false) {
        if(data.error == 401) {
            token = await getOAuth2Token()
            const newData = await searchTweets(token, "$" + context.params.stock);

            if(newData.success == false) {
                console.log("Error retrieving tweets and refreshing token")
                return {
                    props: {
                        success: false,
                    }
                }
            }
        } else {
            console.log("Error retrieving tweets: " + data.error)
            return {
                props: {
                    success: false,
                }
            }
        }
    }

    return {
        props: data
    }
}

export default function Stock(props) {
    console.log(props)
    const router = useRouter()
    const { stock } = router.query

    return <p>Stock: { stock }</p>
}