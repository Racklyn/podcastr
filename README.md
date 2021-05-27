# podcastr 🎧

<img src="https://user-images.githubusercontent.com/52416026/119211580-5be5ba00-ba89-11eb-9088-7e504830f2e2.png" width="80%">


O **podcastr** é uma aplicação de podcasts elaborada durante a Next Level week 5 (NLW 5), evento gratuito desenvolvido pela **[Rocketseat](https://rocketseat.com.br/)**. A aplicação permite ao usuário ouvir e ver detalhes e informações de alguns podcasts da própria Rocketseat. <br><br>
Como o foco desse projeto foi o desenvolvimento do frontend, os dados consumidos por ele são de uma Rest API 'fake' implementada ao projeto utilizando a biblioteca [json-server](https://www.npmjs.com/package/json-server), que simula uma Rest API a partir de um arquivo JSON, este contendo os dados dos podcasts em questão. Porém, alterando a base de dados e com algumas mudanças no projeto, essa aplicação pode facilmente ser utilizada por qualquer desenvolvedor de podcasts que queira um local onde seus ouvintes possam usufruir de seu conteúdo.

## Features incrementadas ao projeto 🚀️
Decidi levar a aplicação para o próximo nível adicionando algumas funcionalidades ao projeto original, desenvolvido durante a NLW 5. As funcionalidades são:
- Modo noturno
- Pesquisa por título do podcast
- Responsividade

## Tecnologias utilizadas 💻
- React.js
- TypeScript
- Next.js
- Axios
- JSON Server

## Executando projeto localmente ▶

Para executar o projeto em seu computador, clone este repositório, executando na linha de comando:
```shell
# Clonando repositório
$ git clone https://github.com/Racklyn/podcastr

# Entrando no diretório do projeto
$ cd podcastr
```
No diretório do projeto, instale as dependências necessárias com o comando:
```shell
$ yarn init
```
Inicie o projeto:
```shell
$ yarn dev
```
Abra outro terminal no diretório do projeto e inicie também o servidor do json-server (Fake Rest API):

```shell
$ yarn server
```

O projeto será executado em **[localhost:3000](http://localhost:3000/)**.

O servidor do json-server será executado em *[localhost:3333](http://localhost:3333/)*

## Construindo projeto 🛠
A aplicação pode ser colocada em produção com o comando:
```shell
$ yarn build
```

## Sobre 📋

Desenvolvido por **Francisco Racklyn Sotero dos Santos**.
[Acessar linkedin](https://www.linkedin.com/in/racklyn-sotero-6567561b5/)
