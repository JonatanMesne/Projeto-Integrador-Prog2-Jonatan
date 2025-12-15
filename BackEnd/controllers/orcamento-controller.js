const express = require("express");
const orcamentoService = require("../services/orcamento-service");

const orcamentoRouter = express.Router();

// POST /orcamento - Criar novo orcamento
orcamentoRouter.post("/", orcamentoService.criaOrcamento);

// GET /orcamento/todos - Retornar todos os orcamentos
orcamentoRouter.get("/todos", orcamentoService.retornaTodosOrcamentos);

// GET /orcamento/dashboard - Retornar dados da dashboard dos orçamentos
orcamentoRouter.get("/dashboard", orcamentoService.retornaDadosDashboardOrcamentos);

// PUT /orcamento/:id - Atualizar orcamento
orcamentoRouter.put("/:id", orcamentoService.atualizaOrcamento);

// DELETE /orcamento/:id - Deletar orcamento
orcamentoRouter.delete("/:id", orcamentoService.deletaOrcamento);

module.exports = orcamentoRouter;
