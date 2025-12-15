# Projeto-Integrador-Prog2-Jonatan
 Trabalho integrador da matéria programação 2.

Como executar o projeto(Windows):
    1- Baixar o código;
    2- Executar "yarn install" no terminal nos diretórios FrontEnd e BackEnd;
    3- Executar o código SQL presente em Database.sql no pgAdmin 4;
    4- Mudar a "database", "username" e "password" em localConnection.js para os seus dados locais do postgres;
    5- Executar a instrução no terminal "nodemon ./server.js" no diretório BackEnd e manter o terminal aberto;
    6- Executar a instrução no terminal "yarn dev" no diretório FrontEnd e manter o terminal aberto;
    7- Executar uma requisição usando Insomnia no URL "http://localhost:3002/novoUsuario" com o body contendo "username", "password" e "tipo", com o tipo sendo ou "Comum" ou "Administrador".
    8- Acessar o URL "http://localhost:5173/" no navegador e entrar no sistema com o usuário e senha cadastrados no passo anterior.

As bibliotecas necessárias para rodar o código são:
    BackEnd: 
        @sequelize/postgres
        bcrypt
        cls-hooked
        cors
        dotenv
        express
        express-session
        jsonwebtoken
        nodemon
        passport
        passport-jwt
        passport-local
        pg-promise
        sequelize
    FrontEnd:
        @emotion/react
        @emotion/styled
        @mui/material
        @mui/x-data-grid
        @mui/x-date-pickers
        @react-input/mask
        axios
        dayjs
        react
        react-dom
        react-input
        react-input-mask
        react-is
        string-mask