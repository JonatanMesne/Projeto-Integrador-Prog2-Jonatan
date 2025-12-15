const clienteRepository = require("../repositories/cliente-repository");

// Função para retornar todos os clientes
const retornaTodosClientes = async (req, res) => {
	try {
		const clientes = await clienteRepository.obterTodosClientes();
		if(clientes.length === 0) 
			res.status(204).json("Nenhum cliente encontrado");
		else
			res.status(200).json({ clientes: clientes });
	} catch (error) {
		console.log("Erro ao buscar clientes:", error);
		res.sendStatus(500);
	}
};

// Função para retornar os dados dos clientes necessários para o dashboard
const retornaDadosDashboardClientes = async (req, res) => {
	try {
		const dados = await clienteRepository.obterDadosDashboardClientes();
		res.status(200).json({ dados: dados });
	} catch (error) {
		console.log("Erro ao buscar dados dos clientes:", error);
		res.sendStatus(500);
	}
}

// Função para criar um novo cliente
const criaCliente = async (req, res) => {
	const { cpf_cnpj, nome, email, telefone, bom_pagador } = req.body;
	try {
		if (!cpf_cnpj || !nome) {
			return res
				.status(400)
				.json("CPF/CNPJ e nome são obrigatórios." );
		}

		const cliente = await clienteRepository.criarCliente({
			cpf_cnpj,
			nome,
			email,
			telefone, 
			bom_pagador,
		});
		res.status(201).json(cliente);
	} catch (error) {
		console.log("Erro ao criar cliente:", error);
		res.sendStatus(500);
	}
};

// Função para atualizar um cliente
const atualizaCliente = async (req, res) => {
	const { nome, email, telefone, bom_pagador, placa_no_orcamento, orcamento_no_email } = req.body;
	const cpf_cnpj = req.params.cpf_cnpj;
	try {
		const clienteAtualizado = await clienteRepository.atualizarCliente({
			cpf_cnpj,
			nome,
			email,
			telefone, 
			bom_pagador,
		});

		if (clienteAtualizado) {
			res.status(200).json(clienteAtualizado);
		} else {
			res.status(204).json("Cliente não encontrado");
		}
	} catch (error) {
		console.log("Erro ao atualizar cliente:", error);
		res.sendStatus(500);
	}
};

// Função para deletar um cliente
const deletaCliente = async (req, res) => {
	try {
		const cpf_cnpj = req.params.cpf_cnpj;
		const clienteRemovido = await clienteRepository.deletarCliente({ cpf_cnpj });

		if (clienteRemovido) {
			res.status(200).json({
				message: "Cliente removido com sucesso.",
				cliente: clienteRemovido,
			});
		} else {
			res.status(204).json("Cliente não encontrado" );
		}
	} catch (error) {
		console.error("Erro ao deletar cliente:", error);
		res.sendStatus(500);
	}
};

module.exports = {
	retornaTodosClientes,
	retornaDadosDashboardClientes,
	criaCliente,
	atualizaCliente,
	deletaCliente,
};
