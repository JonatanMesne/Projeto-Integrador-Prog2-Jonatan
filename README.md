# Projeto-Integrador-Prog2-Jonatan
Trabalho integrador da matéria programação 2.

## Como executar o projeto (Windows)

1. **Baixar o código**
2. **Instalar dependências**
   - No terminal, execute `yarn install` nos diretórios `FrontEnd` e `BackEnd`.
3. **Configurar o banco de dados**
   - Crie ou escolha uma database no pgAdmin 4 para armazenar os dados.
   - Execute o código SQL presente em `Database.sql` no pgAdmin 4.
4. **Configurar conexão local**
   - Altere os campos `database`, `username` e `password` em `BackEnd/config/localConnection.js` para os seus dados locais do Postgres.
5. **Configurar variáveis de ambiente**
   - Crie um arquivo `.env` no diretório `BackEnd` e insira uma variável `SESSION_SECRET` com uma string aleatória e longa. Exemplo:
     ```env
     SESSION_SECRET=a5nSJvszrKRSagYwfRuv0FtqOiuc1qhwNKEncbxEmddmZc6ClRuPDqbU83CkhtyZM79yDeMgzwehPwEl8Pnjlsc1IccztTFyYMEHoFRptkXHVy8GerAaK5jjboeIE0jZ
     ```
6. **Iniciar o BackEnd**
   - No terminal, execute `nodemon ./server.js` no diretório `BackEnd` e mantenha o terminal aberto.
7. **Iniciar o FrontEnd**
   - No terminal, execute `yarn dev` no diretório `FrontEnd` e mantenha o terminal aberto.
8. **Criar usuário inicial**
   - Faça um POST usando o Insomnia no URL `http://localhost:3002/novoUsuario` com o body contendo `username`, `password` e `tipo` ("Comum" ou "Administrador").
9. **Acessar o sistema**
   - Acesse `http://localhost:5173/` no navegador e entre com o usuário e senha cadastrados.

## Bibliotecas necessárias

### BackEnd
- @sequelize/postgres
- bcrypt
- cls-hooked
- cors
- dotenv
- express
- express-session
- jsonwebtoken
- nodemon
- passport
- passport-jwt
- passport-local
- pg-promise
- sequelize

### FrontEnd
- @emotion/react
- @emotion/styled
- @mui/material
- @mui/x-data-grid
- @mui/x-date-pickers
- @react-input/mask
- axios
- dayjs
- react
- react-dom
- react-input
- react-input-mask
- react-is
- string-mask