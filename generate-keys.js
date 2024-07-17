import webpush from 'web-push';

const { publicKey, privateKey } = webpush.generateVAPIDKeys();

console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);
