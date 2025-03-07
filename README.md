# API de Reserva de Serviços - Guia de Uso no Insomnia

Este guia explica como testar a API usando o Insomnia.

## Configuração Inicial

1. Abra o Insomnia
2. Crie uma nova Coleção
3. Configure uma variável de ambiente chamada `token` para armazenar o token JWT

## Endpoints Disponíveis

### 1. Cadastro de Usuário
- Método: `POST`
- URL: `http://localhost:3000/api/users`
- body (JSON):
```json
{
  "fullName": "João Silva",
  "nif": "123456789",
  "email": "joao@exemplo.com",
  "password": "123456",
  "userType": "client"
}
```

### 2. Login
- Método: `POST`
- URL: `http://localhost:3000/api/login`
- body (JSON):
```json
{
  "email": "joao@exemplo.com",
  "password": "123456"
}
```

Após o login, você receberá um token JWT. Configure este token na variável de ambiente `token` do Insomnia.

### 3. Criar Serviço (Apenas Prestadores)
- Método: `POST`
- URL: `http://localhost:3000/api/services`
- Autenticação: Bearer Token (usar `{{token}}`)
- body (JSON):
```json
{
  "name": "Corte de Cabelo",
  "description": "Serviço profissional de corte de cabelo",
  "price": 50.00
}
```

### 4. Listar Serviços
- Método: `GET`
- URL: `http://localhost:3000/api/services`
- Autenticação: Bearer Token (usar `{{token}}`)

### 5. Criar Reserva (Apenas Clientes)
- Método: `POST`
- URL: `http://localhost:3000/api/bookings`
- Autenticação: Bearer Token (usar `{{token}}`)
- body (JSON):
```json
{
  "serviceId": 1,
  "bookingDate": "2024-03-20T10:00:00Z"
}
```

### 6. Listar Reservas
- Método: `GET`
- URL: `http://localhost:3000/api/bookings`
- Autenticação: Bearer Token (usar `{{token}}`)

### 7. Cancelar Reserva
- Método: `PUT`
- URL: `http://localhost:3000/api/bookings/1/cancel`
- Autenticação: Bearer Token (usar `{{token}}`)

## Fluxo de Teste

1. Primeiro, cadastre dois usuários:
   - Um como cliente
   - Um como prestador de serviço

2. Faça login com a conta do prestador e crie alguns serviços

3. Faça login com a conta do cliente e:
   - Visualize os serviços disponíveis
   - Crie reservas
   - Visualize as reservas
   - Tente cancelar uma reserva

## Lembretes Importantes
- Mantenha o token JWT atualizado após o login
- Configure o cabeçalho de Autorização para rotas protegidas
- Verifique os códigos de status e mensagens das respostas
