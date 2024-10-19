# Teste técnico para Mlabs - API para um estacionamento

## Antes de tudo

**Muito obrigado pela oportunidade! fiz o melhor que pude mas estou sempre disposto a aprender mais e melhorar**

e alias, subi uma imagem docker pra facilitar o teste pra vocês

```bash
# expoe a porta 3000 e precisa de um DATABASE_URL ( url para um banco mongodb )

# https://hub.docker.com/repository/docker/parkournick3/mlabs-teste-tecnico/general

parkournick3/mlabs-teste-tecnico:latest
```

## Funcionalidades

- Registrar entrada de um veículo
- Registrar saída de um veículo
- Pagar uma reserva de estacionamento
- Historico de reservas de estacionamento por placa

## Mudanças que tomei a iniciativa de fazer diferente do que foi orientado no teste

### Rotas

Mudei de `/parking` para `/parking-reservation`, me ajudou a entender melhor e a construir o sistema, fiz ele pensando num usuário que ficaria em um guichê registrando a entrada de um veiculo no patio de um estacionamento ( `post /parking-reservation` ), registrando a saida do veiculo ( `patch /parking-reservation/:id/leave` ), registrando o pagamento, consultando o historico de reservas pela placa do veiculo... na minha cabeça faz mais sentido ser um CRUD de **"reservas de estacionamento"**, faz sentido?

### Verbos HTTP

Alterei as rotas com `PUT` para `PATCH`, achei que fazia mais sentido ser `PATCH` já que as rotas alteram apenas alguns campos do `parking-reservation`

### ID

Preferi manter o padrão de `ObjectId` do MongoDB ao invés de seguir um id sequencial.

### Lembrete

Queria ressaltar que não faria nenhuma dessas alterações sem alinhar com o time antes.

## Rotas

### Registrar entrada do veiculo

```
POST /parking-reservation

{ plate: 'FAA-1234' }

```

### Registrar saida do veiculo

```
PATCH /parking-reservation/:id/leave
```

### Registrar o pagamento

```
PATCH /parking-reservation/:id/pay
```

### Consultar historico por placa

```
GET /parking-reservation/:plate
[
  { _id: "6713ae1f3315751c59a673f0", time: '25 minutes', paid: true, left: false }
]
```

## Como rodar

[Guia de como rodar](INSTALL.md)

## Testes

_lembre-se de rodar o projeto localmente e um banco mongodb configurado localmente para os testes, crie um arquivo .env a partir do .env.example_

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
