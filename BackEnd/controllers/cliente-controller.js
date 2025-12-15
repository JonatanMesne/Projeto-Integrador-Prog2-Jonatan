const express = require("express");
const clienteService = require("../services/cliente-service");
const authService = require("../services/auth-service");

const clienteRouter = express.Router();

// POST /cliente - Criar novo cliente
clienteRouter.post("/", clienteService.criaCliente);

// GET /cliente/todos - Retornar todos os clientes
clienteRouter.get("/todos", ...authService.requirePermissao("ACESSAR_CLIENTES"), clienteService.retornaTodosClientes);

// GET /cliente/dashboard - Retornar dados da dashboard dos clientes
clienteRouter.get("/dashboard", clienteService.retornaDadosDashboardClientes);

// PUT /cliente/:cpf_cnpj - Atualizar cliente
clienteRouter.put("/:cpf_cnpj", clienteService.atualizaCliente);

// DELETE /cliente/:cpf_cnpj - Deletar cliente
clienteRouter.delete("/:cpf_cnpj", clienteService.deletaCliente);

module.exports = clienteRouter;
