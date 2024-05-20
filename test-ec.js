async function generateECKeyPair() {
    return globalThis.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );
  }
  
  async function deriveSharedKey(privateKey, publicKey) {
    return globalThis.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: publicKey,
      },
      privateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }
  
  async function encryptData(key, data) {
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encodedData = new TextEncoder().encode(data);
    
    const encrypted = await globalThis.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );
  
    return { iv, encrypted };
  }
  
  async function decryptData(key, iv, encryptedData) {
    const decrypted = await globalThis.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedData
    );
  
    return new TextDecoder().decode(decrypted);
  }
  
  (async () => {
    // Generate key pairs for two parties
    const keyPairA = await generateECKeyPair();
    const keyPairB = await generateECKeyPair();
  
    // Derive shared keys
    const sharedKeyA = await deriveSharedKey(keyPairA.privateKey, keyPairB.publicKey);
    const sharedKeyB = await deriveSharedKey(keyPairB.privateKey, keyPairA.publicKey);
  
    // Ensure both keys are the same
    const data = "Hello, World!";
    
    const { iv, encrypted } = await encryptData(sharedKeyA, data);
    console.log("Encrypted Data:", new Uint8Array(encrypted));
    
    const decrypted = await decryptData(sharedKeyB, iv, encrypted);
    console.log("Decrypted Data:", decrypted);
  })();
  