const express = require("express");
const usuarioService = require("../services/usuario-service");

const usuarioRouter = express.Router();

// GET /usuario/tipo/:login - Retornar o tipo do usuário pelo login
usuarioRouter.get("/tipo/:login", usuarioService.retornaTipoUsuarioPorLogin);

module.exports = usuarioRouter;