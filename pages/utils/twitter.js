require('dotenv').config()

const TWITTER_API_ENDPOINT = 'https://api.twitter.com'

async function getOAuth2Token() {
    const endpoint = `${TWITTER_API_ENDPOINT}/oauth2/token`

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_SECRET_KEY}`).toString('base64')}`,
        },
        body: {
            grant_type: 'client_credentials',
        }
    })

    const data = await response.json()
    return data.access_token
}

async function searchTweets(token, query) {
    const endpoint = `${TWITTER_API_ENDPOINT}/2/tweets/search/recent?query=${query}&user.fields=username,profile_image_url&tweet.fields=text,created_at`

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json()
    return data
}

export { getOAuth2Token, searchTweets }
