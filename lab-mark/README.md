![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) Code-401-Javascript Lab-16-19
===
This is day 16-19 of lab with Code Fellows. The purpose of the labs is to teach students how to use authentication within node in order to be give users authorization to access other API end points.
### How to start server:
In a terminal, navigate to the lab-mark directory and install the required dependencies by typing `npm i`. Refer to the commands below to interact with the software.
* ##### Start the database: `npm run dbon`
* ##### Start the server: `npm run start`
* ##### Close the database: `npm run dboff`
### Making requests:
After the server has been turned on, different requests can be made to it. You can use any tool to accomplish this, we recommend POSTMAN or httpie.
#### Server Endpoints
Create the following routes for performing CRUD opperations on your resourcee
* `POST /signup`
  * Passes data as stringifed JSON in the body of a **POST** request to create a new account
  * On success respond with a 200 status code and a token used to prove authentication
  * On failure due to a bad request send a 400 status code
  * On failure due to duplicate user/emails provided, send a 409 status code
* `GET /login`
  * Passes data as stringifed JSON in the query of a **GET** request to login to an account.
  * On success respond with a 200 status code and a token used to prove authentication
  * On failure due to a bad request send a 400 status code
  * On failure due to an incorrect username, send a 404 status code
  * on failure due to an incorrect password, send a 401 status code
