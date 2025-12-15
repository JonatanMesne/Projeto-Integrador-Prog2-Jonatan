const express = require("express");
const usuarioService = require("../services/usuario-service");
const authService = require("../services/auth-service");

const usuarioRouter = express.Router();

// GET /usuario/tipo/:login - Retornar o tipo do usuário pelo login
usuarioRouter.get("/tipo/:login", ...authService.requirePermissao("ACESSAR_USUARIOS"), usuarioService.retornaTipoUsuarioPorLogin);

module.exports = usuarioRouter;