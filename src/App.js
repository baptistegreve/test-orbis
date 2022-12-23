import React, { useState, useEffect } from 'react';
import { Orbis } from "@orbisclub/orbis-sdk";


/** Initialize the Orbis class object */
let orbis = new Orbis({
  node: 'https://node2.orbis.club/'
});
export default function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    checkConnectToOrbis();
  }, [])

  async function checkConnectToOrbis() {
    let res = await orbis.isConnected();
    console.log("Result from isConnected: ", res);
    if(res.status == 200) {
      setUser(res.details);
    }
  }

	return(
    <>
      <div className="main">
      {user ?
        <p>User is connected</p>
      :
        <p>User is NOT connected</p>
      }
      </div>
    </>
	);
}
