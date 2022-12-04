import { useRouter } from 'next/router'
import { getTweets } from '../lib/refresh'
import styles from '../styles/Stock.module.css'
import { useState } from 'react'
import Tweet from '../components/Tweet'

export async function getServerSideProps(context) {
    return await getTweets(context.params.stock, false)
}

export default function Stock(props) {
    const router = useRouter()
    const { stock } = router.query

    const [data, setData] = useState(props);

    const numTweets = Math.min(props.data.length, props.includes.users.length);

    let tweetIdxArr = [];
    for(let i = 0; i < numTweets; i++) {
        tweetIdxArr.push(i);
    }

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <main className={styles.main}>
                <button className={styles.refreshButton} onClick={async () => {
                    const res = await fetch(`/api/refresh?stock=${stock}`);

                    if(res.status == 200) {
                        const data = await res.json();
                        setData(data.props);
                    }
                }}>Update</button>
                <h1 className={styles.title}>{stock}</h1>
                <hr className={styles.line} />
                <div>
                    <h2 className={styles.subtitle}>Tweets</h2>
                    
                    {
                        data.success ? tweetIdxArr.map((elem) => {
                            return <Tweet key={data.data[elem].id} data={data.data[elem]} user={data.includes.users[elem]} />
                        }) : <div><p>Failed to retrieve tweets</p></div>
                    }
                </div>
            </main>
        </div>
    )
}
