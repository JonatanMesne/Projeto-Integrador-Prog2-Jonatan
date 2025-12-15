const model = require("../models");

// Função para obter o tipo do usuário pelo login
const obterTipoUsuarioPorLogin = async (usuario) => {
    return await model.Usuario.findByPk(usuario.login, {
        attributes: ['tipo']
    });
};

module.exports = {
	obterTipoUsuarioPorLogin,
};
