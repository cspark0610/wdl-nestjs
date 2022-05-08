### DOCUMENTACION

La documentacion de como utilizar la api se encuentra en el archivo documentation.requests.http

### WORDLE - BACKEND - DD3

Requerimientos:
Se necesitan N servicios que permitan darle interacción a la aplicación WORDLE

1. Tener almacenado un diccionario de palabras
2. Deberá seleccionar del diccionario una palabra de 5 letras cada 5 minutos y no se
   deberá repetir la palabra.
3. Permitirá comparar cada letra entre dos palabras(la que ingresa el usuario y la
   seleccionada). La palabra del usuario debe contener 5 letras. Se regresarán los siguientes estatus por letra:
   a. Si la letra ingresada está en el mismo lugar, regresará un 1 y sumará 1 intento al usuario
   b. Si la letra ingresada está en la palabra pero no en el mismo lugar, regresará la letra con un 2 y sumará 1 intento al usuario
   c. Si la letra ingresada no se encuentra en la palabra, regresará la letra con un 3 y sumará 1 intento al usuario
   d. Si acertó en todas las letras, deberá guardar que el usuario acertó la palabra
4. Un usuario solo tiene 5 intentos para evaluar la palabra
5. Cada 5 minutos se seleccionará una nueva palabra, no se deberá repetir la palabra
6. Cada vez que se genera una nueva palabra, el contador de intentos se reinicia a 0
   para todos los usuarios
7. Permitirá obtener cuantas partidas a jugado un usuario y cuantas victorias ha tenido
8. Permitirá obtener los mejores 10 jugadores con su número de victorias
9. Permitirá obtener las palabras más acertadas
10. Los servicios de la aplicación deberán estar protegidos\*
11. Los servicios deberán contar con test\*

\*Bonuses
Tecnologias recomendadas:
● NodeJS
● Typescript
● Jest
● PostgreSQL
Recursos:
● Diccionario de palabras

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
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
