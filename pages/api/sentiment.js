import { getTweets } from "../../lib/refresh";

const { Client } = require('pg')

export default async function handler(req, res) {
    const tweet_id = req.query.tweet_id;

    if(tweet_id === undefined || tweet_id === null || tweet_id === '') {
        res.status(400).json({ success: false, error: 'No tweet id provided' })
        return
    }

    const client = new Client()
        
    client.connect((err) => {
        if (err) {
            console.error('connection error', err.stack)
            res.status(500).json({ success: false, error: 'Database connection error' })
            return
        } else {
            console.log('connected')
        }
    })

    if(!Number.isInteger(parseInt(tweet_id))) {
        res.status(400).json({ success: false, error: 'Invalid tweet id' })
        return
    }

    const data = await client.query('SELECT * FROM tweet_information WHERE ti_tweet_id = $1', [tweet_id])

    if (data.rows[0] === undefined) {
        res.status(400).json({ success: false, error: 'No tweet found' })
        return
    }

    const spawn = require('child_process').spawn;

    const pythonProcess = spawn('python3',["sentiment.py", data.rows[0].ti_text])
    
    pythonProcess.stdout.on('data', (text) => {
        const textNoParens = text.toString().substring(1, text.length - 1)
        const output = textNoParens.split(',')
        const sentiment = parseFloat(output[0])
        const subjectivity = parseFloat(output[1])

        const res_output = {
            success: true,
            sentiment: sentiment,
            subjectivity: subjectivity
        }

        res.status(200).json(res_output)
    })
}