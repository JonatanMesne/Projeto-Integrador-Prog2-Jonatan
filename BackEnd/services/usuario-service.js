const usuarioRepository = require("../repositories/usuario-repository");

// Função para retornar o tipo do usuário com base no login
const retornaTipoUsuarioPorLogin = async (req, res) => {
    try {
        const login = req.params.login;
        const tipo = await usuarioRepository.obterTipoUsuarioPorLogin({ login });
        console.log(tipo);
        if(!tipo) 
            res.status(204).json("Nenhum usuario encontrado");
        else
            res.status(200).json({ tipo: tipo });
    } catch (error) {
        console.log("Erro ao buscar usuario:", error);
        res.sendStatus(500);
    }
};

module.exports = {
	retornaTipoUsuarioPorLogin,
};
