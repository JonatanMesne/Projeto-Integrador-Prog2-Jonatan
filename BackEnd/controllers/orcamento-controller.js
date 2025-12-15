const express = require("express");
const orcamentoService = require("../services/orcamento-service");
const authService = require("../services/auth-service");

const orcamentoRouter = express.Router();

// POST /orcamento - Criar novo orcamento
orcamentoRouter.post("/", ...authService.requirePermissao("ACESSAR_ORCAMENTOS"), orcamentoService.criaOrcamento);

// GET /orcamento/todos - Retornar todos os orcamentos
orcamentoRouter.get("/todos", ...authService.requirePermissao("ACESSAR_ORCAMENTOS"), orcamentoService.retornaTodosOrcamentos);

// GET /orcamento/dashboard - Retornar dados da dashboard dos orçamentos
orcamentoRouter.get("/dashboard", ...authService.requirePermissao("ACESSAR_ORCAMENTOS"), orcamentoService.retornaDadosDashboardOrcamentos);

// PUT /orcamento/:id - Atualizar orcamento
orcamentoRouter.put("/:id", ...authService.requirePermissao("ACESSAR_ORCAMENTOS"), orcamentoService.atualizaOrcamento);

// DELETE /orcamento/:id - Deletar orcamento
orcamentoRouter.delete("/:id", ...authService.requirePermissao("ACESSAR_ORCAMENTOS"), orcamentoService.deletaOrcamento);

module.exports = orcamentoRouter;
