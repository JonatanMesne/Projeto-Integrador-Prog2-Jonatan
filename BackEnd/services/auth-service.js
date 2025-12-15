const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const model = require("../models");

// Configuração da estratégia local (username/password)
const configureLocalStrategy = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
            },
            async (username, password, done) => {
                try {
                    // busca o usuário no banco de dados usando Sequelize
                    const user = await model.Usuario.findOne({
                        where: { login: username },
                    });

                    // se não encontrou, retorna erro
                    if (!user) {
                        return done(null, false, { message: "Usuário incorreto." });
                    }

                    // verifica se o hash da senha bate com a senha informada
                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.senha,
                    );

                    // se senha está ok, retorna o objeto usuário
                    if (passwordMatch) {
                        console.log("Usuário autenticado!");
                        return done(null, user);
                    } else {
                        // senão, retorna um erro
                        return done(null, false, { message: "Senha incorreta." });
                    }
                } catch (error) {
                    return done(error);
                }
            },
        ),
    );
};

// Configuração da estratégia JWT
const configureJwtStrategy = () => {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: "your-secret-key",
            },
            async (payload, done) => {
                try {
                    const user = await model.Usuario.findByPk(payload.username);

                    if (user) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                } catch (error) {
                    done(error, false);
                }
            },
        ),
    );
};

// Configuração de serialização do usuário
const configureSerialization = () => {
    passport.serializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, {
                login: user.login,
                username: user.login,
            });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
};

// Função para criar novo usuário
const criarNovoUsuario = async (userData) => {
    const saltRounds = 10;
    const { username, passwd, tipo } = userData;
    const userLogin = username;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPasswd = bcrypt.hashSync(passwd, salt);

    await model.Usuario.create({
        login: userLogin,
        senha: hashedPasswd,
        tipo: tipo,
    });

    return { login: userLogin };
};

// Função para gerar token JWT
const gerarToken = (username) => {
    return jwt.sign({ username: username }, "your-secret-key", {
        expiresIn: "1h",
    });
};

// Middleware para autenticação JWT
const requireJWTAuth = passport.authenticate("jwt", { session: false });

// Função para verificar se um usuário tem uma permissão específica por descrição
const verificarPermissaoPorTipo = async (tipo, descricaoPermissao) => {
    try {
        // Busca a permissão pela descrição
        const permissao = await model.Permissao.findOne({
            where: { descricao: descricaoPermissao },
        });

        if (!permissao) {
            return false;
        }

        // Verifica se o usuário tem essa permissão
        const usuarioPermissao = await model.UsuarioPermissao.findOne({
            where: {
                tipo: tipo,
                id_permissao: permissao.id,
            },
        });

        return usuarioPermissao !== null;
    } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        return false;
    }
};

// Função para obter todas as permissões de um usuário
const obterPermissoesUsuario = async (tipo) => {
    try {
        const permissoes = await model.UsuarioPermissao.findAll({
            where: {
                tipo: tipo,
            },
            include: [
                {
                    model: model.Permissao,
                    as: "Permissao",
                },
            ],
        });

        return permissoes.map((up) => up.Permissao);
    } catch (error) {
        console.error("Erro ao obter permissões do usuário:", error);
        return [];
    }
};

// Middleware reutilizável para verificar permissão específica
// Deve ser usado APÓS o requireJWTAuth
const verificarPermissaoMiddleware = (descricaoPermissao) => {
    return async (req, res, next) => {
        try {
            // Verifica se o usuário está autenticado (req.user deve ser definido pelo requireJWTAuth)
            if (!req.user) {
                return res.status(401).json({ message: "Usuário não autenticado." });
            }

            const tipo = req.user.tipo;
            const temPermissao = await verificarPermissaoPorTipo(
                tipo,
                descricaoPermissao,
            );

            if (!temPermissao) {
                return res.status(403).json({
                    message: `Acesso negado. Permissão necessária: ${descricaoPermissao}`,
                });
            }

            // Se passou na verificação, continua para o próximo middleware
            next();
        } catch (error) {
            console.error("Erro ao verificar permissão:", error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    };
};

// Middleware para verificar JWT e permissão específica
const requirePermissao = (descricaoPermissao) => {
    return [
        requireJWTAuth,
        async (req, res, next) => {
            try {
                // req.user é definido pelo requireJWTAuth
                if (!req.user) {
                    return res.status(401).json({ message: "Usuário não autenticado." });
                }

                const tipo = req.user.tipo;
                const temPermissao = await verificarPermissaoPorTipo(
                    tipo,
                    descricaoPermissao,
                );

                if (!temPermissao) {
                    return res.status(403).json({
                        message: `Acesso negado. Permissão necessária: ${descricaoPermissao}`,
                    });
                }

                next();
            } catch (error) {
                console.error("Erro ao verificar permissão:", error);
                return res.status(500).json({ message: "Erro interno do servidor." });
            }
        },
    ];
};

module.exports = {
    configureLocalStrategy,
    configureJwtStrategy,
    configureSerialization,
    criarNovoUsuario,
    gerarToken,
    requireJWTAuth,
    verificarPermissaoPorTipo,
    obterPermissoesUsuario,
    verificarPermissaoMiddleware,
    requirePermissao,
};

