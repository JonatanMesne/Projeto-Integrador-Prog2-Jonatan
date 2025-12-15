import { useEffect, useState } from "react";
import axios from "axios";
import { Stack } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tabela from "./Tabela";
import InputCrud from "./InputCrud";
import BotoesCrud from "./BotoesCrud";
import Botao from "./Botao";


export default function ClienteVeiculos({ alertHandler, cpfCnpj, iterarRequestCount }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    
    const [veiculos, setVeiculos] = useState([]);
    //sum of all columns widths should be 948 to fit in the DataGrid container
    const columns = [
        { field: "id", headerName: "ID", width: 150 },
        { field: "marca", headerName: "Marca", width: 150 },
        { field: "modelo", headerName: "Modelo", width: 250 },
        { field: "placa", headerName: "Placa", width: 150 },
        { field: "numero_chassis", headerName: "Número do Chassi", width: 248 },
    ];

    function removeMask(text) {
        return text.replace(/\D/g, '');
    }

    const buscarVeiculos = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/veiculo/${removeMask(cpfCnpj)}`);
            iterarRequestCount();
            if (response.status === 204) {
                alertHandler(204, "ID", "veículo", "buscar");
            }
            let placeHolderVeiculos = response.data.veiculos;
            if (placeHolderVeiculos) {
                placeHolderVeiculos.forEach(veiculo => {
                    if(veiculo.placa == null) {
                        veiculo.placa = "";
                    }
                    if(veiculo.numero_chassis == null) {
                        veiculo.numero_chassis = "";
                    }
                });
            }
            setVeiculos(placeHolderVeiculos);
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "ID", "veículo", "buscar");
        }
    };

    useEffect(() => {
        buscarVeiculos();
        setFkClienteCpfCnpj(cpfCnpj);
    }, [cpfCnpj]);

    const [id, setId] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [placa, setPlaca] = useState('');
    const [numero_chassis, setNumeroChassis] = useState('');
    const [fk_cliente_cpf_cnpj, setFkClienteCpfCnpj] = useState(cpfCnpj);

    const incluiVeiculo = async () => {
        let tempPlaca = placa;
        if (tempPlaca === '') {
            tempPlaca = null;
        }
        let tempNumeroChassis = numero_chassis;
        if (tempNumeroChassis === '') {
            tempNumeroChassis = null;
        }
        try {
            const response = await axios.post(
                "http://localhost:3002/veiculo/", { marca: marca, modelo: modelo, placa: tempPlaca, 
                    numero_chassis: tempNumeroChassis, fk_cliente_cpf_cnpj: removeMask(cpfCnpj) }
            );
            iterarRequestCount();
            buscarVeiculos();
        } catch (error) {
            console.log(error);
            if(error.response.data.sqlError) {
                alertHandler(error.status, "ID", "veículo", "incluir", error.response.data.sqlError);
            } else {
                alertHandler(error.status, "ID", "veículo", "incluir");
            }
        }
    }

    const alteraVeiculo = async () => {
        let tempPlaca = placa;
        if (tempPlaca === '') {
            tempPlaca = null;
        }
        let tempNumeroChassis = numero_chassis;
        if (tempNumeroChassis === '') {
            tempNumeroChassis = null;
        }
        try {
            const response = await axios.put(
                `http://localhost:3002/veiculo/${id}`, { marca: marca, modelo: modelo, placa: tempPlaca, 
                    numero_chassis: tempNumeroChassis, fk_cliente_cpf_cnpj: removeMask(cpfCnpj) }
            );
            iterarRequestCount();
            if (response.status === 204) {
                alertHandler(204, "ID", "veículo", "alterar");
            }
            buscarVeiculos();
        } catch (error) {
            console.log(error);
            if(error.response.data.sqlError) {
                alertHandler(error.status, "ID", "veículo", "alterar", error.response.data.sqlError);
            } else {
                alertHandler(error.status, "ID", "veículo", "alterar");
            }
        }
    }

    const excluirVeiculo = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:3002/veiculo/${id}`
            );
            iterarRequestCount();
            if (response.status === 204) {
                alertHandler(204, "ID", "veículo", "excluir");
            }
            buscarVeiculos();
        } catch (error) {
            console.log(error);
            if(error.response.data.sqlError) {
                alertHandler(error.status, "ID", "veículo", "excluir", error.response.data.sqlError);
            } else {
                alertHandler(error.status, "ID", "veículo", "excluir");
            }
        }
    }

    const onRowSelect = (rowId) => {
        const selectedRow = veiculos.find(veiculo => veiculo.id === rowId);
        if (selectedRow) {
            setId(selectedRow.id);
            setMarca(selectedRow.marca);
            setModelo(selectedRow.modelo);
            setPlaca(selectedRow.placa);
            setNumeroChassis(selectedRow.numero_chassis);
        }
    }

    function clearFields() {
        setId('');
        setMarca('');
        setModelo('');
        setPlaca('');
        setNumeroChassis('');
    }

    return (
        <Stack spacing={2}>
            <Tabela entidade={"Veículos do cliente"} colunas={columns} linhas={veiculos} idFunc={(linha) => {return linha.id} } onRowSelect={onRowSelect}/>
            <Stack spacing={2} direction="row">
                <InputCrud nomeCampo={"ID"} value={id} setValue={setId} numero={true} maxLength={50}/>
                <InputCrud nomeCampo={"Marca"} value={marca} setValue={setMarca} maxLength={20}/>
                <InputCrud nomeCampo={"Modelo"} value={modelo} setValue={setModelo} maxLength={30}/>
                { !isSmallScreen && <>
                    <InputCrud nomeCampo={"Placa"} value={placa} setValue={setPlaca} maxLength={8}/>
                    <InputCrud nomeCampo={"Número do Chassi"} value={numero_chassis} setValue={setNumeroChassis} maxLength={17}/>
                    <InputCrud nomeCampo={"CPF/CNPJ do cliente"} value={fk_cliente_cpf_cnpj} setValue={setFkClienteCpfCnpj} cpfCnpj={true}/>
                </> }
            </Stack>
            { isSmallScreen && <Stack spacing={2} direction="row">
                <InputCrud nomeCampo={"Placa"} value={placa} setValue={setPlaca} maxLength={8}/>
                <InputCrud nomeCampo={"Número do Chassi"} value={numero_chassis} setValue={setNumeroChassis} maxLength={17}/>
                <InputCrud nomeCampo={"CPF/CNPJ do cliente"} value={fk_cliente_cpf_cnpj} setValue={setFkClienteCpfCnpj} cpfCnpj={true}/>
            </Stack> }
            <Stack spacing={2} direction="row">
                <BotoesCrud incluir={incluiVeiculo} alterar={alteraVeiculo} excluir={excluirVeiculo}/>
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
