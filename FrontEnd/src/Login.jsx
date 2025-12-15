// Importação de hooks, bibliotecas e componentes externos
import React from "react";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";

export default function Login({ handleLogin, iterarRequestCount }) {
	// Estados para armazenar usuário e senha
	const [username, setUsername] = React.useState("");
	const [passwd, setPasswd] = React.useState("");

	// Estados para controle de mensagens de alerta
	const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");

	// Função chamada ao submeter o formulário de login
	async function enviaLogin(event) {
		event.preventDefault();
		try {
			const response = await axios.post("http://localhost:3002/login", {
				username: username,
				password: passwd,
			});
			iterarRequestCount();
			if (response.status >= 200 && response.status < 300) {
				// Salva o token JWT na sessão
				localStorage.setItem("token", response.data.token);
				 // Seta o estado do login caso tudo deu certo, passando o username
				handleLogin(true, username);
			} else {
				// Falha na autenticação
				console.error("Falha na autenticação");
				setOpenMessage(true);
				setMessageText("Falha na autenticação!");
				setMessageSeverity("error");
			}
		} catch (error) {
			console.log(error);
			setOpenMessage(true);
			setMessageText("Falha ao logar usuário!");
			setMessageSeverity("error");
		}
	}

	// Função chamada ao clicar em cancelar
	function cancelaLogin() {
		if (username !== "" || passwd !== "") {
			setUsername("");
			setPasswd("");
		}
		setOpenMessage(true);
		setMessageText("Login cancelado!");
		setMessageSeverity("warning");
	}

	// Função para fechar o Snackbar de mensagem
	function handleCloseMessage(_, reason) {
		if (reason === "clickaway") {
			return;
		}
		setOpenMessage(false);
	}

	// Renderização do formulário de login
	return (
		<Box style={{ maxWidth: "300px" }}>
			<Stack spacing={2}>
				<Stack spacing={2}>
					<TextField
						required
						id="username-input"
						label="Usuário: "
						size="small"
						value={username}
						onChange={(event) => {
							setUsername(event.target.value);
						}}
					/>
					<TextField
						required
						id="passwd-input"
						label="Senha: "
						type="password"
						size="small"
						value={passwd}
						onChange={(event) => {
							setPasswd(event.target.value);
						}}
					/>
				</Stack>
				<Stack direction="row" spacing={3}>
					<Button
						variant="contained"
						style={{
							maxWidth: "100px",
							minWidth: "100px",
						}}
						color="primary"
						onClick={enviaLogin}
					>
						Entrar
					</Button>
					<Button
						variant="outlined"
						style={{
							maxWidth: "100px",
							minWidth: "100px",
						}}
						color="error"
						onClick={cancelaLogin}
					>
						Cancelar
					</Button>
				</Stack>
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
		</Box>
	);
}