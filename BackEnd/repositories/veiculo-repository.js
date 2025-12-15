const model = require("../models");

// Função para obter dados dos veículos para dashboard
const obterDadosDashboardVeiculos = async () => {
    const quantidadeVeiculos = await model.Veiculo.count();
    const dados = ({quantidadeVeiculos: quantidadeVeiculos});
    return dados;
}


// Função para obter veiculo por CPF/CNPJ do cliente
const obterVeiculosPorCpfCnpj = async (veiculo) => {
    return await model.Veiculo.findAll({ where: { fk_cliente_cpf_cnpj: veiculo.fk_cliente_cpf_cnpj } });
};

// Função para criar um novo veiculo
const criarVeiculo = async (veiculo) => {
    await model.Veiculo.create(veiculo);
    return veiculo;
};

// Função para atualizar um veiculo
const atualizarVeiculo = async (veiculo) => {
    try {
        // Atualizar o veiculo
        await model.Veiculo.update(veiculo, { where: { id: veiculo.id } });

        // Retornar o veiculo atualizado
        return await model.Veiculo.findByPk(veiculo.id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um veiculo
const deletarVeiculo = async (veiculo) => {
    try {
        // Deletar o veiculo
        return await model.Veiculo.destroy({ where: { id: veiculo.id } });
    } catch (error) {
        console.log("Erro");
        throw error;
    }
};

module.exports = {
    obterVeiculosPorCpfCnpj,
    obterDadosDashboardVeiculos,
    criarVeiculo,
    atualizarVeiculo,
    deletarVeiculo,
};