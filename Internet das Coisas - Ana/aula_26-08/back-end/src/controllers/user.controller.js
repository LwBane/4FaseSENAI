import db from "../config/database.js"

export const createUser = async (req, res) => {
    const { nome, email, cpf, senha } = req.body;

    // ==================
    // VALIDAÇÃO 
    // ==================

    if (!nome || typeof nome !== "string" || nome.trim().length <= 3) {
        return res.status(400).json({ message: "Nome inválido. Este campo é obrigatório", })
    }

    if (!email || typeof email !== "string" || !email.includes('@') || email.trim().length > 150) {
        return res.status(400).json({ message: "E-mail inválido. Este campo é obrigatório", })
    }

    if (!cpf || typeof cpf !== "string") {
        return res.status(400).json({ message: "CPF inválido. Este campo é obrigatório", })
    }

    if(!senha){
        return res.status(400).json({ message: "Senha inválida. Este campo é obrigatório", sucess: false })
    } else {
        // Precisa ter entre 8 e 32 caracteres 
        if(senha.length < 8 || senha.length > 32){
            return res.status(400).json({
                message: "Senha inválida.",
                sucess: false 
            })
        }
    }



    // ==================
    // SANITIZAÇÃO  
    // ==================

    if(!validarCPF(cpf)){
        return res.status(400).json({
            message: "CPF Inválido",
            sucess: false
        })
    }

    // remove hífen e ponto 
    const cpfLimpo = cpf.replace(/[^\d]+/g, '');

    // limpa o nome de qualquer caracterer indesejado 
    const nomeSanitizado = nome.trim().replace(/\s+/g,"");

    // insercao no banco 

    try {
        const sql = `INSERT INTO usuario (nome, email, senha, cpf) VALUES (?,?,?,?)`;

        const valores = [
            nomeSanitizado, email, senha, cpfLimpo
        ];

        const [result] = await db.execute(sql, valores); 

        if(result.affectedRows === 0){
            return res.status(400).json({
            message: "Não foi possível inserir os dados do usuário.",
            sucess: false
            })
        }

        return res.status(201).json({message: "Usuário criado com sucesso!", sucess: true})
    } catch {
        res.status(500).json({message: "Erro interno"})
    }

}



function validarCPF(cpf) {

    // remove hífen, ponto e qualquer caracter que NÃO seja número 
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

