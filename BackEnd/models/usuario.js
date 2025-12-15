"use strict";

module.exports = (sequelize, DataTypes) => {
	const Usuario = sequelize.define(
		"Usuario",
		{
			login: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			senha: {
				type: DataTypes.STRING,
				allowNull: false,
			},
            tipo: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "usuario",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	return Usuario;
};
