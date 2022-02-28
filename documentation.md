
### Api Endpoints

**User**
- **POST** /api/user/signup  ...Register a user...
{
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "interests": array,
    "password": "string"
}
----------------------------------------
- **POST** /api/user/login  ...User login...
{
    "email": "string",
    "password": "string"
}
--------------------------------------
- **GET** /api/user/profile   ...Create jobs... **Note: An header request x-auth-token must be passed**



**Post**
- **POST** /api/post ...Create a post on a feed...**Note: An header request x-auth-token must be passed**
{
    "feedId": "string",
    "message": "string"
}
------------------------------
- **GET** /api/post/{feedId}  ...Get post on a feed...**Note: An header request x-auth-token must be passed**

You can get x-auth-token from the token value retured after login.<br />
