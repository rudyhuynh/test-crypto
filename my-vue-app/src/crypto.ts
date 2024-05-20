export async function generateRSAKeyPair() {
    return globalThis.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
  }
  
  export async function exportKey(key: any) {
    const exported = await globalThis.crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
  }
  
  export async function importKey(jwk: string, keyType: "encrypt"|"decrypt") {
    const keyData = JSON.parse(jwk);
    return globalThis.crypto.subtle.importKey(
      "jwk",
      keyData,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      [keyType]
    );
  }
  
  export async function encryptData(publicKey: any, data: string) {
    const encodedData = new TextEncoder().encode(data);
    
    const encrypted = await globalThis.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encodedData
    );
  
    return encrypted;
  }
  
  export async function decryptData(privateKey: any, encryptedData: ArrayBuffer) {
    const decrypted = await globalThis.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedData
    );
  
    return new TextDecoder().decode(decrypted);
  }
  
  export function bufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return globalThis.btoa(binary);
  }
  
  export function base64ToBuffer(base64: string) {
    const binary = globalThis.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  async function test() {
    const { publicKey, privateKey } = await generateRSAKeyPair();
  
    // Export keys to strings
    const publicKeyString = await exportKey(publicKey);
    const privateKeyString = await exportKey(privateKey);
  
    // Import keys back from strings
    const importedPublicKey = await importKey(publicKeyString, "encrypt");
    const importedPrivateKey = await importKey(privateKeyString, "decrypt");
  
    const data = "Hello, World!";
    
    const encrypted = await encryptData(importedPublicKey, data);
  
    // Convert encrypted data to string (Base64)
    const encryptedString = bufferToBase64(encrypted);
    console.log("Encrypted Data:", encryptedString);
  
    // Convert encrypted string back to ArrayBuffer
    const encryptedBuffer = base64ToBuffer(encryptedString);
  
    const decrypted = await decryptData(importedPrivateKey, encryptedBuffer);
    console.log("Decrypted Data:", decrypted);
  }

  // test();
  