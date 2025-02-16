# User Registration Endpoint Documentation

## Endpoint: `/user/register`

### Description

This endpoint allows new users to register on the platform. It requires user details such as name, email, and password to create a new account.

### Request Body

The request body should be in JSON format and contain the following fields:

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

- `fullname.firstname`: User's first name (string). Must be at least 3 characters long.
- `fullname.lastname`: User's last name (string). Optional but must be at least 3 characters long if provided.
- `email`: User's email address (string). Must be a valid email format.
- `password`: User's password (string). Should be at least 6 characters long.

### Status Codes

- **201 Created**: Successfully created a new user account.
- **400 Bad Request**: The request body is invalid or missing required fields. The response body will contain details about the validation errors.
- **409 Conflict**: An account with the given email address already exists.
- **500 Internal Server Error**: An unexpected error occurred on the server.

### Example Success Response

```json
{
  "token": "jwtToken",
  "user": {
    "_id": "uniqueUserId",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Example Error Response

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

# User Login Endpoint Documentation

## Endpoint: `/user/login`

### Description

This endpoint allows existing users to log in to the platform. It requires the user's email and password to authenticate.

### Request Body

The request body should be in JSON format and contain the following fields:

```json
{
  "email": "string",
  "password": "string"
}
```

- `email`: User's email address (string). Must be a valid email format.
- `password`: User's password (string). Should be at least 6 characters long.

### Status Codes

- **200 OK**: Successfully authenticated the user.
- **400 Bad Request**: The request body is invalid or missing required fields. The response body will contain details about the validation errors.
- **401 Unauthorized**: The email or password is incorrect.
- **500 Internal Server Error**: An unexpected error occurred on the server.

### Example Success Response

```json
{
  "token": "jwtToken",
  "user": {
    "_id": "uniqueUserId",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Example Error Response

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

# User Profile Endpoint Documentation

## Endpoint: `/user/profile`

### Description

This endpoint allows authenticated users to retrieve their profile information.

### Request Headers

The request must include a valid JWT token in the `Authorization` header.

```http
Authorization: Bearer <jwtToken>
```

### Status Codes

- **200 OK**: Successfully retrieved the user's profile information.
- **401 Unauthorized**: The user is not authenticated or the token is invalid.
- **500 Internal Server Error**: An unexpected error occurred on the server.

### Example Success Response

```json
{
  "_id": "uniqueUserId",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

### Example Error Response

```json
{
  "msg": "Unauthorized"
}
```

# User Logout Endpoint Documentation

## Endpoint: `/user/logout`

### Description

This endpoint allows authenticated users to log out by invalidating their JWT token.

### Request Headers

The request must include a valid JWT token in the `Authorization` header or as a cookie.

```http
Authorization: Bearer <jwtToken>
```

### Status Codes

- **200 OK**: Successfully logged out the user.
- **401 Unauthorized**: The user is not authenticated or the token is invalid.
- **500 Internal Server Error**: An unexpected error occurred on the server.

### Example Success Response

```json
{
  "msg": "Logged out successfully"
}
```

### Example Error Response

```json
{
  "msg": "Unauthorized"
}
```