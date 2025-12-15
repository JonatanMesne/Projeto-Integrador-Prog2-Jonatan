const express = require("express");
const passport = require("passport");
const authService = require("../services/auth-service");

const authRouter = express.Router();

// POST /login - Autenticação de usuário
authRouter.post(
    "/login",
    passport.authenticate("local", { session: false }),
    (req, res) => {
        // Cria o token JWT
        const token = authService.gerarToken(req.body.username);

        res.json({ message: "Login successful", token: token });
    },
);

// POST /logout - Logout de usuário
authRouter.post("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

// POST /novoUsuario - Criar novo usuário
authRouter.post("/novoUsuario", async (req, res) => {
    try {
        console.log("creating");
        await authService.criarNovoUsuario({
            username: req.body.username,
            passwd: req.body.password,
            tipo: req.body.tipo,
        });
        console.log("Usuário inserido");
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

module.exports = authRouter;

