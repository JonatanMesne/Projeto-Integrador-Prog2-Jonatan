drop table if exists usuario;
drop table if exists usuario_permissao;
drop table if exists permissao;
drop table if exists orcamento;
drop table if exists veiculo;
drop table if exists cliente;

CREATE TABLE Cliente (
    CPF_CNPJ VARCHAR(14) PRIMARY KEY,
    Nome VARCHAR(50) NOT NULL,
    Email VARCHAR(50),
    Telefone VARCHAR(18),
    Bom_pagador BOOLEAN
);

CREATE TABLE Veiculo (
    Id SERIAL PRIMARY KEY,
    Marca VARCHAR(20) NOT NULL,
    Modelo VARCHAR(30) NOT NULL,
    Placa VARCHAR(8) UNIQUE,
    Numero_Chassis VARCHAR(17) UNIQUE,
    fk_Cliente_CPF_CNPJ VARCHAR(18) NOT NULL
);

CREATE TABLE Orcamento (
    Id SERIAL PRIMARY KEY,
    Data DATE NOT NULL,
    Status VARCHAR(15) NOT NULL,
    Desconto NUMERIC(7,2),
    Valor_Total NUMERIC(8,2),
    Pago BOOLEAN,
    fk_Veiculo_Id SERIAL NOT NULL
);

CREATE TABLE Usuario (
    Login VARCHAR(50) PRIMARY KEY,
    Senha VARCHAR(100) NOT NULL,
    Tipo VARCHAR(15) NOT NULL
);

create table permissao
(
  id bigint  NOT NULL,
  descricao varchar NOT NULL,
  PRIMARY KEY (id)
);

create table usuario_permissao
(
  tipo varchar NOT NULL,
  id_permissao bigint NOT NULL,
  PRIMARY KEY (tipo, id_permissao),
  CONSTRAINT FK_usuario_permissao_permissao FOREIGN KEY (id_permissao) REFERENCES permissao (id)
);
 
ALTER TABLE Veiculo ADD CONSTRAINT FK_Veiculo
    FOREIGN KEY (fk_Cliente_CPF_CNPJ)
    REFERENCES Cliente (CPF_CNPJ)
    ON DELETE CASCADE;
 
ALTER TABLE Orcamento ADD CONSTRAINT FK_Orcamento
    FOREIGN KEY (fk_Veiculo_Id)
    REFERENCES Veiculo (Id)
	ON DELETE RESTRICT;

INSERT INTO permissao (id, descricao) VALUES (1, 'ACESSAR_CLIENTES');
INSERT INTO permissao (id, descricao) VALUES (2, 'ACESSAR_VEICULOS');
INSERT INTO permissao (id, descricao) VALUES (3, 'ACESSAR_ORCAMENTOS');
INSERT INTO permissao (id, descricao) VALUES (4, 'ACESSAR_USUARIOS');

INSERT INTO usuario_permissao (tipo, id_permissao) VALUES ('Comum', 1);
INSERT INTO usuario_permissao (tipo, id_permissao) VALUES ('Administrador', 1);
INSERT INTO usuario_permissao (tipo, id_permissao) VALUES ('Comum', 2);
INSERT INTO usuario_permissao (tipo, id_permissao) VALUES ('Administrador', 2);
INSERT INTO usuario_permissao (tipo, id_permissao) VALUES ('Comum', 3);
INSERT INTO usuario_permissao (tipo, id_permissao) VALUES ('Administrador', 3);
INSERT INTO usuario_permissao (tipo, id_permissao) VALUES ('Comum', 4);
INSERT INTO usuario_permissao (tipo, id_permissao) VALUES ('Administrador', 4);

insert into cliente(cpf_cnpj, nome, email, telefone, bom_pagador) values
('72362040054', 'Nelson Murilo de Paula', 'nelson_depaula@cruiser.com.br', '92986228155', true),
('20427584000193', 'Mariah e Erick Construções ME', 'financeiro@mariaheerickconstrucoesme.com.br', '47983852664', false),
('27125010000100', 'Mauro Terraplanagem LTDA', 'mauro_te@gmail.com', '47993887685', true),
('56654758072', 'Murilo Lorenzo Araújo', 'murilo_araujo@bseletronicos.com.br', '47992969822', false),
('34041932000102', 'Chama Entulho LTDA', 'financeiro@chamaentulho.com', '47994766857', true);

insert into veiculo(marca, modelo, placa, numero_chassis, fk_cliente_cpf_cnpj) values
('Volkswagen', 'Constellation 15-190', 'MEE-5754', null, '72362040054'),
('Mercedes-Benz', 'Actros Evolution 2045 4x2', 'MCP2A85', null, '27125010000100'),
('Caterpillar', '416f2', null, '9BRFJDDNY3X257862', '27125010000100'),
('Volvo', 'FH-540 Globetrotter 6x4', 'MTD4R97', null, '34041932000102'),
('Scania', 'Super R460 4x2', 'KHV-6048', null, '20427584000193');

insert into orcamento("data", status, desconto, pago, valor_total, fk_Veiculo_Id) values
('2025-10-24', 'Terminado', 30.50, false, 1380.50, (select id from veiculo where numero_chassis = '9BRFJDDNY3X257862')),
('2025-11-24', 'Em andamento', 0.0, true, 455.00, (select id from veiculo where placa = 'MTD4R97'));