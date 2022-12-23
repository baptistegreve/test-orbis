import React, { useState, useEffect } from 'react';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import { DIDSession } from 'did-session'
let ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
let session;

export default function App() {
  const [user, setUser] = useState();

  async function orbisConnect() {
    let provider = window.ethereum;

    let addresses;
		try {
			addresses = await provider.enable();
		} catch(e) {
			return {
				status: 300,
				error: e,
				result: "Error enabling Ethereum provider."
			}
		}

    let authMethod;
    let defaultChain = "1";
    let address = addresses[0].toLowerCase();
    let accountId = await getAccountId(provider, address)

    try {
			authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId)
		} catch(e) {
			return {
				status: 300,
				error: e,
				result: "Error creating Ethereum provider object for Ceramic."
			}
		}

    /** Step 3: Create a new session for this did */
		let did;
		try {
			/** Expire session in 90 days by default */
			const threeMonths = 60 * 60 * 24 * 90;

			session = await DIDSession.authorize(
				authMethod,
				{
					resources: [`ceramic://*`],
					expiresInSecs: threeMonths
				}
			);
			did = session.did;
		} catch(e) {
			return {
				status: 300,
				error: e,
				result: "Error creating a session for the DiD."
			}
		}

    ceramic.did = did;
    console.log("did:", did);
    setUser(true);
  }

  /** Create a post */
  async function share() {
    let res;

		/** Try to create TileDocument */
		try {
			let doc = await TileDocument.create(
				ceramic,
				/** Content of the post */
				{
          body: "test"
        },
				/** Metadata */
				{
					controllers: [session.id]
				},
			);

			/** Return JSON with doc object */
      alert("Success creating stream.");
			res = {
				status: 200,
				doc: doc.id.toString(),
				result: "Success creating TileDocument."
			}
		} catch(e) {
			console.log("Error creating TileDocument: ", e);
			res = {
				status: 300,
				error: e,
				result: "Error creating TileDocument."
			}
      alert("Error creating stream.");
		}

		/** Returning result */
		console.log(res);
  }

	return(
    <>
      <div className="main">
      {user ?
        <>
          <p>User is connected</p>
          <button onClick={() => share()}>Create post</button>
        </>
      :
        <>
          <p>User is NOT connected</p>
          <button onClick={() => orbisConnect()}>Connect</button>
        </>
      }
      </div>
    </>
	);
}
