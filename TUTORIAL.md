# Tutorial: Embed Zeronym into Your Dapp Using Silk

Zeronym is a privacy-preserving identity protocol. Users who verify receive SBTs attesting to their verification. For example, a user can prove that they are a unique person by verifying their government ID.

Zeronym ships within Silk, our 2PC-MPC wallet which maximizes security and UX.

This tutorial shows how to embed Zeronym and Silk into your dapp.

## Setup

We will use Vite, React, and Viem for this demo.

Create a new app.

    npm create vite@latest zeronym-silk-demo -- --template react-ts

Install the Silk SDK.

    npm i @silk-wallet/silk-wallet-sdk@0.1.0

## Prompt user for SBT

Our UI will have two buttons: a login button and a "Get SBT" button.

The user must login to Silk in order to interact with the wallet provider.

The "Get SBT" button will prompt the user to complete the KYC flow. At the end of this flow, they will get an SBT. The `requestSBT` function returns the recipient of this SBT.

Replace the Vite boilerplate with the following.

    // src/App.tsx
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    import { useState, useEffect } from 'react'
    import { initSilk } from '@silk-wallet/silk-wallet-sdk'
    import './App.css'

    function App() {
        const [sbtRecipient, setSBTRecipient] = useState<string | null>(null)

        useEffect(() => {
            // Initialize the Silk SDK. This puts the Silk iframe on the
            // page and instantiates the Silk provider, which we will use
            // to interact with the user's wallet.
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
            </>
        )
    }

    export default App

You're users can now get Zeronym SBTs from within your dapp!

## Verify SBT ownership

You will want to check your users' addresses to see if they have SBTs. We will use the Holonym API for this.

In App.tsx, add the following.

    const [hasSBT, setHasSBT] = useState<string>('unknown')

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

In the JSX portion of App.tsx, add the following.

    <div className="card">
        <button onClick={getSBTOwnershipStatus}>
            Verify SBT ownership
        </button>
        
        <p>User has SBT: {hasSBT}</p>
    </div>

## Conclusion

That's it! Our app prompts users to get Zeronym KYC SBTs and verifies SBT ownership.

Check out our docs:
- Silk: https://docs.silk.sc/integrate/quickstart/embed-and-integrate
- Zeronym: https://docs.holonym.id/for-developers/start-here#option-b-via-silk-sdk
- Holonym API: https://github.com/holonym-foundation/holonym-api?tab=readme-ov-file#endpoints
