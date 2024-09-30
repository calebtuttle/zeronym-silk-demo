/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react'
import { initSilk } from '@silk-wallet/silk-wallet-sdk'
import './App.css'

function App() {
  const [sbtRecipient, setSBTRecipient] = useState<string | null>(null)

  const [hasSBT, setHasSBT] = useState<string>('unknown')

  useEffect(() => {
    // Initialize the Silk SDK. This puts the Silk iframe on the page
    // and instantiates the Silk provider, which we will call to interact
    // with the user's wallet.
    // @ts-ignore
    window.silk = initSilk()
  }, [])

  const onClickLogin = () => {
    // @ts-ignore
    window.silk.login()
      .catch(console.error)
  }

  const onClickGetSBT = () => {
    // @ts-ignore
    window.silk.requestSBT('kyc')
      // @ts-ignore
      .then((result: string | null) => {
        setSBTRecipient(result)
      })
      .catch(console.error)
  }

  // Determine whether the user has the KYC SBT.
  const getSBTOwnershipStatus = async () => {
    try {
      // Get the user's Silk wallet address
      // @ts-ignore
      const addresses = await window.silk.request({
        method: 'eth_requestAccounts',
      })
      const userAddress = addresses[0]

      const resp = await fetch(`https://api.holonym.io/sbts/kyc?address=${userAddress}`)
      const data = await resp.json()
      console.log('data', data)
      setHasSBT(data.hasValidSbt.toString())
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <h1>Silk + Zeronym</h1>

      <div className="card">
        <button onClick={onClickLogin}>
          Login
        </button>
      </div>

      <div className="card">
        <button onClick={onClickGetSBT}>
          Get SBT
        </button>
        
        <p>SBT Recipient: {sbtRecipient}</p>
      </div>

      <div className="card">
        <button onClick={getSBTOwnershipStatus}>
          Verify SBT ownership
        </button>
        
        <p>User has SBT: {hasSBT}</p>
      </div>
    </>
  )
}

export default App
