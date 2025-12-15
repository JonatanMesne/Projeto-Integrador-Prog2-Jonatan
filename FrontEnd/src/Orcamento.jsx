// Importação de hooks e bibliotecas externas
import { useEffect, useState } from "react";
import axios from "axios";
import { Stack, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Tabela from "./Tabela";
import InputCrud from "./InputCrud";
import BotoesCrud from "./BotoesCrud";
import StringMask from "string-mask";
import Botao from "./Botao";

// Função principal do componente Orcamento
export default function Orcamento({ alertHandler, iterarRequestCount }) {
    // Hook para acessar o tema do Material UI
    const theme = useTheme();
    // Verifica se a tela é pequena
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    
    // Estado para armazenar a lista de orçamentos
    const [orcamentos, setOrcamento] = useState([]);

    // Definição das colunas da tabela de orçamentos
    const columns = [
        { field: "nome", headerName: "Nome do Cliente", width: 250 },
        { field: "data", headerName: "Data", width: 150 },
        { field: "status", headerName: "Status", width: 150 },
        { field: "pago", headerName: "Pago", type: "boolean", width: 98 },
        { field: "desconto", headerName: "Desconto", width: 130},
        { field: "valor_total", headerName: "Valor total", width: 170},
    ];

    // Máscaras para formatação de CPF, CNPJ e valores monetários
    const maskCpf = new StringMask('000.000.000-00');
    const maskCnpj = new StringMask('00.000.000/0000-00');
    const maskDinheiro = new StringMask('R$ #.##0,00', {reverse: true});
    const maskFloat = new StringMask('#0.00', {reverse: true});
    
    // Função para remover máscaras de strings
    function removeMask(text) {
        return text.replace(/\D/g, '');
    }

    // Função para remover máscara de dinheiro e aplicar a máscara de float para enviar dados ao servidor
    function removeMaskDinheiro(text) {
        return maskFloat.apply(removeMask(text));
    }

    // Função para reverter data do formato DD/MM/YYYY para YYYY-MM-DD
    function reverterData(data) {
        const parts = data.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // Função para converter objeto dayjs para string no formato YYYY-MM-DD
    function dayjsDateToString(data) {
        return `${data.$y}-${data.$M + 1}-${data.$D}`
    }

    // Função para buscar orçamentos no servidor
    const buscarOrcamentos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3002/orcamento/todos", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            iterarRequestCount();
            if (response.status === 204) {
                alertHandler(204, "id", "orcamento", "buscar");
            }
            let placeHolderOrcamentos = response.data.orcamentos;
            // Aplica máscaras e formatações nos dados recebidos
            placeHolderOrcamentos.forEach(orcamento => {
                orcamento.Veiculo.Cliente.cpf_cnpj = orcamento.Veiculo.Cliente.cpf_cnpj.length === 11
                    ? maskCpf.apply(orcamento.Veiculo.Cliente.cpf_cnpj)
                    : maskCnpj.apply(orcamento.Veiculo.Cliente.cpf_cnpj);
                
                const parts = orcamento.data.split('-');
                orcamento.data = `${parts[2]}/${parts[1]}/${parts[0]}`;

                orcamento.nome = orcamento.Veiculo.Cliente.nome; //Necessário para a tabela
                orcamento.desconto = maskDinheiro.apply(removeMask(orcamento.desconto));
                orcamento.valor_total = maskDinheiro.apply(removeMask(orcamento.valor_total));
            });
            setOrcamento(placeHolderOrcamentos);
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "id", "orcamento", "buscar");
        }
    };

    // Executa buscarOrcamentos ao montar o componente
    useEffect(() => {
        buscarOrcamentos();
    }, []);

    // Função para incluir um novo orçamento
    const incluiOrcamento = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3002/orcamento/", { id: id, data: dayjsDateToString(data), status: status, 
                    desconto: removeMaskDinheiro(desconto), pago: pago, valor_total: removeMaskDinheiro(valorTotal),  fk_veiculo_id: veiculoId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            iterarRequestCount();
            buscarOrcamentos();
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "id", "orcamento", "incluir");
        }
    }

    // Função para alterar um orçamento existente
    const alteraOrcamento = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:3002/orcamento/${id}`, { data: dayjsDateToString(data), status: status, 
                    desconto: removeMaskDinheiro(desconto), pago: pago, valor_total: removeMaskDinheiro(valorTotal), fk_veiculo_id: veiculoId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            iterarRequestCount();
            if(response.status === 204) {
                alertHandler(204, "id", "orcamento", "alterar");
            }
            buscarOrcamentos();
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "id", "orcamento", "alterar");
        }
    }

    // Função para excluir um orçamento
    const excluirOrcamento = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `http://localhost:3002/orcamento/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            iterarRequestCount();
            console.log(response);
            if(response.status === 204) {
                alertHandler(204, "id", "orcamento", "excluir");
            }
            buscarOrcamentos();
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "id", "orcamento", "excluir");
        }
    }

    // Função chamada ao selecionar uma linha da tabela
    const onRowSelect = (rowId) => {
        const selectedRow = orcamentos.find(orcamento => orcamento.id === rowId);
        if (selectedRow) {
            setId(selectedRow.id);
            setData(dayjs(reverterData(selectedRow.data)));
            setStatus(selectedRow.status);
            setDesconto(selectedRow.desconto);
            setPago(selectedRow.pago);
            setValorTotal(selectedRow.valor_total)
            setVeiculoId(selectedRow.Veiculo.id);
            setNomeCliente(selectedRow.Veiculo.Cliente.nome);
            setCpfCnpjCliente(selectedRow.Veiculo.Cliente.cpf_cnpj);
            setBomPagadorCliente(selectedRow.Veiculo.Cliente.bom_pagador);
            setMarcaVeiculo(selectedRow.Veiculo.marca);
            setModeloVeiculo(selectedRow.Veiculo.modelo);
            setIdentificacaoVeiculo(selectedRow.Veiculo.placa ? selectedRow.Veiculo.placa : selectedRow.Veiculo.numero_chassis);
        }
    }

    // Limpa os campos do formulário
    function clearFields() {
        setId('');
        setData(dayjs(''));
        setStatus('');
        setDesconto('');
        setPago(false);
        setVeiculoId('');
        setNomeCliente('');
        setCpfCnpjCliente('');
        setBomPagadorCliente('');
        setMarcaVeiculo('');
        setModeloVeiculo('');
        setIdentificacaoVeiculo('');
    }

    // Estados para armazenar os valores dos campos do formulário
    const [id, setId] = useState('');
    const [data, setData] = useState(dayjs(''));
    const [status, setStatus] = useState('');
    const [desconto, setDesconto] = useState('');
    const [pago, setPago] = useState(false);
    const [valorTotal, setValorTotal] = useState('');
    const [veiculoId, setVeiculoId] = useState('');

    const [nomeCliente, setNomeCliente] = useState('');
    const [cpfCnpjCliente, setCpfCnpjCliente] = useState('');
    const [bomPagadorCliente, setBomPagadorCliente] = useState(false);
    const [marcaVeiculo, setMarcaVeiculo] = useState('');
    const [modeloVeiculo, setModeloVeiculo] = useState('');
    const [identificacaoVeiculo, setIdentificacaoVeiculo] = useState('');

    // Renderização do componente
    return (
        <Stack spacing={2}>
            {/* Tabela de orçamentos */}
            <Tabela entidade={"Orçamentos"} colunas={columns} linhas={orcamentos} idFunc={(linha) => {return linha.id} } onRowSelect={onRowSelect}/>
            {/* Campos do formulário */}
            <Stack spacing={2} direction="row">
                {/* Campos do orçamento */}
                <InputCrud nomeCampo={"Id do orçamento"} value={id} setValue={setId} numero={true} maxLength={50}/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Data"
                        format="DD/MM/YYYY"
                        value={data}
                        sx={{ minWidth: 150 }}
                        onChange={(newValue) => setData(newValue)}
                        />
                </LocalizationProvider>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select value={status} label="Status" size="normal" onChange={(event) => setStatus(event.target.value)}>
                        <MenuItem value={"Terminado"}>Terminado</MenuItem>
                        <MenuItem value={"Cancelado"}>Cancelado</MenuItem>
                        <MenuItem value={"Em andamento"}>Em andamento</MenuItem>
                        <MenuItem value={"Não iniciado"}>Não iniciado</MenuItem>
                    </Select>
                </FormControl>
                { !isSmallScreen && <>
                    <InputCrud nomeCampo={"Desconto"} value={desconto} setValue={setDesconto} dinheiro={true} maxLength={15}/>
                    <InputCrud nomeCampo={"Valor total"} value={valorTotal} setValue={setValorTotal} dinheiro={true} maxLength={16}/>
                    <FormControlLabel control={<Checkbox checked={pago} onChange={(e) => setPago(e.target.checked)} />} label="Pago" />
                </> }
            </Stack>
            { isSmallScreen && <Stack spacing={2} direction="row">
                <InputCrud nomeCampo={"Desconto"} value={desconto} setValue={setDesconto} dinheiro={true} maxLength={15}/>
                <InputCrud nomeCampo={"Valor total"} value={valorTotal} setValue={setValorTotal} dinheiro={true} maxLength={16}/>
                <FormControlLabel control={<Checkbox checked={pago} onChange={(e) => setPago(e.target.checked)} />} label="Pago" />
            </Stack> }
            {/* Campos do veículo */}
            <Stack spacing={2} direction="row">
                <InputCrud nomeCampo={"Id do Veículo"} value={veiculoId} setValue={setVeiculoId} numero={true} maxLength={50}/>
                <InputCrud nomeCampo={"Marca do Veículo"} value={marcaVeiculo} setValue={setMarcaVeiculo} disabled={true}/>
                <InputCrud nomeCampo={"Modelo do Veículo"} value={modeloVeiculo} setValue={setModeloVeiculo} disabled={true}/>
                { !isSmallScreen && <>
                    <InputCrud nomeCampo={"Identificação do Veículo"} value={identificacaoVeiculo} setValue={setIdentificacaoVeiculo} disabled={true}/>
                </> }
            </Stack>
            { isSmallScreen && <Stack spacing={2} direction="row">
                <InputCrud nomeCampo={"Identificação do Veículo"} value={identificacaoVeiculo} setValue={setIdentificacaoVeiculo} disabled={true}/>
            </Stack> }
            {/* Campos do cliente */}
            <Stack spacing={2} direction="row">
                <InputCrud nomeCampo={"Nome do Cliente"} value={nomeCliente} setValue={setNomeCliente} disabled={true}/>
                <InputCrud nomeCampo={"CPF/CNPJ do Cliente"} value={cpfCnpjCliente} setValue={setCpfCnpjCliente} disabled={true}/>
                <FormControlLabel control={<Checkbox checked={bomPagadorCliente} disabled />} label="Bom Pagador" />
            </Stack>
            {/* Botões de ação */}
            <Stack spacing={2} direction="row">
                <BotoesCrud incluir={incluiOrcamento} alterar={alteraOrcamento} excluir={excluirOrcamento}/>
                { !isSmallScreen && <>
                    <Botao funcao={clearFields} texto={"Limpar Campos"}/>
                </> }
            </Stack>
            { isSmallScreen && <Stack spacing={2} direction="row">
                <Botao funcao={clearFields} texto={"Limpar Campos"}/>
            </Stack> }
        </Stack>
    );
}
