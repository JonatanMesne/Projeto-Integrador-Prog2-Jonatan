import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Stack } from "@mui/material";
import SimpleText from "./simpleText";
import StringMask from "string-mask";

export default function Dashboard({ alertHandler, tipoUsuario, requestCount, dashboardRequestCount, iterarDashboardRequestCount }) {
    const [quantidadeClientes, setQuantidadeClientes] = useState('');
    const [quantidadeBomPagadores, setQuantidadeBomPagadores] = useState('');
    const [quantidadeOrcamentos, setQuantidadeOrcamentos] = useState('');
    const [somaDesconto, setSomaDesconto] = useState('');
    const [somaValorTotal, setSomaValorTotal] = useState('');
    const [somaValorTotal30Dias, setSomaValorTotal30Dias] = useState('');
    const [quantidadeVeiculosOrcamento, setQuantidadeVeiculosOrcamento] = useState('');
    const [quantidadeVeiculos, setQuantidadeVeiculos] = useState('');

    const maskDinheiro = new StringMask('R\$ #.##0,00', {reverse: true});
    
    function removeMask(text) {
        if(text[text.length - 2] == '.') {
            text += '0';
        } else if(parseInt(text) == parseFloat(text)) { //a soma foi inteira
            text += "00";
        }
        return text.replace(/\D/g, '');
    }

    const buscarDados = async () => {
        const endpoints = [
            "http://localhost:3002/veiculo/dashboard",
            "http://localhost:3002/cliente/dashboard",
            "http://localhost:3002/orcamento/dashboard",
        ];
        try {
            // 1. Map the endpoints array to an array of Promises (the axios calls)
            const promises = endpoints.map(url => axios.get(url));

            // 2. Use Promise.all() to wait for all Promises to resolve concurrently
            const [
                veiculoResponse, 
                clienteResponse, 
                orcamentoResponse
            ] = await Promise.all(promises);
            iterarDashboardRequestCount();
            setQuantidadeClientes(clienteResponse.data.dados.quantidadeClientes);
            setQuantidadeBomPagadores(clienteResponse.data.dados.quantidadeBomPagadores);
            setQuantidadeVeiculos(veiculoResponse.data.dados.quantidadeVeiculos);
            setQuantidadeOrcamentos(orcamentoResponse.data.dados.quantidadeOrcamentos);
            setSomaDesconto(maskDinheiro.apply(removeMask(orcamentoResponse.data.dados.somaDesconto.toString())));
            setSomaValorTotal(maskDinheiro.apply(removeMask(orcamentoResponse.data.dados.somaValorTotal.toString())));
            setSomaValorTotal30Dias(maskDinheiro.apply(removeMask(orcamentoResponse.data.dados.somaValorTotal30Dias.toString())));
            setQuantidadeVeiculosOrcamento(orcamentoResponse.data.dados.quantidadeVeiculos);
        } catch (error) {
            console.log(error);
            alertHandler(error.status, "", "dados para o dashboard", "buscar");
        }
    }

    useEffect(() => {
        buscarDados();
    }, [requestCount]);

    console.log()

    return (
        <Box sx={{ height: '100%', width: { xs: 400, md: 1000 } }}>
            <Stack spacing={2}>
                <SimpleText component="h2" text={"Dashboard"}/>
                { tipoUsuario == "Administrador" && <Stack spacing={2} direction={"row"}>
                        <Box sx={{ height: '100%', width: 1000 }}>
                            <SimpleText component="h3" text={"Sistema"}/>
                            <SimpleText component="p" text={`Quantidade de pedidos realizados nessa instância (contando pedidos da dashboard): ${requestCount + dashboardRequestCount}`}/>
                            <SimpleText component="p" text={`Quantidade de pedidos realizados nessa instância (exceto pedidos da dashboard): ${requestCount}`}/>
                        </Box>
                    </Stack> }
                <Stack spacing={2} direction={"row"}>
                    <Box sx={{ height: '100%', width: 500 }}>
                        <SimpleText component="h3" text={"Veículos"}/>
                        <SimpleText component="p" text={`Quantidade de veículos: ${quantidadeVeiculos}`}/> 
                    </Box>
                    <Box sx={{ height: '100%', width: 500 }}>
                        <SimpleText component="h3" text={"Clientes"}/>
                        <SimpleText component="p" text={`Quantidade de clientes: ${quantidadeClientes}`}/>
                        <SimpleText component="p" text={`Quantidade de clientes bom pagadors: ${quantidadeBomPagadores}`}/>
                    </Box>
                </Stack>
                <Stack spacing={2} direction={"row"}>
                    <Box sx={{ height: '100%', width: 1000 }}>
                        <SimpleText component="h3" text={"Orçamento"}/>
                        <SimpleText component="p" text={`Quantidade de orçamentos: ${quantidadeOrcamentos}`}/>
                        <SimpleText component="p" text={`Total de descontos em orçamentos: ${somaDesconto}`}/>
                        <SimpleText component="p" text={`Total de orçamentos: ${somaValorTotal}`}/>
                        <SimpleText component="p" text={`Total de orçamentos nos útlimos trinta dias: ${somaValorTotal30Dias}`}/>
                        <SimpleText component="p" text={`Quantidade de veículos distintos com orçamentos: ${quantidadeVeiculosOrcamento}`}/>
                    </Box>
                </Stack>
            </Stack>
        </Box>

    );
}