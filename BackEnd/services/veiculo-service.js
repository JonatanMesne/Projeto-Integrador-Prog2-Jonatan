const veiculoRepository = require("../repositories/veiculo-repository");

// Função para retornar os dados dos veículos necessários para o dashboard
const retornaDadosDashboardVeiculos = async (req, res) => {
    try {
        const dados = await veiculoRepository.obterDadosDashboardVeiculos();
        res.status(200).json({ dados: dados });
    } catch (error) {
        console.log("Erro ao buscar dados dos clientes:", error);
        res.sendStatus(500);
    }
}

// Função para buscar veiculo pelo CPF/CNPJ do cliente
const retornaVeiculosPorCpfCnpj = async (req, res) => {
    try {
        const fk_cliente_cpf_cnpj = req.params.cpf_cnpj;
        const veiculo = await veiculoRepository.obterVeiculosPorCpfCnpj({
            fk_cliente_cpf_cnpj,
        });

        if(veiculo.length === 0) 
			res.status(204).json("Nenhum veículo encontrado");
		else
			res.status(200).json({ veiculos: veiculo });
    } catch (error) {
        console.log("Erro ao buscar veículo:", error);
        res.sendStatus(500);
    }
};

// Função para criar um novo veiculo
const criaVeiculo = async (req, res) => {
    const { marca, modelo, placa, numero_chassis, fk_cliente_cpf_cnpj } = req.body;
    try {
        if (!marca || !modelo || !fk_cliente_cpf_cnpj) {
            return res
                .status(400)
                .json("Marca, modelo e CPF/CNPJ do cliente são obrigatórios.");
        }

        const veiculo = await veiculoRepository.criarVeiculo({
            marca,
            modelo,
            placa,
            numero_chassis,
            fk_cliente_cpf_cnpj,
        });
        res.status(201).json(veiculo);
    } catch (error) {
        console.log("Erro ao criar veiculo:", error);
        if(error.parent.code == "23505") {
            res.status(400).json({ message: "Número de chassi ou placa já cadastrado para outro veículo.", sqlError: error.parent.code });
            return;
        } else if (error.parent && error.parent.code == "23503") {
            res.status(400).json({ message: "CPF/CNPJ do cliente não existe.", sqlError: error.parent.code });
            return;
        }
        res.status(500).json(error);
    }
};

// Função para atualizar um veiculo
const atualizaVeiculo = async (req, res) => {
    const { marca, modelo, placa, numero_chassis, fk_cliente_cpf_cnpj } = req.body;
    const id = req.params.id;
    try {
        const veiculoAtualizado = await veiculoRepository.atualizarVeiculo({
            id,
            marca,
            modelo,
            placa,
            numero_chassis,
            fk_cliente_cpf_cnpj,
        });

        if (veiculoAtualizado) {
            res.status(200).json(veiculoAtualizado);
        } else {
            res.status(204).json("Veiculo não encontrado" );
        }
    } catch (error) {
        console.log("Erro ao atualizar veiculo:", error);
        if(error.parent.code == "23505") {
            res.status(400).json("Número de chassi ou placa já cadastrado para outro veículo.");
            return;
        }
        res.status(500).json(error);
    }
};

// Função para deletar um veiculo
const deletaVeiculo = async (req, res) => {
    try {
        const id = req.params.id;
        const veiculoRemovido = await veiculoRepository.deletarVeiculo({ id });
        console.log("Deletar veiculo2");
        if (veiculoRemovido) {
            res.status(200).json({
                message: "Veiculo removido com sucesso.",
                veiculo: veiculoRemovido,
            });
        } else {
            res.status(204).json("Veiculo não encontrado" );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {
    retornaVeiculosPorCpfCnpj,
    retornaDadosDashboardVeiculos,
    criaVeiculo,
    atualizaVeiculo,
    deletaVeiculo,
};
