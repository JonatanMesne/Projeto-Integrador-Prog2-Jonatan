"use strict";

module.exports = (sequelize, DataTypes) => {
	const Cliente = sequelize.define(
		"Cliente",
		{
			cpf_cnpj: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			nome: DataTypes.STRING,
			email: DataTypes.STRING,
			telefone: DataTypes.STRING,
			bom_pagador: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			tableName: "cliente",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Cliente.associate = function (models) {
		Cliente.hasMany(models.Veiculo, {
			foreignKey: "fk_cliente_cpf_cnpj",
			sourceKey: "cpf_cnpj",
		});
	};

	return Cliente;
};
