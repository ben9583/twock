import { useRouter } from 'next/router'
import { getOAuth2Token, searchTweets } from './utils/twitter'
import styles from '../styles/Stock.module.css'
import Image from 'next/image'

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
    let data = await searchTweets(token, context.params.stock);

    if(data.success == false) {
        if(data.error == 401) {
            token = await getOAuth2Token()
            data = await searchTweets(token, context.params.stock);

            if(data.success == false) {
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

    // Insert data into database
    for(let i = 0; i < Math.min(data.data.length, data.includes.users.length); i++) {
        const res3 = await client.query('INSERT INTO twitter_user (tu_user_id, tu_username, tu_profile_image_url) VALUES ($1, $2, $3) ON CONFLICT (tu_user_id) DO NOTHING', [data.includes.users[i].id, data.includes.users[i].username, data.includes.users[i].profile_image_url])
        const res4 = await client.query('INSERT INTO tweet_information (ti_tweet_id, ti_user_id, ti_text, ti_unix_timestamp, ti_s_symbol) VALUES ($1, $2, $3, $4, %5) ON CONFLICT (ti_tweet_id) DO NOTHING', [data.data[i].id, data.includes.users[i].id, data.data[i].text, Date.parse(data.data[i].created_at), context.params.stock])

        console.log(res3)
        console.log(res4)
    }

    return {
        props: data
    }
}

export default function Stock(props) {
    const router = useRouter()
    const { stock } = router.query

    let out = []

    if(props.success) {
        for(let i = 0; i < Math.min(props.data.length, props.includes.users.length); i++) {
            out.push(
                <div className={styles.tweet} key={props.data[i].id}>
                    <div className={styles.tweetUser}>
                        <Image src={props.includes.users[i].profile_image_url} alt="Profile Image" width={50} height={50} />
                        <div>
                            <h3 className={styles.tweetUserName}>{props.includes.users[i].name}</h3>
                            <p className={styles.tweetUserHandle}>@{props.includes.users[i].username}</p>
                        </div>
                    </div>
                    <div className={styles.tweetContent}>
                        <p>{props.data[i].text}</p>
                        <p>{props.data[i].created_at}</p>
                    </div>
                </div>
            )
        }
    }

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <main className={styles.main}>
                <h1 className={styles.title}>{stock}</h1>
                <hr className={styles.line} />
                <div>
                    <h2 className={styles.subtitle}>Tweets</h2>
                    {
                        props.success ? out : <div><p>Failed to retrieve tweets</p></div>
                    }
                </div>
            </main>
        </div>
    )
}