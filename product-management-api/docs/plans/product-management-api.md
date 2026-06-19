# Product Management API

## Specification
- C#
- .NET Core
- .NET Entity Framework Core
- SQLite

## Tables

### `products`

- id: int (unique, auto increment)
- name: text
- status: varchar 10 (active, inactive, deleted)
- created_at: datetime
- updated_at: datetime

## Endpoints

### GET `/api/products`
Query Params
- page (default = 1)
- pageSize (default = 10)
- status (default = active)

Response JSON Success (200)
```
{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "status": "active",
      "created_at": "2011-10-05T14:48:00.000Z",
      "updated_at": null
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalPage": 1,
    "totalItems": 1
  }
}
```

### GET `/api/products/{id}`

Response JSON Success (200)
```
{
  "id": 1,
  "name": "Laptop",
  "status": "active",
  "created_at": "2011-10-05T14:48:00.000Z",
  "updated_at": null
}
```

Response JSON Not Found (404)
```
{
  "error": {
    "code": "not_found"
  }
}
```

### POST `/api/products`

Request Body
```
{
  "name": "Battery",
  "status": "active"
}
```

Response JSON Success (200)
```
{
  "id": 1,
  "name": "Battery",
  "status": "active",
  "created_at": "2011-10-05T14:48:00.000Z",
  "updated_at": null
}
```

Response JSON Bad Request (400)
```
{
  "error": {
    "code": "invalid_form"
  }
}
```

### PATCH `/api/products/{id}`

Request Body
```
{
  "name": "Battery",
  "status": "active"
}
```

Response JSON Success (200)
```
{
  "id": 1,
  "name": "Battery",
  "status": "inactive",
  "created_at": "2011-10-05T14:48:00.000Z",
  "updated_at": "2011-10-05T15:48:00.000Z"
}
```

Response JSON Bad Request (400)
```
{
  "error": {
    "code": "invalid_form"
  }
}
```

### Unknown Error

Response JSON Unknwon Error (500)
```
{
  "error": {
    "code": "unknwon"
  }
}
```
