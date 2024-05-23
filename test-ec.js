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

function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function ecEncryptData(privateKey, publicKey, data) {
  const sharedKey = await deriveSharedKey(privateKey, publicKey);
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const encodedData = new TextEncoder().encode(data);

  const encrypted = await globalThis.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    sharedKey,
    encodedData
  );

  const ivBase64 = arrayBufferToBase64(iv);
  const encryptedBase64 = arrayBufferToBase64(encrypted);

  return `${ivBase64}:${encryptedBase64}`;
}

async function ecDecryptData(privateKey, publicKey, combinedBase64) {
  const sharedKey = await deriveSharedKey(privateKey, publicKey);
  const [ivBase64, encryptedBase64] = combinedBase64.split(":");
  const iv = base64ToArrayBuffer(ivBase64);
  const encryptedData = base64ToArrayBuffer(encryptedBase64);

  const decrypted = await globalThis.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    sharedKey,
    encryptedData
  );

  return new TextDecoder().decode(decrypted);
}

async function exportECPublicKey(key) {
  const exported = await globalThis.crypto.subtle.exportKey("spki", key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

async function importECPublicKey(pem) {
  const binaryDer = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  return globalThis.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
}

async function main() {
  // Generate key pairs for two parties
  const { privateKey: privateKeyA, publicKey: publicKeyA } =
    await generateECKeyPair();
  const { privateKey: privateKeyB, publicKey: publicKeyB } =
    await generateECKeyPair();

  // Export public keys to string
  const publicKeyAString = await exportECPublicKey(publicKeyA);
  const publicKeyBString = await exportECPublicKey(publicKeyB);

  // Import public keys from string
  const importedPublicKeyA = await importECPublicKey(publicKeyAString);
  const importedPublicKeyB = await importECPublicKey(publicKeyBString);

  // Ensure both keys are the same
  const data = "Hello World!";

  const encryptedData = await ecEncryptData(
    privateKeyA,
    importedPublicKeyB,
    data
  );

  const decrypted = await ecDecryptData(
    privateKeyB,
    importedPublicKeyA,
    encryptedData
  );
  console.log("Decrypted Data:", decrypted);
}

main();
