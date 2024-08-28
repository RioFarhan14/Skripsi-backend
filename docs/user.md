# User API Spec

## Create User API

Endpoint : POST /api/users/create

Headers :

- Authorization : token
- Role : admin

Request Body :

```json
{
  "username": "Farhan",
  "name": "Farhan A",
  "user_phone": "082XXXXXX",
  "role": "admin",
  "password": "*******",
  "confirm_password": "*********"
}
```

Response Body Success :

```json
{
  "data": {
    "user_id": "03",
    "username": "Farhan",
    "name": "Farhan A",
    "user_phone": "082XXXXXX",
    "role": "admin",
    "password": "*******"
  }
}
```

Response Body Error :

```json
{
  "errors": "username sudah terpakai"
}
```

## Update User API

Endpoint : PATH /api/users/update

Headers :

- Authorization : token
- Role : admin

Request Body :

```json
{
  "user_id": "03",
  "username": "Farhan", //Optional
  "name": "Farhan A", //Optional
  "user_phone": "082XXXXXX", //Optional
  "role": "admin", //Optional
  "password": "*******" //Optional
}
```

Response Body Success :

```json
{
  "data": {
    "user_id": "03",
    "username": "Farhan",
    "name": "Farhan A",
    "user_phone": "082XXXXXX",
    "role": "admin",
    "password": "*******"
  }
}
```

Response Body Error :

```json
{
  "errors": "username sudah terpakai"
}
```

## Delete User API

Endpoint : DELETE /api/users/delete

Headers :

- Authorization : token
- Role : admin

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

## Register User API

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "riofarhan",
  "password": "*********",
  "user_phone": "082XXXXXXXX",
  "name": "Rio Farhan Avito"
}
```

Response Body Sucess :

```json
{
  "data": {
    "username": "riofarhan",
    "name": "Rio Farhan Avito"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username sudah terpakai"
}
```

## Get Users API

Endpoint : GET /api/users

Headers :

- Authorization : token
- Role : admin

Response Body Success :

```json
{
  "data": [
    {
      "name": "Rahmat",
      "username": "rahmat01",
      "user_phone": "082XXXXXXX"
    },
    {
      "name": "ali",
      "username": "ali01",
      "user_phone": "082XXXXXXX"
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

## get user data API

Endpoint : GET /api/users/current

header: - token

Response Body :

```json
{
  "data": {
    "name": "Rahmat",
    "username": "rahmat01",
    "user_phone": "082XXXXXXX"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

## Login API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "riofarhan",
  "password": "*********"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "username atau password salah"
}
```

## Update Profile User API

Headers :

- Authorization : token

Endpoint : PATCH /api/users/current

Request Body :

```json
{
  "name": "Rahmat", // Optional
  "username": "rahmat01", // Optional
  "user_phone": "082XXXXXXX", //Optional
  "password": "*********"
}
```

Response Body Success :

```json
{
  "data": {
    "name": "Rahmat",
    "username": "rahmat01",
    "user_phone": "082XXXXXXX"
  }
}
```

Response Body Error :

```json
{
  "errors": "nama tidak boleh lebih dari 50 karakter"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```
