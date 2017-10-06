![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) Code-401-Javascript Lab-16-19
===
This is day 16-19 of lab with Code Fellows. The purpose of the labs is to teach students how to use authentication within node in order to be give users authorization to access other API end points. The lab also covered how to deploy and use .travis.yml to utilize continous integration with github repositories.
### How to start server:
In a terminal, navigate to the lab-mark directory and install the required dependencies by typing `npm i`. Refer to the commands below to interact with the software.
* ##### Start the database: `npm run dbon`
* ##### Start the server: `npm run start`
* ##### Close the database: `npm run dboff`
### Making requests:
After the server has been turned on, different requests can be made to it. You can use any tool to accomplish this, we recommend POSTMAN or httpie.
#### Server Endpoints
Routes for performing CRUD operations on each resource
#### Authentication
* `POST /signup`
  * Passes data as stringifed JSON in the body of a **POST** request to create a new account
  * On success respond with a 200 status code and a token used to prove authentication
  * On failure due to a bad request send a 400 status code
  * On failure due to duplicate user/emails provided, send a 409 status code
* `GET /login`
  * Sends a **GET** request to login to an account.
  * On success respond with a 200 status code and a token used to prove authentication
  * On failure due to an incorrect username, send a 404 status code
  * on failure due to an incorrect password, send a 401 status code
#### Profiles
* `POST /profiles`
  * Passes data as stringifed JSON in the body of a **POST** request to create a new profile
  * On success respond with a 200 status code, a token, and the newly created profile
  * On failure due to a bad request send a 400 status code
  * On failure due to providing a bad token, send a 401 status code
* `GET /profiles/:id`
  * Sends a **GET** request to retrieve a certain profile.
  * On success respond with a 200 status code, a token and the profile requested.
  * On failure due to a bad ID, send a 404 status code
  * On failure due to providing a bad token, send a 401 status code
#### Blogs
* `POST /blogs`
  * Passes data as stringifed JSON in the body of a **POST** request to create a new blog
  * On success respond with a 200 status code, a token, and the newly created blog
  * On failure due to a bad request send a 400 status code
  * On failure due to providing a bad token, send a 401 status code
* `GET /blogs/:id`
  * Sends a **GET** request to get a certain blog.
  * On success respond with a 200 status code, a token and the requested blog
  * On failure due to a bad ID, send a 404 status code
  * On failure due to providing a bad token, send a 401 status code
* `GET /blogs`
  * Sends a a **GET** request to get all the blogs
  * On success respond with a 200 status code, a token, and all the blogs
  * On failure due to providing a bad token, send a 401 status code
* `DELETE /blogs/:id`
  * Sends a **DELETE** request to delete a certain blog.
  * On success respond with a 200 status code and a token used to prove authentication
  * On failure due to a bad ID, send a 404 status code
  * On failure due to providing a bad token, send a 401 status code
#### Images
* `POST /images`
  * Passes data as stringifed JSON in the body of a **POST** request to create a new image in the DB and store in S3
  * On success respond with a 200 status code, a token, a url to the publicly-accessible image
  * On failure due to a bad request send a 400 status code
  * On failure due to providing a bad token, send a 401 status code
* `GET /images/:id`
  * Sends a **GET** request to get a certain image's url stored in the DB.
  * On success respond with a 200 status code, a token and the image's url
  * On failure due to a bad ID, send a 404 status code
  * On failure due to providing a bad token, send a 401 status code
* `DELETE /images/:id`
  * Sends a **DELETE** request to delete a certain image from S3 and the DB.
  * On success respond with a 204 status code and a token
  * On failure due to a bad ID, send a 404 status code
  * On failure due to providing a bad token, send a 401 status code
