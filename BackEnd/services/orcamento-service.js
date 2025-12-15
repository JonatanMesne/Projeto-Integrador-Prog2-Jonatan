const orcamentoRepository = require("../repositories/orcamento-repository");

// Função para retornar todos os orçamentos
const retornaTodosOrcamentos = async (req, res) => {
    try {
        const orcamentos = await orcamentoRepository.obterTodosOrcamentos();
        if(orcamentos.length === 0) 
            res.status(204).json("Nenhum orçamento encontrado");
        else
            res.status(200).json({ orcamentos: orcamentos });
    } catch (error) {
        console.log("Erro ao buscar orçamentos:", error);
        res.sendStatus(500);
    }
};

// Função para retornar os dados dos orçamentos necessários para o dashboard
const retornaDadosDashboardOrcamentos = async (req, res) => {
    try {
        const dados = await orcamentoRepository.obterDadosDashboardOrcamentos();
        res.status(200).json({ dados: dados });
    } catch (error) {
        console.log("Erro ao buscar dados dos orçamentos:", error);
        res.sendStatus(500);
    }
}

// Função para criar um novo orçamento
const criaOrcamento = async (req, res) => {
    const { data, status, desconto, pago, fk_veiculo_id, valor_total, } = req.body;
    try {
        if (!data || !status || !fk_veiculo_id) {
            return res
                .status(400)
                .json("Data, status e ID do veículo são obrigatórios.");
        }

        const orcamento = await orcamentoRepository.criarOrcamento({
            data,
            status,
            desconto,
            pago,
            valor_total,
            fk_veiculo_id,
        });
        res.status(201).json(orcamento);
    } catch (error) {
        console.log("Erro ao criar orçamento:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar um orçamento
const atualizaOrcamento = async (req, res) => {
    const { data, status, desconto, pago, valor_total, fk_veiculo_id } = req.body;
    const id = req.params.id;
    try {
        const orcamentoAtualizado = await orcamentoRepository.atualizarOrcamento({
            id,
            data,
            status,
            desconto,
            pago,
            valor_total,
            fk_veiculo_id,
        });

        if (orcamentoAtualizado) {
            res.status(200).json(orcamentoAtualizado);
        } else {
            res.status(204).json("Orçamento não encontrado" );
        }
    } catch (error) {
        console.log("Erro ao atualizar orçamento:", error);
        res.sendStatus(500);
    }
};

// Função para deletar um orçamento
const deletaOrcamento = async (req, res) => {
    try {
        const id = req.params.id;
        const orcamentoRemovido = await orcamentoRepository.deletarOrcamento({ id });

        if (orcamentoRemovido) {
            res.status(200).json({
                message: "Orçamento removido com sucesso.",
                orcamento: orcamentoRemovido,
            });
        } else {
            res.status(204).json("Orçamento não encontrado" );
        }
    } catch (error) {
        console.error("Erro ao deletar orçamento:", error);
        res.sendStatus(500);
    }
};

module.exports = {
    retornaTodosOrcamentos,
    retornaDadosDashboardOrcamentos,
    criaOrcamento,
    atualizaOrcamento,
    deletaOrcamento,
};
