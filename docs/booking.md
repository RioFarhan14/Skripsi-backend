# Booking API Spec

## Bookings API

Headers :

- Authorization : token

### Get AllBooking API

Endpoint : GET /api/users/bookings

Response Body Success :

```json
{
  "data": {
    "user_name": "Rio farhan",
    "start_time": "18:00",
    "end_time": "19:00"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

### Get BookingByDate API

Endpoint : GET /api/users/bookings

Request Body :

```json
{
  "product_id": "01",
  "booking_date": "2024-04-04"
}
```

Response Body Success :

```json
{
  "data": {
    "user_name": "Rio farhan",
    "start_time": "18:00",
    "end_time": "19:00"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

### Get User Booking API

Endpoint : GET /api/users/current/booking

Response Body Success :

```json
{
  "data": {
    "product_id": "01",
    "product_name": "Lapangan A",
    "status": "DiPesan",
    "booking_date": "2024-04-04",
    "start-time": "18:00",
    "end_time": "19:00"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan Login terlebih dahulu"
}
```

## Create Booking API

Headers :

- Authorization : token

Endpoint : POST /api/users/booking

Request Body :

```json
{
  "user_id": "00000000000", // di butuhkan jika role admin
  "product_id": "01",
  "booking_date": "2024-04-04",
  "start-time": "18:00",
  "duration": "1"
}
```

Response Body success :

```json
{
  "data": "Berhasil ditambahkan"
}
```

## Update Booking API

Headers :

- Authorization : token
- Role : admin or membership : true

  Endpoint : PATH /api/users/booking

Request Body :

```json
{
  "booking_id": "01",
  "product_id": "01", //optional
  "booking_date": "2024-05-05", //Optional
  "start-time": "19:00" // Optional
}
```

Response Body Success :

```json
{
  "data": "Berhasil diubah"
}
```

Response Body Error :

```json
{
  "errors": "waktu yang anda pilih sudah dipesan orang lain"
}
```

### Delete Booking API

Headers:

- Authorization: token
- Role : admin
  Endpoint: DELETE /api/users/booking

Request Body:

```json
{ "data": "Berhasil dihapus" }
```
