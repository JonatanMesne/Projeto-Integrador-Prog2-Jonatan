"use strict";

module.exports = (sequelize, DataTypes) => {
	const Orcamento = sequelize.define(
		"Orcamento",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			data: DataTypes.DATE,
            status: DataTypes.STRING,
            desconto: DataTypes.NUMERIC,
            pago: DataTypes.BOOLEAN,
			valor_total: DataTypes.NUMERIC,
            fk_veiculo_id: DataTypes.INTEGER,
		},
		{
			sequelize,
			tableName: "orcamento",
			schema: "public",
			freezeTableName: true,
			timestamps: false,
		},
	);

	Orcamento.associate = function (models) {
		Orcamento.belongsTo(models.Veiculo, {
			foreignKey: "fk_veiculo_id",
			sourceKey: "id",
		});
    };

	return Orcamento;
};
