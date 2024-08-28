# Transaction API Spec

Headers :

- Authorization : token

## Get AllTransaction API

Endpoint : GET /api/users/transaction

Response Body Success :

```json
{
  "data": {
    "transaction_id": "01",
    "product_name": "Lapangan A",
    "product_type": "field",
    "status": "Berhasil",
    "payment_method": "Gopay",
    "total_amount": "100000",
    "transaction_date": "2024-04-02"
  }
}
```

Response Body Error:

```json
{
  "errors": "Silahkan Login terlebih dahulu"
}
```

## Get Transaction Users API

Endpoint : GET /api/users/current/transaction

Response Body Success :

```json
{
  "data": {
    "transaction_id": "01",
    "product_name": "Lapangan A",
    "product_type": "field",
    "status": "Berhasil",
    "payment_method": "Gopay",
    "total_amount": "100000",
    "transaction_date": "2024-04-02"
  }
}
```

Response Body Error:

```json
{
  "errors": "Silahkan Login terlebih dahulu"
}
```

## Create Transaction API

Endpoint : POST /api/users/transaction

Request Body :

```json
{
  "data": {
    "user_id": "00101133",
    "product_id": "01",
    "quantity": "1", // jika membership
    "booking_date": "2024-04-04", // jika booking lapangan
    "start-time": "18:00", // jika booking lapangan
    "duration": "1" // jika booking lapangan
  }
}
```

Response Body Success :

```json
{
  "data": {
    "token": "21432vbewjoewwfpjww"
  }
}
```

## Update Transaction API

Endpoint : PATH /api/users/transaction

Request Body :

```json
{
  "data": {
    "transaction_id": "01",
    "product_name": "Lapangan A", //Optional
    "product_type": "field", //Optional
    "status": "Berhasil", //Optional
    "payment_method": "Gopay", //Optional
    "total_amount": "100000", //Optional
    "transaction_date": "2024-04-02" //Optional
  }
}
```

Response Body Success :

```json
{
  "data": {
    "transaction_id": "01",
    "product_name": "Lapangan A",
    "product_type": "field",
    "status": "Berhasil",
    "payment_method": "Gopay",
    "total_amount": "100000",
    "transaction_date": "2024-04-02"
  }
}
```

Response Body Error:

```json
{
  "errors": "Silahkan Login terlebih dahulu"
}
```

## Delete Transaction API

Endpoint : PATH /api/users/transaction

Request Body :

```json
{
  "transaction_id": "01"
}
```

Response Body Success :

```json
{
  "info": "Transaksi berhasil dihapus"
}
```

Response Body Error :

```json
{
  "errors": "ID tidak ditemukan"
}
```
