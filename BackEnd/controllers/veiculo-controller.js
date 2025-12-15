const express = require("express");
const veiculoService = require("../services/veiculo-service");

const veiculoRouter = express.Router();

// POST /veiculo - Criar novo veiculo
veiculoRouter.post("/", veiculoService.criaVeiculo);

// GET /cliente/dashboard - Retornar dados da dashboard dos veículos
veiculoRouter.get("/dashboard", veiculoService.retornaDadosDashboardVeiculos);

// GET /veiculo/:cpf_cnpj - Retornar veiculo pelo CPF/CNPJ do cliente
veiculoRouter.get("/:cpf_cnpj", veiculoService.retornaVeiculosPorCpfCnpj);

// PUT /veiculo/:id - Atualizar veiculo
veiculoRouter.put("/:id", veiculoService.atualizaVeiculo);

// DELETE /veiculo/:id - Deletar veiculo
veiculoRouter.delete("/:id", veiculoService.deletaVeiculo);

module.exports = veiculoRouter;
