# Help Information API

## Create Help Information API

Headers :

- Authorization : token
- Role : admin

Endpoint : Create /api/users/help

Request Body :

```json
{
  "title": "Perlindungan data",
  "message": ".........."
}
```

Response Body Success :

```json
{
  "data": {
    "help_id": "01",
    "title": "Perlindungan data",
    "message": "............."
  }
}
```

## Get Help Information API

Headers :

- Authorization : token
- Role : admin

Endpoint : GET /api/users/help

Response Body Success :

```json
{
  "data": {
    "help_id": "01",
    "title": "Perlindungan data",
    "message": "............."
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

## Update Help Information API

Headers :

- Authorization : token
- Role : admin

Endpoint : PATH /api/users/help

Request Body :

```json
{
  "help_id": "01",
  "title": "Perlindungan data", // Optional
  "message": "............." //Optional
}
```

Response Body Success :

```json
{
  "data": {
    "help_id": "01",
    "title": "Perlindungan data",
    "message": "............."
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

## Delete Help Information API

Headers :

- Authorization : token
- Role : admin

Endpoint : DELETE /api/users/help

Request Body :

```json
{
  "help_id": "01"
}
```

Response Body Success :

```json
{
  "info": "Berhasil Dihapus"
}
```

Response Body Error :

```json
{
  "errors": "ID tidak ditemukan"
}
```
