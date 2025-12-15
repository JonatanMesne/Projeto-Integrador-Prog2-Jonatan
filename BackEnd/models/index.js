"use strict";

// Importação de módulos necessários
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/localConnection");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const db = {};

// indexa os models para exportar e usar nos repositories
fs.readdirSync(__dirname)
	// Encontra os arquivos dos models (exceto este arquivo)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 &&
			file !== basename &&
			file.slice(-3) === ".js"
		);
	})
	.forEach((file) => {
		// Importa e inicializa cada model
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes,
		);
		db[model.name] = model;
	});

// Associa os models caso exista o método associate
Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

// Exporta instâncias do sequelize e Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
