"use strict";

module.exports = (sequelize, DataTypes) => {
	const Veiculo = sequelize.define(
		"Veiculo",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			marca: DataTypes.STRING,
            modelo: DataTypes.STRING,
            placa: DataTypes.STRING,
            numero_chassis: DataTypes.STRING,
            fk_cliente_cpf_cnpj: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: "veiculo",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Veiculo.associate = function (models) {
		Veiculo.belongsTo(models.Cliente, {
			foreignKey: "fk_cliente_cpf_cnpj",
			sourceKey: "cpf_cnpj",
		});
        Veiculo.hasMany(models.Orcamento, {
			foreignKey: "fk_veiculo_id",
			sourceKey: "id",
		});
    };

	return Veiculo;
};
