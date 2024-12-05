# Projeto de Gerenciamento de Alunos

## Descrição

Este sistema de gerenciamento de alunos possui uma interface de **front-end** construída com **React**, que faz requisições ao **back-end** em **Express**. O **back-end** se conecta a dois bancos de dados:

1. **Banco de dados relacional** na nuvem, hospedado no **Railway** e gerenciado pelo **MySQL Workbench**.
2. **Banco de dados não relacional** **ClickHouse**, que é executado localmente via **Docker** e gerenciado pelo **DBeaver**.

O sistema registra a adição de alunos na interface, enviando dados para o banco de dados relacional, e cria logs de texto armazenados na **Google Cloud Storage**.

## Funcionalidades

- Adicionar, listar e gerenciar alunos através da interface.
- Comunicação entre o front-end (React) e o back-end (Express).
- Armazenamento de dados em dois bancos de dados: **MySQL** (relacional) e **ClickHouse** (não relacional).
- Logs de atividades enviados para o **Google Cloud Storage**.

## Tecnologias Utilizadas

- **Frontend**: React
- **Backend**: Express.js
- **Banco de Dados Relacional**: MySQL (via Railway)
- **Banco de Dados Não Relacional**: ClickHouse (via Docker)
- **Armazenamento de Logs**: Google Cloud Storage

## Como Executar

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/Yorran1234/trabalho-Des.-de-persist-ncia.git
    ```

2. **Instale as dependências do front-end:**

    Navegue até o diretório do front-end e execute:

    ```bash
    cd frontend
    npm install
    ```

3. **Instale as dependências do back-end:**

    Navegue até o diretório do back-end e execute:

    ```bash
    cd backend
    npm install
    ```

4. **Rodando o backend (Express):**

    No diretório do back-end, execute:

    ```bash
    npm start
    ```

5. **Rodando o front-end (React):**

    No diretório do front-end, execute:

    ```bash
    npm start
    ```

6. **Configuração do Docker para ClickHouse:**

    Certifique-se de ter o Docker instalado e execute o container do ClickHouse conforme necessário.

## Configuração de Banco de Dados

1. **MySQL**: Configure o banco de dados relacional usando o **MySQL Workbench**. As credenciais podem ser configuradas no arquivo de ambiente (`.env`) do back-end.
2. **ClickHouse**: O banco de dados ClickHouse deve estar rodando localmente via Docker. O DBeaver é usado para gerenciar este banco de dados.

## Contribuições

Se você deseja contribuir com o projeto, por favor, siga as instruções abaixo:

1. Fork este repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`).
3. Faça o commit das suas alterações (`git commit -am 'Adiciona nova feature'`).
4. Envie para o repositório remoto (`git push origin feature/nome-da-feature`).
5. Crie um pull request.
