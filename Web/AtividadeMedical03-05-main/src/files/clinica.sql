-- -----------------------------------------------------
-- Schema clinica

-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `clinica`;
USE `clinica` ;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';

FLUSH PRIVILEGES;

Select * from tbl_endereco;
Select * from tbl_pessoa;
Select * from tbl_telefone;
Select * from tbl_pessoa_has_tbl_telefone;
Select * from tbl_login;
Select * from tbl_perfis;
Select * from tbl_funcionario;
Select * from tbl_especialidade;
Select * from tbl_paciente;
Select * from tbl_consulta;
Select * from tbl_prontuario;
Select * from tbl_funcionario_has_tbl_especialidade;


-- -----------------------------------------------------
-- Table `clinica`.`tbl_endereco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_endereco` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `logradouro` VARCHAR(100) NOT NULL,
  `bairro` VARCHAR(45) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `numero` VARCHAR(45) NOT NULL,
  `complemento` VARCHAR(45) NULL,
  `cep` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `clinica`.`tbl_pessoa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_pessoa` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cpf` VARCHAR(11) NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `data_nasc` DATE NOT NULL,
  `genero` VARCHAR(30) NOT NULL,
  `email` VARCHAR(125) NOT NULL,
  `data_cad` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endereco_id` INT NOT NULL,
  PRIMARY KEY (`id`, `endereco_id`),
  CONSTRAINT `fk_tbl_pessoa_tbl_endereco1`
    FOREIGN KEY (`endereco_id`)
    REFERENCES `clinica`.`tbl_endereco` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

select * from tbl_pessoa;

-- -----------------------------------------------------
-- Table `clinica`.`tbl_telefone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_telefone` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `numero` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `clinica`.`tbl_login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_login` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(125) NOT NULL,
  `senha` VARCHAR(500) NOT NULL,
  `status` TINYINT NOT NULL,
  `pessoa_id` INT NOT NULL,
  `pessoa_endereco_id` INT NOT NULL,
  PRIMARY KEY (`id`, `pessoa_id`, `pessoa_endereco_id`),
  CONSTRAINT `fk_tbl_login_tbl_pessoa1`
    FOREIGN KEY (`pessoa_id` , `pessoa_endereco_id`)
    REFERENCES `clinica`.`tbl_pessoa` (`id` , `endereco_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `clinica`.`tbl_perfis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_perfis` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(125) NOT NULL,
  `login_id` INT NOT NULL,
  `login_pessoa_id` INT NOT NULL,
  `login_pessoa_endereco_id` INT NOT NULL,
  PRIMARY KEY (`id`, `login_id`, `login_pessoa_id`, `login_pessoa_endereco_id`),
  CONSTRAINT `fk_tbl_perfis_tbl_login1`
    FOREIGN KEY (`login_id` , `login_pessoa_id` , `login_pessoa_endereco_id`)
    REFERENCES `clinica`.`tbl_login` (`id` , `pessoa_id` , `pessoa_endereco_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `clinica`.`tbl_funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_funcionario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data_admissao` DATE NOT NULL,
  `crm` VARCHAR(12) NOT NULL,
  `pessoa_id` INT NOT NULL,
  `pessoa_endereco_id` INT NOT NULL,
  PRIMARY KEY (`id`, `pessoa_id`, `pessoa_endereco_id`),
  CONSTRAINT `fk_tbl_funcionario_tbl_pessoa1`
    FOREIGN KEY (`pessoa_id` , `pessoa_endereco_id`)
    REFERENCES `clinica`.`tbl_pessoa` (`id` , `endereco_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `clinica`.`tbl_especialidade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_especialidade` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `desc_especialidade` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `clinica`.`tbl_paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_paciente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT NOT NULL,
  PRIMARY KEY (`id`, `pessoa_id`),
  CONSTRAINT `fk_tbl_paciente_tbl_pessoa1`
    FOREIGN KEY (`pessoa_id`)
    REFERENCES `clinica`.`tbl_pessoa` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

select * from tbl_paciente;

-- -----------------------------------------------------
-- Table `clinica`.`tbl_consulta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_consulta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `status` TINYINT NOT NULL,
  `paciente_id` INT NOT NULL,
  `paciente_pessoa_id` INT NOT NULL,
  `funcionario_id` INT NOT NULL,
  `funcionario_pessoa_id` INT NOT NULL,
  PRIMARY KEY (`id`, `paciente_id`, `paciente_pessoa_id`, `funcionario_id`, `funcionario_pessoa_id`),
  CONSTRAINT `fk_tbl_consulta_tbl_paciente1`
    FOREIGN KEY (`paciente_id` , `paciente_pessoa_id`)
    REFERENCES `clinica`.`tbl_paciente` (`id` , `pessoa_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_consulta_tbl_funcionario1`
    FOREIGN KEY (`funcionario_id` , `funcionario_pessoa_id`)
    REFERENCES `clinica`.`tbl_funcionario` (`id` , `pessoa_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `clinica`.`tbl_prontuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_prontuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `diagnostico` VARCHAR(1000) NOT NULL,
  `medicacao` VARCHAR(300) NOT NULL,
  `especialidade_id` INT NOT NULL,
  `consulta_id` INT NOT NULL,
  `consulta_paciente_id` INT NOT NULL,
  `consulta_paciente_pessoa_id` INT NOT NULL,
  `consulta_funcionario_id` INT NOT NULL,
  `consulta_funcionario_pessoa_id` INT NOT NULL,
  PRIMARY KEY (`id`, `especialidade_id`, `consulta_id`, `consulta_paciente_id`, `consulta_paciente_pessoa_id`, `consulta_funcionario_id`, `consulta_funcionario_pessoa_id`),
  CONSTRAINT `fk_tbl_prontuario_tbl_especialidade1`
    FOREIGN KEY (`especialidade_id`)
    REFERENCES `clinica`.`tbl_especialidade` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_prontuario_tbl_consulta1`
    FOREIGN KEY (`consulta_id` , `consulta_paciente_id` , `consulta_paciente_pessoa_id` , `consulta_funcionario_id` , `consulta_funcionario_pessoa_id`)
    REFERENCES `clinica`.`tbl_consulta` (`id` , `paciente_id` , `paciente_pessoa_id` , `funcionario_id` , `funcionario_pessoa_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `clinica`.`tbl_pessoa_has_tbl_telefone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_pessoa_has_tbl_telefone` (
  `pessoa_id` INT NOT NULL,
  `telefone_id` INT NOT NULL,
  `pessoa_tbl_endereco_id` INT NOT NULL,
  PRIMARY KEY (`pessoa_id`, `telefone_id`, `pessoa_tbl_endereco_id`),
  CONSTRAINT `fk_tbl_pessoa_has_tbl_telefone_tbl_pessoa1`
    FOREIGN KEY (`pessoa_id` , `pessoa_tbl_endereco_id`)
    REFERENCES `clinica`.`tbl_pessoa` (`id` , `endereco_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_pessoa_has_tbl_telefone_tbl_telefone1`
    FOREIGN KEY (`telefone_id`)
    REFERENCES `clinica`.`tbl_telefone` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



-- -----------------------------------------------------
-- Table `clinica`.`tbl_funcionario_has_tbl_especialidade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica`.`tbl_funcionario_has_tbl_especialidade` (
  `funcionario_id` INT NOT NULL,
  `funcionario_pessoa_id` INT NOT NULL,
  `funcionario_pessoa_endereco_id` INT NOT NULL,
  `especialidade_id` INT NOT NULL,
  PRIMARY KEY (`funcionario_id`, `funcionario_pessoa_id`, `funcionario_pessoa_endereco_id`, `especialidade_id`),
  CONSTRAINT `fk_tbl_funcionario_has_tbl_especialidade_tbl_funcionario1`
    FOREIGN KEY (`funcionario_id` , `funcionario_pessoa_id` , `funcionario_pessoa_endereco_id`)
    REFERENCES `clinica`.`tbl_funcionario` (`id` , `pessoa_id` , `pessoa_endereco_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tbl_funcionario_has_tbl_especialidade_tbl_especialidade1`
    FOREIGN KEY (`especialidade_id`)
    REFERENCES `clinica`.`tbl_especialidade` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
    
SELECT tbl_paciente.id AS paciente_id, tbl_pessoa.nome AS paciente_nome
FROM tbl_paciente
INNER JOIN tbl_pessoa ON tbl_paciente.pessoa_id = tbl_pessoa.id;

SELECT tbl_funcionario.id AS funcionario_id, tbl_pessoa.nome AS funcionario_nome
FROM tbl_funcionario
INNER JOIN tbl_pessoa ON tbl_funcionario.pessoa_id = tbl_pessoa.id;

SELECT tbl_funcionario.id AS funcionario_id, tbl_pessoa.nome AS funcionario_nome
FROM tbl_funcionario
INNER JOIN tbl_pessoa ON tbl_funcionario.pessoa_id = tbl_pessoa.id
INNER JOIN tbl_perfis ON tbl_perfis.login_pessoa_id = tbl_pessoa.id
WHERE tbl_perfis.tipo = 'medico';



insert into tbl_especialidade (desc_especialidade) value
('Cardiologia'),
('Clínico Geral'), 
('Nutricionista'), 
('Ginecologista'), 
('Ortopedista'),
('Pneumologista');





SELECT 
                tbl_paciente.id AS paciente_id, 
                tbl_paciente.pessoa_id AS paciente_pessoa_id, 
                tbl_funcionario.id AS funcionario_id, 
                tbl_funcionario.pessoa_id AS funcionario_pessoa_id
            FROM 
                tbl_paciente
            INNER JOIN 
                tbl_pessoa AS paciente_pessoa ON tbl_paciente.pessoa_id = paciente_pessoa.id
            INNER JOIN 
                tbl_funcionario ON tbl_funcionario.pessoa_id = paciente_pessoa.id
            INNER JOIN 
                tbl_pessoa AS funcionario_pessoa ON tbl_funcionario.pessoa_id = funcionario_pessoa.id
            WHERE 
                tbl_funcionario.id = 3;
