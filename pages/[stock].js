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

    return { props: {
        "data": [
          {
            "created_at": "2022-12-03T20:18:15.000Z",
            "edit_history_tweet_ids": [
              "1599135949484883968"
            ],
            "id": "1599135949484883968",
            "text": "RT @akalenny39: Not a bad month! #AMC $APE #AAPL #twitterfiles #Competition #vegan I love going to the movies. #love $amc https://t.co/7Z8b…"
          },
          {
            "created_at": "2022-12-03T20:17:41.000Z",
            "edit_history_tweet_ids": [
              "1599135808375910400"
            ],
            "id": "1599135808375910400",
            "text": "Log into the FREE Trade Ideas Live Trader's Room and interact with the community and Trade Ideas team! Check out now via:- https://t.co/h4cL8bEiMk\n\n#investing \n#stocks \n$AMC \n$tsla \n$ETH \n$XRP \n$NFLX \n$LTC \n$SPY $amzn $aapl $msft #trading #Options https://t.co/apZwEtl35L"
          },
          {
            "created_at": "2022-12-03T20:17:39.000Z",
            "edit_history_tweet_ids": [
              "1599135800381538305"
            ],
            "id": "1599135800381538305",
            "text": "$AAPL - Apple looking to move iPhone production out of China in wake of violent worker protests: report https://t.co/E6cyGFDI8S"
          },
          {
            "created_at": "2022-12-03T20:17:35.000Z",
            "edit_history_tweet_ids": [
              "1599135779816890369"
            ],
            "id": "1599135779816890369",
            "text": "$AAPL $AMZN $AVGO $GOOG $GOOGL $META $NVDA $TSLA $UNH $XOM - These Were the Five Best and Worst Performing Mega-Cap Stocks in November 2022 https://t.co/CUtllEJ5bP"
          },
          {
            "created_at": "2022-12-03T20:17:32.000Z",
            "edit_history_tweet_ids": [
              "1599135767388749824"
            ],
            "id": "1599135767388749824",
            "text": "$DXY is back testing a falling wedge in the 3 min, and a larger falling wedge on the 1 D. It looks like it should start up soon. DXY PA on the daily also mimics recent PA on $AAPL (light blue line) https://t.co/GZFjLT5Hgk"
          },
          {
            "created_at": "2022-12-03T20:17:13.000Z",
            "edit_history_tweet_ids": [
              "1599135690297442304"
            ],
            "id": "1599135690297442304",
            "text": "@RaisingTheBAR47 @junkbondinvest Really? I’ve been buying $MO $BTI $SPG and Phillip Morris bonds like crazy didn’t see $AAPL probably because my yield filter was set to 6.5% + What CUSIP? I’m buying."
          },
          {
            "created_at": "2022-12-03T20:16:06.000Z",
            "edit_history_tweet_ids": [
              "1599135407236472832"
            ],
            "id": "1599135407236472832",
            "text": "RT @GOK_HAN_38: #GLCVY Doğru Yatırımcı Sayfasi https://t.co/4KVENzx3u1\n#aapl #abnb #adbe #adi #adp #adsk #aep #algn #amat #amd #amgn #amzn…"
          },
          {
            "created_at": "2022-12-03T20:15:36.000Z",
            "edit_history_tweet_ids": [
              "1599135281206112256"
            ],
            "id": "1599135281206112256",
            "text": "RT @LookN4gainz: $AAPL 👀👀 https://t.co/1I50pfRBB5"
          },
          {
            "created_at": "2022-12-03T20:15:24.000Z",
            "edit_history_tweet_ids": [
              "1599135231902375937"
            ],
            "id": "1599135231902375937",
            "text": "$AAPL  $4500 a day keeps the 9 to 5 away; For a limited time, we are opening our trading chat-room to the public.,,..&gt;\n https://t.co/9ZHkYcIYWZ"
          },
          {
            "created_at": "2022-12-03T20:14:48.000Z",
            "edit_history_tweet_ids": [
              "1599135079452020736"
            ],
            "id": "1599135079452020736",
            "text": "RT @cs_tradess: 🚨A thread on my day trading strategy. So simple and effective many who learn it refer to it as the \"the market cheat code\"!…"
          }
        ],
        "meta": {
          "newest_id": "1599135949484883968",
          "oldest_id": "1599135079452020736",
          "result_count": 10,
          "next_token": "b26v89c19zqg8o3fpzhn036gmjxj2p1husa8h9fx1wnzx"
        },
        "success": true
      } };

    if(token == '') token = await getOAuth2Token()
    const data = await searchTweets(token, context.params.stock);
    if(data.success == false) {
        if(data.error == 401) {
            token = await getOAuth2Token()
            const newData = await searchTweets(token, context.params.stock);

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

    return (
        <main>
            <h1>{stock}</h1>
        </main>
    )
}