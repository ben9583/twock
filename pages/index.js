import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Router from 'next/router'

const stocks = require('stock-ticker-symbol')

export default function Home() {
  let [ symbol, setSymbol ] = useState("")
  let [ errored, setErrored ] = useState("hidden")

  function goButtonPress() {
    if (stocks.lookup(symbol) == null)
    {
      setErrored("visible")
    }
    else {
      Router.push("/" + symbol.toUpperCase())
    }
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Twock</title>
        <meta name="Twock" content="A tool to view Twitter's opinions on stocks." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 style={{fontSize: "15rem", marginBottom: "1rem", marginTop: "-8rem"}}>Twock</h1>
        <div>
          <input
            className={styles.symbolInput}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                goButtonPress()
              }
            }}
            placeholder="Enter symbol here"
          />
          <button 
            className={styles.goButton}
            onClick={goButtonPress}
          >
            Go!
          </button>
        </div>
        <h1 style={{color: "red", visibility: errored}}>Invalid stock symbol!</h1>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by CSE 412
        </a>
      </footer>
    </div>
  )
}
