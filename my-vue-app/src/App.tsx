import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { bufferToBase64, encryptData, importKey } from './crypto';

let init = true;
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function fetchTest(){

      const resp1 = await fetch('http://localhost:3000/api/key')
      const {publicKey} = await resp1.json()
      console.log('publicKey', publicKey)

      const importedPublicKey = await importKey(publicKey, "encrypt");

      const encrypted = await encryptData(importedPublicKey, "Hello!");
  
      // Convert encrypted data to string (Base64)
      const encryptedString = bufferToBase64(encrypted);
      console.log("Encrypted Data:", encryptedString);

      const resp = await fetch('http://localhost:3000/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: encryptedString
        })
      })

      const json = await resp.json()
      console.log("json", json)
    }
    if (init) {
      fetchTest()
      init = false
    }
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
