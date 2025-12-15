require('dotenv').config();
const express = require("express");
const cors = require("cors");
const clienteRouter = require("./controllers/cliente-controller");
const orcamentoRouter = require("./controllers/orcamento-controller");
const veiculoRouter = require("./controllers/veiculo-controller");
const usuarioRouter = require("./controllers/usuario-controller");
const authRouter = require("./controllers/auth-controller");
const authService = require("./services/auth-service");

const session = require("express-session");
const passport = require("passport");

const app = express();
app.use(cors());
app.use(express.json());

// Configurar express-session ANTES do passport.session()
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true }, // false para desenvolvimento (true requer HTTPS)
	}),
);

app.use(passport.initialize());
app.use(passport.session());

// Configurar estratégias do Passport
authService.configureLocalStrategy();
authService.configureJwtStrategy();
authService.configureSerialization();

const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));

// Usar o router de autenticação
app.use("/", authRouter);

// Usar o router de clientes
app.use("/cliente", clienteRouter);
// Usar o router de veículos
app.use("/veiculo", veiculoRouter);
// Usar o router de orçamentos
app.use("/orcamento", orcamentoRouter);
// Usar o router de usuarios
app.use("/usuario", usuarioRouter);