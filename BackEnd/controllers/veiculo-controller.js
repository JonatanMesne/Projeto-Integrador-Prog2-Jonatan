const express = require("express");
const veiculoService = require("../services/veiculo-service");
const authService = require("../services/auth-service");

const veiculoRouter = express.Router();

// POST /veiculo - Criar novo veiculo
veiculoRouter.post("/", ...authService.requirePermissao("ACESSAR_VEICULOS"), veiculoService.criaVeiculo);

// GET /cliente/dashboard - Retornar dados da dashboard dos veículos
veiculoRouter.get("/dashboard", ...authService.requirePermissao("ACESSAR_VEICULOS"), veiculoService.retornaDadosDashboardVeiculos);

// GET /veiculo/:cpf_cnpj - Retornar veiculo pelo CPF/CNPJ do cliente
veiculoRouter.get("/:cpf_cnpj", ...authService.requirePermissao("ACESSAR_VEICULOS"), veiculoService.retornaVeiculosPorCpfCnpj);

// PUT /veiculo/:id - Atualizar veiculo
veiculoRouter.put("/:id", ...authService.requirePermissao("ACESSAR_VEICULOS"), veiculoService.atualizaVeiculo);

// DELETE /veiculo/:id - Deletar veiculo
veiculoRouter.delete("/:id", ...authService.requirePermissao("ACESSAR_VEICULOS"), veiculoService.deletaVeiculo);

module.exports = veiculoRouter;
