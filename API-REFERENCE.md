# API Reference

This document provides an overview of the available API endpoints in the Rating App.

## Base URL

Production: `https://rating-api-fvz9.onrender.com`
Development: `http://localhost:8000`

## Authentication

Most endpoints require authentication using JWT tokens.

### Obtaining a Token

```
POST /auth/token
Content-Type: application/x-www-form-urlencoded
```

**Parameters:**
- `username`: User email address
- `password`: User password

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

### Using a Token

Include the token in the Authorization header:
```
Authorization: Bearer eyJhbGci...
```

## Endpoints

### Users

#### List Users (Admin Only)
```
GET /users
```

#### Get User
```
GET /users/{user_id}
```

#### Create User (Admin Only)
```
POST /users
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Update User (Admin or Self)
```
PUT /users/{user_id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Delete User (Admin Only)
```
DELETE /users/{user_id}
```

### Items

#### List Items
```
GET /items
```

**Query Parameters:**
- `category_id` (optional): Filter by category
- `tags` (optional): Filter by tags

#### Get Item
```
GET /items/{item_id}
```

#### Create Item (Admin Only)
```
POST /items
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Item Name",
  "description": "Item Description",
  "image_url": "https://example.com/image.jpg",
  "category_ids": [1, 2],
  "tags": ["tag1", "tag2"]
}
```

#### Update Item (Admin Only)
```
PUT /items/{item_id}
Content-Type: application/json
```

#### Delete Item (Admin Only)
```
DELETE /items/{item_id}
```

### Ratings

#### List Ratings
```
GET /ratings
```

#### Create Rating
```
POST /ratings
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": 4.5,
  "comment": "Great item!",
  "user_id": 1,
  "item_id": 1
}
```

#### Get Rating
```
GET /ratings/{rating_id}
```

#### Update Rating
```
PUT /ratings/{rating_id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": 5.0,
  "comment": "Updated comment"
}
```

#### Delete Rating
```
DELETE /ratings/{rating_id}
```

### Categories

#### List Categories
```
GET /categories
```

#### Create Category (Admin Only)
```
POST /categories
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Category Description"
}
```

#### Get Category
```
GET /categories/{category_id}
```

#### Update Category (Admin Only)
```
PUT /categories/{category_id}
Content-Type: application/json
```

#### Delete Category (Admin Only)
```
DELETE /categories/{category_id}
```

### Tags

#### List Tags
```
GET /tags
```

For complete API documentation with all parameters and response details, refer to the OpenAPI specification at `/docs` or `/redoc` endpoints of the running API server.
