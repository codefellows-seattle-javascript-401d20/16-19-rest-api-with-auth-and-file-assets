### REST API using express
#### Account
Create a user `Account` model that keeps track of a username, email, hashed password, and token seed. The model should be able to regenorate tokens using json web token.

#### Server Endpoints
* `POST /signup `

## Tests
* POST should test for 200, 400, and 409 (if any keys are unique)
