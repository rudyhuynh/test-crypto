import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import crypto from 'crypto'
import { base64ToBuffer, decryptData, exportKey, generateRSAKeyPair, importKey } from './crypto';

const app = express();
const port = 3000;

app.use(cors())
app.use(bodyParser.json());




let serverPrivateKey: string;

app.get('/api/key',async (req: Request, res: Response) => {
  const { publicKey, privateKey } = await generateRSAKeyPair();
  serverPrivateKey = await exportKey(privateKey);
  res.send({ publicKey: await exportKey(publicKey) });
});

app.post('/api/data',async (req: Request, res: Response) => {
  const encryptedData = req.body.data;
  console.log('encrypted data', encryptedData)
  
  const importedPrivateKey = await importKey(serverPrivateKey, "decrypt");

  const encryptedBuffer = base64ToBuffer(encryptedData);
  
  const decrypted = await decryptData(importedPrivateKey, encryptedBuffer);
  console.log("Decrypted Data:", decrypted);
  
  res.send({ message: 'Data received successfully', data: decrypted });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
