import { useEffect, useState } from "react";
import axios from "axios";
import { Stack, Checkbox, FormControlLabel } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tabela from "./Tabela";
import InputCrud from "./InputCrud";
import BotoesCrud from "./BotoesCrud";
import StringMask from "string-mask";
import Botao from "./Botao";
import ClienteVeiculos from "./ClienteVeiculos";

export default function Cliente({ alertHandler, iterarRequestCount }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    
    const [clientes, setClientes] = useState([]);

    //sum of all columns widths should be 948 to fit in the DataGrid container
    const columns = [
        { field: "cpf_cnpj", headerName: "CPF/CNPJ", width: 150 },
        { field: "nome", headerName: "Nome do Cliente", width: 200 },
        { field: "email", headerName: "Email", width: 320 },
        { field: "telefone", headerName: "Telefone", width: 130 },
        { field: "bom_pagador", headerName: "Bom Pagador", type: "boolean", width: 148 },
    ];

    const maskCpf = new StringMask('000.000.000-00');
    const maskCnpj = new StringMask('00.000.000/0000-00');
    const maskTelefoneSmall = new StringMask('(00) 0000-0000');
    const maskTelefoneBig = new StringMask('(00) 00000-0000');

    function removeMask(text) {
        return text.replace(/\D/g, '');
    }

    const buscarClientes = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3002/cliente/todos", {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});
            iterarRequestCount();
            if (response.status === 204) {
                alertHandler(204, "CPF/CNPJ", "cliente", "buscar");
            }
            let placeHolderClientes = response.data.clientes;
            placeHolderClientes.forEach(cliente => {
                cliente.cpf_cnpj = cliente.cpf_cnpj.length === 11
                    ? maskCpf.apply(cliente.cpf_cnpj)
                    : maskCnpj.apply(cliente.cpf_cnpj);
                if(cliente.telefone != null) {
                    cliente.telefone = cliente.telefone.length === 10
                        ? maskTelefoneSmall.apply(cliente.telefone)
                        : maskTelefoneBig.apply(cliente.telefone);
                }
            });
            setClientes(placeHolderClientes);
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "CPF/CNPJ", "cliente", "buscar");
        }
    };

    useEffect(() => {
        buscarClientes();
    }, []);

    const [cpfCnpj, setCpfCnpj] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [bomPagador, setBomPagador] = useState(false);

    const incluiCliente = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3002/cliente/", { cpf_cnpj: removeMask(cpfCnpj), nome: nome, email: email, telefone: removeMask(telefone), bom_pagador: bomPagador }
            );
            iterarRequestCount();
            buscarClientes();
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "CPF/CNPJ", "cliente", "incluir");
        }
    }

    const alteraCliente = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3002/cliente/${removeMask(cpfCnpj)}`, { nome: nome, email: email, telefone: removeMask(telefone), bom_pagador: bomPagador }
            );
            iterarRequestCount();
            if(response.status === 204) {
                alertHandler(204, "CPF/CNPJ", "cliente", "alterar");
            }
            buscarClientes();
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "CPF/CNPJ", "cliente", "alterar");
        }
    }

    const excluirCliente = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:3002/cliente/${removeMask(cpfCnpj)}`
            );
            iterarRequestCount();
            if(response.status === 204) {
                alertHandler(204, "CPF/CNPJ", "cliente", "excluir");
            }
            buscarClientes();
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "CPF/CNPJ", "cliente", "excluir");
        }
    }

    const onRowSelect = (rowId) => {
        const selectedRow = clientes.find(cliente => cliente.cpf_cnpj === rowId);
        if (selectedRow) {
            setCpfCnpj(selectedRow.cpf_cnpj);
            setNome(selectedRow.nome);
            setEmail(selectedRow.email || '');
            setTelefone(selectedRow.telefone || '');
            setBomPagador(selectedRow.bom_pagador || false);
            setCpfCnpjVeiculo(selectedRow.cpf_cnpj);
        }
    }

    function clearFields() {
        setCpfCnpj('');
        setNome('');
        setEmail('');
        setTelefone('');
        setBomPagador(false);
    }

    const [exibeClienteVeiculos, setExibeClienteVeiculos] = useState(false);
    const [cpfCnpjVeiculo, setCpfCnpjVeiculo] = useState('');

    const toggleClienteVeiculos = () => {
        if(!exibeClienteVeiculos) {     //acima do set pois a constante demora um pouco para mudar de valor
            alertHandler(200, '', '', ''); //mensagem de sucesso ao abrir veículo
        }
        setExibeClienteVeiculos(!exibeClienteVeiculos);
    };

    return (
        <Stack spacing={2}>
            <Tabela entidade={"Cliente"} colunas={columns} linhas={clientes} idFunc={(linha) => {return linha.cpf_cnpj} } onRowSelect={onRowSelect}/>
            <Stack spacing={2} direction="row">
                <InputCrud nomeCampo={"CPF/CNPJ"} value={cpfCnpj} setValue={setCpfCnpj} cpfCnpj={true}/>
                <InputCrud nomeCampo={"Nome"} value={nome} setValue={setNome} maxLength={50}/>
                <InputCrud nomeCampo={"Email"} value={email} setValue={setEmail} maxLength={50}/>
                { !isSmallScreen && <>
                    <InputCrud nomeCampo={"Telefone"} value={telefone} setValue={setTelefone} telefone={true}/>
                    <FormControlLabel control={<Checkbox checked={bomPagador} onChange={(e) => setBomPagador(e.target.checked)} />} label="Bom Pagador" />
                </> }
            </Stack>
            { isSmallScreen && <Stack spacing={2} direction="row">
                <InputCrud nomeCampo={"Telefone"} value={telefone} setValue={setTelefone} telefone={true}/>
                <FormControlLabel control={<Checkbox checked={bomPagador} onChange={(e) => setBomPagador(e.target.checked)} />} label="Bom Pagador" />
            </Stack> }
            <Stack spacing={2} direction="row">
                <BotoesCrud incluir={incluiCliente} alterar={alteraCliente} excluir={excluirCliente}/>
                { !isSmallScreen && <>
                    <Botao funcao={clearFields} texto={"Limpar Campos"}/>
                    <Botao funcao={toggleClienteVeiculos} texto={"Ver veículos do cliente"} disabled={cpfCnpjVeiculo == ''}/>
                </> }
            </Stack>
            { isSmallScreen && <Stack spacing={2} direction="row">
                <Botao funcao={clearFields} texto={"Limpar Campos"}/>
                <Botao funcao={toggleClienteVeiculos} texto={"Ver veículos do cliente"} disabled={cpfCnpjVeiculo == ''}/>
            </Stack> }
            { exibeClienteVeiculos && <ClienteVeiculos alertHandler={alertHandler} cpfCnpj={cpfCnpjVeiculo} iterarRequestCount={iterarRequestCount}/> }
        </Stack>
    );
}
