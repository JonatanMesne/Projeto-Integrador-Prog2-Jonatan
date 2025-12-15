"use strict";

module.exports = (sequelize, DataTypes) => {
	const Permissao = sequelize.define(
		"Permissao",
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
			},
			descricao: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "permissao",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Permissao.associate = function (models) {
		Permissao.hasMany(models.UsuarioPermissao, {
			foreignKey: "id_permissao",
			sourceKey: "id",
		});
	};

	return Permissao;
};
