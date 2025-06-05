import CryptoJS from 'crypto-js';

const SECRET_KEY = 'minha-chave-secreta'; // deve ser mantida em segredo, mas no frontend não é seguro

const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
localStorage.setItem('token', encrypted);

// Para descriptografar:
const decrypted = CryptoJS.AES.decrypt(localStorage.getItem('token'), SECRET_KEY).toString(CryptoJS.enc.Utf8);
