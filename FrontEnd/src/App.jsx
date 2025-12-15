// Importação de hooks, componentes e bibliotecas externas
import { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Stack, Snackbar, Typography, Box, Button } from "@mui/material";
import Cliente from "./Cliente";
import Orcamento from "./Orcamento";
import Dashboard from "./Dashboard";
import BotaoBusca from "./BotaoBusca";
import Login from "./Login";
import SimpleText from "./simpleText";

export default function App(){

	// Estados de autenticação e usuário
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userLogin, setUserLogin] = useState("");
	const [userTipo, setUserTipo] = useState("");
	const [permissoes, setPermissoes] = useState([]);

	// Verifica token no localStorage ao carregar a aplicação
	useEffect(() => {
		// Verifica se há token no localStorage ao carregar
		const token = localStorage.getItem("token");
		if (token) {
			// Tenta decodificar o token para obter o login do usuário
			try {
				const payload = JSON.parse(atob(token.split(".")[1]));
				if (payload.username) {
					setUserLogin(payload.username);
					setIsLoggedIn(true);
				}
			} catch (error) {
				console.error("Erro ao decodificar token:", error);
				localStorage.removeItem("token");
			}
		}
	}, []);

	// Busca o tipo do usuário ao logar
	useEffect(() => {
		if (isLoggedIn && userLogin) {
			buscarTipoUsuario(userLogin);
		}
	}, [isLoggedIn, userLogin]);

	// Função para buscar o tipo do usuário no servidor
	const buscarTipoUsuario = async (login) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(`http://localhost:3002/usuario/tipo/${login}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
			iterarRequestCount();
			setUserTipo(response.data.tipo.tipo);
		} catch (error) {
			console.error("Erro ao buscar tipo usuário:", error);
			alertHandler(error.status, "login", "usuário", "buscar");
		}
	}

	// Função para tratar login
	const handleLogin = (success, username = null) => {
		if (success) {
			// Se o username foi passado, usa ele, senão tenta decodificar do token
			if (username) {
				setUserLogin(username);
			} else {
				try {
					const token = localStorage.getItem("token");
					if (token) {
						const payload = JSON.parse(atob(token.split(".")[1]));
						if (payload.username) {
							setUserLogin(payload.username);
						}
					}
				} catch (error) {
					console.error("Erro ao decodificar token:", error);
				}
			}
			setIsLoggedIn(true);
		} else {
			setIsLoggedIn(false);
			setUserLogin("");
			localStorage.removeItem("token");
		}
	};

	// Função para tratar logout
	const handleLogout = () => {
		setIsLoggedIn(false);
		setUserLogin("");
		setPermissoes([]);
		localStorage.removeItem("token");
	};

	// Contadores para requisições (usados para a dashboard)
	const [requestCount, setRequestCount] = useState(0);

	function iterarRequestCount() {
		setRequestCount(requestCount + 1);
	}

	const [dashboardRequestCount, setDashboardRequestCount] = useState(0);

	function iterarDashboardRequestCount() {
		setDashboardRequestCount(dashboardRequestCount + 3);
	}

	// Estados e funções para exibir mensagens de alerta
	const [openMessage, setOpenMessage] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [messageSeverity, setMessageSeverity] = useState("warning");

	function alertHandler(status, identificador, entidade, operation, sqlError = null) {
		setOpenMessage(true);
		if(status === 404) { //acontece quando faltou ids ao alterar ou excluir
			setMessageText(`${identificador} é obrigatório`);
			setMessageSeverity('warning');
		} else if (status === 204) { //acontece quando o registro não é encontrado
			setMessageText(`Nenhum ${entidade} encontrado`);
			setMessageSeverity('warning');
		} else if (status === 400) { 
			setMessageText("Número de chassi ou placa já cadastrado para outro veículo.");
			setMessageSeverity('warning');
		} else if (status === 200) {
			setMessageText("Tabela de veículo aberta (abaixo).");
			setMessageSeverity("success");
		} else { //erro de servidor
			//os erros abaixos são válidos apenas para os veículos, pois apenas neles eu uso o código de erro do sql
			if (sqlError) {
				if (sqlError === "23505") {
					setMessageText("Número de chassi ou placa já cadastrado para outro veículo.");
					setMessageSeverity('warning');
					return;
				} else if (sqlError === "23503") {
					if(operation === "deletar") {
						setMessageText("Veículo ainda é usado em orçamento.");
					} else {
						setMessageText("CPF/CNPJ do cliente não existe.");
					}
					setMessageSeverity('warning');
					return;
				}
			}
			setMessageText(`Erro ao ${operation} ${entidade}.`);
			setMessageSeverity('error');
		}
	}

	function handleCloseMessage(_, reason) {
		if (reason === "clickaway") {
			return;
		}
		setOpenMessage(false);
	}

	// Estados para alternar exibição de telas
	const [exibeClientes, setExibeClientes] = useState(false);
	const [exibeOrcamentos, setExibeOrcamentos] = useState(false);
	const [exibeDashboard, setExibeDashboard] = useState(false);

	// Funções para alternar entre as telas principais
	const toggleClientes = () => {
		setExibeClientes(!exibeClientes);
		setExibeOrcamentos(false);
		setExibeDashboard(false);
	};

	const toggleOrcamentos = () => {
		setExibeOrcamentos(!exibeOrcamentos);
		setExibeClientes(false);
		setExibeDashboard(false);
	};

	const toggleDashboard = () => {
		setExibeDashboard(!exibeDashboard);
		setExibeOrcamentos(false);
		setExibeClientes(false);
	}

	// Se não estiver logado, mostra a tela de login
	if (!isLoggedIn) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
			>
				<Stack spacing={2} alignItems="center">
					<SimpleText component={"h1"} text={"Gerenciador financeiro de mecânica"}/>
					<Login handleLogin={handleLogin} iterarRequestCount={iterarRequestCount} />
				</Stack>
			</Box>
		);
	}

	// Se estiver logado, mostra o conteúdo principal
	return (
		<Stack spacing={2}>
			{/* Título e informações do usuário */}
			<SimpleText component={"h1"} text={"Gerenciador financeiro de mecânica"}/>
			<Stack spacing={2} direction="row" alignItems="center">
				<SimpleText component={"p"} text={`Usuário: ${userLogin}`}/>
				<SimpleText component={"p"} text={`Tipo: ${userTipo}`}/>
				<Button
					variant="outlined"
					color="error"
					onClick={handleLogout}
					style={{ width: "150px" }}
				>
					Sair
				</Button>
			</Stack>
			{/* Botões de navegação */}
			<Stack spacing={2} direction="row" alignItems="center">
				<BotaoBusca texto={'Clientes'} funcao={toggleClientes}/>
				<BotaoBusca texto={'Orçamentos'} funcao={toggleOrcamentos}/>
				<BotaoBusca texto={'Dashboard'} funcao={toggleDashboard}/>
			</Stack>
			{/* Renderização condicional das telas principais */}
				{ exibeDashboard && <Dashboard alertHandler={alertHandler} requestCount={requestCount} tipoUsuario={userTipo}
					dashboardRequestCount={dashboardRequestCount} iterarDashboardRequestCount={iterarDashboardRequestCount}/>}
				{ exibeClientes && <Cliente alertHandler={alertHandler} iterarRequestCount={iterarRequestCount}/> }
				{ exibeOrcamentos && <Orcamento alertHandler={alertHandler} iterarRequestCount={iterarRequestCount}/> }
				{ (exibeOrcamentos || exibeClientes) && <SimpleText text={"Obs: Para ordenar ou filtrar alguma coluna mova o mouse para o cabeçalho da coluna e clique os 3 pontinhos a direita para abrir o menu."} component={"p"}/>}
			{/* Snackbar para mensagens de alerta */}
			<Snackbar
				open={openMessage}
				autoHideDuration={6000}
				onClose={handleCloseMessage}
			>
				<Alert
					severity={messageSeverity}
					onClose={handleCloseMessage}
					>
				{messageText}
				</Alert>
			</Snackbar>
		</Stack>
	)
}