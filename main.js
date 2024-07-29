const path = require('path')
const fs = require('fs')
const {exec} = require('child_process')


const file_path = path.join(__dirname, 'pass.json');

const readPasswords = () => {
    if(!fs.existsSync(file_path)) return {}

    const data = fs.readFileSync(file_path, 'utf8')
    return JSON.parse(data)
}

const writePassword = (passwords) => {
    const data = JSON.stringify(passwords);
    fs.writeFileSync(file_path, data, 'utf8');
}

const generatePassword = (length = 16) => {
    const char = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ñÑ!@#$%^&*()_+-=[]{}|;:',.<>?/~`;

    let password = ''

    for(i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * char.length) - 1
        password += char[randomIndex]
    }

    return password
}

const createPass = (passwords, key, length) => {
    if(passwords[key]){
        console.log(`La contraseña de ${key} ya existe`);
        return;
    }

    const password = generatePassword(length && length);
    passwords[key] = password
    writePassword(passwords);
    console.log(`Se ha creado la contraseña para ${key}`)
}

const getPass = (passwords, key) => {
    if(!passwords[key]){
        console.log(`No existe la contraseña de ${key}`);
        return
    }

    console.log(`Aqui tienes la contraseña de ${key}:  ${passwords[key]}`)
    // console.log(passwords[key])
    // exec(`powershell.exe Set-Clipboard -Value "${passwords[key]}"`, (err, stdout, stderr) => {
    //     if(err){
    //         console.log('Error copiando contraseña en el portapapeles', err);
    //         return
    //     }

    //     console.log('Contraseña copiada')
    // })
}

const updatePass = (passwords, key) => {
    if(!passwords[key]){
        console.log(`La contraseña ${key} no existe`);
        return
    }
    passwords[key] = generatePassword(length);
    writePassword(passwords);
    console.log('Contraseña actualizada')
}

const deletePassword = (passwords, key) => {
    if(!passwords[key]){
        console.log('La contraseña no existe');
        return
    }

    delete passwords[key]
    writePassword(passwords)

    console.log('Contraseña borrada')
}

const listPass = (passwords) => {
    for (const key in passwords) {
        console.log(key)
    }
}

function main() {
    //Comando para generar contraseñas: cp
    //Comando para obtener la contraseña: gp
    const [command, key, length] = process.argv.slice(2)

    let passwords = readPasswords();

    switch(command) {
        case 'cp': createPass(passwords, key, length); break;

        case 'gp': getPass(passwords, key); break;

        case 'up': updatePass(passwords, key, length); break

        case 'dp': deletePassword(passwords, key) ; break

        case 'lp': listPass(passwords) ; break

        default: console.log("El comando no existe")
    }
}

main()
