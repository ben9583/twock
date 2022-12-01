import { useRouter } from 'next/router'

const { Client } = require('pg')

const client = new Client()
await client.connect()

export default function Stock() {
    const router = useRouter()
    const { stock } = router.query

    return <p>Stock: { stock }</p>
}