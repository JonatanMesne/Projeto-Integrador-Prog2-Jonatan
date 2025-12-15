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
const deletarCliente = async (cliente) => {
	try {
		const vehicleIdsSubquery = await model.Veiculo.findAll({
			attributes: ['id'], // Select only the primary key (id)
			where: {
				fk_cliente_cpf_cnpj: cliente.cpf_cnpj,
			},
			raw: true, // Return plain objects instead of Sequelize instances
		});

		// Extract the IDs into a flat array
		const vehicleIds = vehicleIdsSubquery.map(veiculo => veiculo.id);

		if (vehicleIds.length != 0) {
			// Step 2: Use the IDs to delete the corresponding Orcamento records
			const deleteResult = await model.Orcamento.destroy({
				where: {
					// WHERE fk_veiculo_id IN (...)
					fk_veiculo_id: {
						[model.Sequelize.Op.in]: vehicleIds
					}
				}
			});
		}

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
