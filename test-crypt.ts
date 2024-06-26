import crypto from 'crypto'

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6vUp
wmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/3j+skZ6UtW+5u09lHNsj6tQ5
1s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQABAoGAFijko56+qGyN8M0RVyaRAXz++xTqHBLh
3tx4VgMtrQ+WEgCjhoTwo23KMBAuJGSYnRmoBZM3lMfTKevIkAidPExvYCdm5dYq3XToLkkLv5L2
pIIVOFMDG+KESnAFV7l2c+cnzRMW0+b6f8mR1CJzZuxVLL6Q02fvLi55/mbSYxECQQDeAw6fiIQX
GukBI4eMZZt4nscy2o12KyYner3VpoeE+Np2q+Z3pvAMd/aNzQ/W9WaI+NRfcxUJrmfPwIGm63il
AkEAxCL5HQb2bQr4ByorcMWm/hEP2MZzROV73yF41hPsRC9m66KrheO9HPTJuo3/9s5p+sqGxOlF
L0NDt4SkosjgGwJAFklyR1uZ/wPJjj611cdBcztlPdqoxssQGnh85BzCj/u3WqBpE2vjvyyvyI5k
X6zk7S0ljKtt2jny2+00VsBerQJBAJGC1Mg5Oydo5NwD6BiROrPxGo2bpTbu/fhrT8ebHkTz2epl
U9VQQSQzY1oZMVX8i1m5WUTLPz2yLJIBQVdXqhMCQBGoiuSoSjafUhV7i1cEGpb88h5NBYZzWXGZ
37sJ5QsW+sJyoNde3xH8vdXhzU7eT82D6X/scw9RZz+/6rCJ4p0=
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0
FPqri0cb2JZfXJ/DgYSF6vUpwmJG8wVQZKjeGcjDOL5UlsuusFncCzWBQ7RKNUSesmQRMSGkVb1/
3j+skZ6UtW+5u09lHNsj6tQ51s1SPrCBkedbNf0Tp0GbMJDyR4e9T04ZZwIDAQAB
-----END PUBLIC KEY-----`;

// const generateKeyPair = (): { publicKey: string, privateKey: string } => {
//     const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//       modulusLength: 2048,
//       publicKeyEncoding: {
//         type: 'spki',
//         format: 'pem',
//       },
//       privateKeyEncoding: {
//         type: 'pkcs8',
//         format: 'pem',
//       },
//     });
//     return { publicKey, privateKey };
//   };
// const {publicKey, privateKey} = generateKeyPair()  
console.log('publicKey', publicKey)

const data = 'Hello world!'
const plaintext = Buffer.from(data, 'utf8');

// This is what you usually do to transmit encrypted data.
const enc1 = crypto.publicEncrypt(publicKey, plaintext);

//Convert enc1 to string (Base64 encoding)
// const enc1String = enc1.toString('base64');
// console.log('enc1String', enc1String)

const enc1String = 'EucHPp8hcpalN7uuPpGKV3a/9eY1b7JPVT0in0Czm1R6wK/9OP6zyjwE9ZkzavQYeW2jC8woRyvj1I78fQGY5f+7E9HJ+h+M8ot6p+BByqkPjuLINM3cTus1IS2PnGLUITX+ulyqDrlposuA19lrUQJGlFoyr9Jt1mBBCGNjaDU='

// Convert enc1String back to buffer
const enc1Buffer = Buffer.from(enc1String, 'base64');

const dec1 = crypto.privateDecrypt(privateKey, enc1Buffer);
console.log(dec1.toString('utf8'));

// This works as well.
const enc2 = crypto.privateEncrypt(privateKey, plaintext);
const dec2 = crypto.publicDecrypt(publicKey, enc2);
console.log(dec2.toString('utf8'));
