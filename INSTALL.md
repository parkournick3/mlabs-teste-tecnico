## Requisitos

### Para rodar com Docker

- Docker
- MongoDB 8

### Para rodar com Docker Compose

- Docker
- Docker Compose

### Para rodar localmente

- NodeJs 20
- MongoDB 8
- Npm 10

## Como rodar

### Docker

_lembre-se de ter um banco MongoDB rodando localmente_

```bash
# change DATABASE_URL
$ docker run -p 3000:3000 -e DATABASE_URL=mongodb://host.docker.internal:27017/parking parkournick3/mlabs-teste-tecnico:latest
```

### Docker Compose

```bash
$ docker compose up
```

### Localmente

_lembre-se de ter um banco MongoDB rodando localmente, crie um .env a partir do .env.example e configure as variaveis_

```bash
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
