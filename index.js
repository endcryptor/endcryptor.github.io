var encryptionKey;

function createConfiguration1() {
    const password = document.getElementById('password-1').value;
    if (password.length < 10) {
        alert('Password must be longer than 9');
        return;
    }
    const randomIndex = Math.floor(Math.random() * DHParameters.length);
    const g = parseInt(DHParameters[randomIndex][0]);
    const p = bigInt(DHParameters[randomIndex][1]);
    const privateKey = passwordToPrivateKey(password, p);
    const publicKey = bigInt(g).modPow(privateKey, p);
    const salt = CryptoJS.lib.WordArray.random(32);
    const iterations = parseInt(document.getElementById('iterations').value);
    const config = JSON.stringify({
        g: g,
        p: p.toString(),
        publicKey: publicKey.toString(),
        salt: CryptoJS.enc.Base64.stringify(salt),
        iterations: iterations
    });
    navigator.clipboard.writeText(config).then(() => {
        document.getElementById('my-config-1').textContent = config;
        document.getElementById('my-config-p-1').classList.remove('d-none');
    });
}

function createConfiguration2() {
    const password = document.getElementById('password-2').value;
    if (password.length < 10) {
        alert('Password must be longer than 9');
        return;
    }
    const conf = JSON.parse(document.getElementById('i-config-2').value);
    const g = parseInt(conf.g);
    const p = bigInt(conf.p);
    const privateKey = passwordToPrivateKey(password, p);
    const publicKey = bigInt(g).modPow(privateKey, p);
    const config = JSON.stringify({
        g: g,
        p: p.toString(),
        publicKey: publicKey.toString(),
        salt: conf.salt,
        iterations: conf.iterations
    });
    navigator.clipboard.writeText(config).then(() => {
        document.getElementById('my-config-2').textContent = config;
        document.getElementById('my-config-p-2').classList.remove('d-none');
    });
}

function generateEncryptionKey() {
    const password = document.getElementById('password-3').value;
    if (password.length < 10) {
        alert('Password must be longer than 9');
        return;
    }
    const conf = JSON.parse(document.getElementById('i-config-3').value);
    const p = bigInt(conf.p);
    const publicKeyB = bigInt(conf.publicKey);
    const salt = CryptoJS.enc.Base64.parse(conf.salt);
    const iterations = parseInt(conf.iterations);
    const privateKey = passwordToPrivateKey(password, p);
    const sharedKey = bigInt(publicKeyB).modPow(privateKey, p).toString();
    encryptionKey = CryptoJS.PBKDF2(sharedKey, salt, {
        keySize: 256 / 32,
        iterations: iterations
    });
    document.getElementById('message-p').classList.remove('d-none');
    document.getElementById('encrypt-decrypt-p').classList.remove('d-none');
}

function encryptMessage() {
    const message = document.getElementById('message').value.trim();
    if (message.length === 0) {
        return;
    }
    const iv = CryptoJS.lib.WordArray.random(16);
    const ciphertext = CryptoJS.AES.encrypt(message, encryptionKey, {iv: iv});
    const ciphertextConfig = JSON.stringify({
        iv: CryptoJS.enc.Base64.stringify(iv),
        ciphertext: ciphertext.toString()
    });
    navigator.clipboard.writeText(ciphertextConfig).then(() => {
        document.getElementById('encrypt').textContent = 'Copied';
        document.getElementById('message').value = '';
        setTimeout(() => {
            document.getElementById('encrypt').textContent = 'Encrypt and copy';
        }, '1500');
    });
}

function decryptMessage() {
    const message = document.getElementById('message').value.trim();
    if (message.length == 0) {
        return;
    }
    const ciphertextConfig = JSON.parse(message);
    const iv = CryptoJS.enc.Base64.parse(ciphertextConfig.iv);
    const ciphertext = ciphertextConfig.ciphertext;
    const plaintext = CryptoJS.AES.decrypt(ciphertext, encryptionKey, {iv: iv});
    const plaintextElement = document.createElement('p');
    plaintextElement.textContent = plaintext.toString(CryptoJS.enc.Utf8);
    document.getElementById('tab-3').appendChild(plaintextElement);
    document.getElementById('message').value = '';
}

function passwordToPrivateKey(password, p) {
    let privateKey = '';
    for (let i = 0; i < password.length; i++) {
        if (privateKey.length === p.toString().length) {
            break;
        }
        privateKey += password.charCodeAt(i).toString();
    }
    return bigInt(privateKey);
}

function selectTab(tabNumber) {
    for (let i = 1; i < 4; i++) {
        document.getElementById(`tab-btn-${i}`).classList.remove('selected');
        document.getElementById(`tab-${i}`).classList.add('d-none');
    }
    document.getElementById(`tab-btn-${tabNumber}`).classList.add('selected');
    document.getElementById(`tab-${tabNumber}`).classList.remove('d-none');
}

function setIterations() {
    const iterations = document.getElementById('iterations').value;
    document.getElementById('iterations-output').textContent = iterations;
}

setIterations();
selectTab(1);
