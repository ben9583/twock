import { useRouter } from 'next/router'

const { Client } = require('pg')

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

    return {
        props: {epic: "xd"}, // will be passed to the page component as props
    }
}

export default function Stock(props) {
    console.log(props.epic)
    const router = useRouter()
    const { stock } = router.query

    return <p>Stock: { stock }</p>
}