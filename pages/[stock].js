import { useRouter } from 'next/router'
import { getTweets } from '../lib/refresh'
import styles from '../styles/Stock.module.css'
import Image from 'next/image'
import { useState } from 'react'

export async function getServerSideProps(context) {
    return await getTweets(context.params.stock, false)
}



export default function Stock(props) {
    const router = useRouter()
    const { stock } = router.query

    const updateTweets = (data) => {
        let out = []

        if(data.success) {
            for(let i = 0; i < Math.min(data.data.length, data.includes.users.length); i++) {
                out.push(
                    <div className={styles.tweet} key={data.data[i].id}>
                        <div className={styles.tweetUser}>
                            <Image src={data.includes.users[i].profile_image_url} alt="Profile Image" width={50} height={50} />
                            <div>
                                <h3 className={styles.tweetUserName}>{data.includes.users[i].name}</h3>
                                <p className={styles.tweetUserHandle}>@{data.includes.users[i].username}</p>
                            </div>
                        </div>
                        <div className={styles.tweetContent}>
                            <p>{data.data[i].text}</p>
                            <p>{new Date(Date.parse(data.data[i].created_at)).toLocaleDateString('en-US')} at {new Date(Date.parse(data.data[i].created_at)).toLocaleTimeString('en-US')}</p>
                        </div>
                    </div>
                )
            }
        }

        return out;
    }

    const [ out, setOut ] = useState(updateTweets(props))

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <main className={styles.main}>
                <button className={styles.refreshButton} onClick={async () => {
                    const res = await fetch(`/api/refresh?stock=${stock}`);

                    if(res.status == 200) {
                        const data = await res.json();
                        setOut(updateTweets(data.props));
                    }
                }}>Update</button>
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
