<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Regras de Negócio

### Reuniões

[X] Devem ser listadas todas as reuniões (futuras e passadas) que pertencem ao BOARD que o usuário faz parte</br>
[X] Deve ser possível optar por listar todas as reuniões canceladas</br>
[X] O usuário só deve conseguir criar uma Reunião caso tenha o perfil de ADMIN em algum BOARD</br>
[X] O botão CRIAR REUNIÃO só deve estar desbloqueado para usuários que fizerem parte de algum BOARD e obterem a permissão de ADMIN</br>
[X] No 1 passo da CRIAÇÃO de uma REUNIÃO, só deve ser possível selecionar um BOARD ao qual o usuário tenha perfil de ADMIN</br>
[X] No 2 passo da CRIAÇÃO de uma REUNIÃO, só devem ser listados os usuários do BOARD selecionado, podendo ser atribuído o permissionamento de ADMIN ou MEMBRO daquela reunião</br>
[X] No 3 passo da CRIAÇÃO de uma REUNIÃO, deve ser possível adicionar os campos Título, Data de Início e Duração da reunião</br>
[X] Ainda No 3 passo da CRIAÇÃO de uma REUNIÃO, deve ser possível adicionar datas de recorrência da mesma reunião</br>
[X] Ainda No 3 passo da CRIAÇÃO de uma REUNIÃO, ao adicionar recorrência da mesma reunião, as reuniões terão nomes sequenciais</br>
[X] Para cada reunião criada, deve ser criada uma pasta automaticamente com o mesmo nome da Reunião dentro da Pasta do Board ao qual ela pertence</br>
[X] O usuário que obter a permissão de Admin de uma reunião, deve poder editar a reunião</br>

### Base de Conhecimento

Pastas Automáticas

[X] As pastas automáticas listadas serão referentes a cada Board criado</br>
[X] O usuário MASTER deve conseguir visualizar as pastas referentes a todos od Boards da empresa, porém devem estar criptografados</br>
[X] O usuário ADMIN/MEMBRO só deve conseguir visualizar as pastas referentes ao Boards que ele estiver</br>
[X] O usuário deve conseguir ver as pastas anteriores ao período que ingressou na empresa</br>
[X] Não deve ser permitido adicionar novas pastas ou arquivos através da Base de conhecimento

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
