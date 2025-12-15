const model = require("../models");
const orcamento = require("../models/orcamento");
const { Op } = model.Sequelize;

// Função para obter todos os orçamentos
const obterTodosOrcamentos = async () => {
    return await model.Orcamento.findAll({
        include: [
            { 
                model: model.Veiculo,
                as: 'Veiculo',
                on: { [Op.and]: [
                    model.Sequelize.literal('"Veiculo"."id" = "Orcamento"."fk_veiculo_id"')
                ] },

                include: [
                    { 
                        model: model.Cliente,
                        on: { [Op.and]: [
                            model.Sequelize.literal('"Veiculo->Cliente"."cpf_cnpj" = "Veiculo"."fk_cliente_cpf_cnpj"')
                        ] }
                    }
                ],
            }
        ],
    });
};

// Função para obter dados dos orçamentos para dashboard
const obterDadosDashboardOrcamentos = async () => {
    const quantidadeOrcamentos = await model.Orcamento.count();
    const somaDesconto = await model.Orcamento.sum('desconto');
    const somaValorTotal = await model.Orcamento.sum('valor_total');
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    const somaValorTotal30Dias = await model.Orcamento.sum('valor_total', { where: { data: {
        [Op.gte] : trintaDiasAtras,
    } }});
    const quantidadeVeiculos = await model.Orcamento.count({ distinct: true, col: 'fk_veiculo_id' });
    const dados = ({quantidadeOrcamentos: quantidadeOrcamentos, somaDesconto: somaDesconto, quantidadeVeiculos: quantidadeVeiculos,
        somaValorTotal: somaValorTotal, somaValorTotal30Dias: somaValorTotal30Dias
    });
    return dados;
}

// Função para criar um novo orçamento
const criarOrcamento = async (orcamento) => {
    await model.Orcamento.create(orcamento);
    return orcamento;
};

// Função para atualizar um orçamento
const atualizarOrcamento = async (orcamento) => {
    try {
        // Atualizar o orçamento
        await model.Orcamento.update(orcamento, { where: { id: orcamento.id } });

        // Retornar o orçamento atualizado
        return await model.Orcamento.findByPk(orcamento.id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um orçamento
const deletarOrcamento = async (orcamento) => {
    try {
        // Deletar o orçamento
        return await model.Orcamento.destroy({ where: { id: orcamento.id } });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosOrcamentos,
    obterDadosDashboardOrcamentos,
    criarOrcamento,
    atualizarOrcamento,
    deletarOrcamento,
};
