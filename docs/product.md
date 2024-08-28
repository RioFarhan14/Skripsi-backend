# Product API Spec

## Get Products API

Headers :

- Authorization : token

## Get AllProducts API

Endpoint : GET /api/users/products

Response Body Success :

```json
{
  "data": {
    "product_id": "01",
    "product_name": "Lapangan A",
    "product_type": "field",
    "price": "110000",
    "image_url": "www.image.com/01",
    "description": ".............."
  }
}
```

Response Body Error :

```json
{
  "errors": "silahkan login terlebih dahulu"
}
```

### Get ProductById API

Endpoint : GET /api/users/products

Request Body :

```json
{
  "product_id": "01"
}
```

Response Body Success :

```json
{
  "data": {
    "product_id": "01",
    "product_name": "Lapangan A",
    "price": "110000",
    "image_url": "www.image.com/lapanganA",
    "description": "......................"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

### Get AllField API

Endpoint : GET /api/users/products/field

Response Body Success :

```json
{
  "data": {
    "product_id": "01",
    "product_name": "Lapangan A",
    "price": "110000",
    "image_url": "www.image.com/lapanganA",
    "description": "......................"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

### Get AllMembership API

Endpoint : GET /api/users/products/membership

Response Body Success :

```json
{
  "data": {
    "product_id": "02",
    "product_name": "1 Bulan",
    "price": "100000",
    "image_url": "www.image.com/membership"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

## Create Products API

Headers :

- Authorization : token

Endpoint : PATCH /api/users/products

Request Body :

```json
{
  "product_name": "Lapangan B",
  "product_type": "field",
  "price": "110000",
  "image_url": "www.image.com/02",
  "description": "................" // Optional
}
```

Response Body Success :

```json
{
  "data": {
    "product_id": "02",
    "product_name": "Lapangan B",
    "product_type": "field",
    "price": "110000",
    "image_url": "www.image.com/02",
    "description": "................"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

## Update Products API

Headers :

- Authorization : token

Endpoint : PATH /api/users/products

Request Body :

```json
{
  "product_name": "Lapangan C", // Optional
  "product_type": "field", // Optional
  "price": "110000", // Optional
  "image_url": "www.image.com/03", // Optional
  "description": "................" // Optional
}
```

Response Body Success :

```json
{
  "data": {
    "product_id": "02",
    "product_name": "Lapangan C",
    "product_type": "field",
    "price": "110000",
    "image_url": "www.image.com/03",
    "description": "................"
  }
}
```

Response Body Error :

```json
{
  "errors": "Silahkan login terlebih dahulu"
}
```

## Delete Product API

Headers :

- Authorization : token

Endpoint : DELETE /api/users/products

Request Body :

```json
{
  "product_id": "02"
}
```

Response Body Success :

```json
{
  "success": "data berhasil dihapus"
}
```
