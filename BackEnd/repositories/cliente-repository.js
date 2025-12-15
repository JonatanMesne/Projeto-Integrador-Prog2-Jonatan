const model = require("../models");

// Função para obter todos os clientes
const obterTodosClientes = async () => {
	return await model.Cliente.findAll();
};

// Função para obter dados dos clientes para dashboard
const obterDadosDashboardClientes = async () => {
	const quantidadeClientes = await model.Cliente.count();
	const quantidadeBomPagadores = await model.Cliente.count({ where: { bom_pagador: true } });
	const dados = ({quantidadeClientes: quantidadeClientes, quantidadeBomPagadores: quantidadeBomPagadores});
	return dados;
}

// Função para criar um novo cliente
const criarCliente = async (cliente) => {
	await model.Cliente.create(cliente);
	return cliente;
};

// Função para atualizar um cliente
const atualizarCliente = async (cliente) => {
	try {
		// Atualizar o cliente
		await model.Cliente.update(cliente, { where: { cpf_cnpj: cliente.cpf_cnpj } });

		// Retornar o cliente atualizado
		return await model.Cliente.findByPk(cliente.cpf_cnpj);
	} catch (error) {
		throw error;
	}
};

// Função para deletar um cliente
// Primeiro busca todos os veículos do cliente, depois deleta orçamentos relacionados e por fim deleta o cliente
const deletarCliente = async (cliente) => {
	try {
		// Busca todos os veículos associados ao cliente
		const vehicleIdsSubquery = await model.Veiculo.findAll({
			attributes: ['id'], 
			where: {
				fk_cliente_cpf_cnpj: cliente.cpf_cnpj,
			},
			raw: true, // Retorna objetos simples ao invés de instâncias Sequelize
		});

		// Extrai os IDs dos veículos em um array
		const vehicleIds = vehicleIdsSubquery.map(veiculo => veiculo.id);

		if (vehicleIds.length != 0) {
			// Se houver veículos, deleta todos os orçamentos relacionados a esses veículos
			const deleteResult = await model.Orcamento.destroy({
				where: {
					fk_veiculo_id: {
						[model.Sequelize.Op.in]: vehicleIds
					}
				}
			});
		}

		// Por fim, deleta o cliente
		return await model.Cliente.destroy({ where: { cpf_cnpj: cliente.cpf_cnpj } });
	} catch (error) {
		throw error;
	}
};

module.exports = {
	obterTodosClientes,
	obterDadosDashboardClientes,
	criarCliente,
	atualizarCliente,
	deletarCliente,
};
