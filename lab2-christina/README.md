### REST API using express
__submission_notes__
__this is for lab 16 and 17 only__

#### LAB 16
#### Account

* The`Account` model that keeps track of a username, email, hashed password, and token seed.

#### Server Endpoints
* `POST /signup `
```
Stringified JSON is sent in the body of the post request to create a new account.
```

#### __Testing__

* POST /signup on success returns a 200 success code
* POST /signup on failure responds with a 400 bad request code.

#### LAB 17

[x] BasicAuth
[x] BearerAuth

#### Access controlled resource
* The profile model requires an account to be authenticated

#### Server Endpoints

* GET /login uses BasicAuth middleware to log a user in.
* POST /profiles takes in stringified JSON and uses BearerAuth to authenticate the user.
* responds with 200, 400, and 401

#### __Testing__
* /login tests for 200(success) 400(bad request) & 401(no token) -- Authentication test
* POST /profile tests for 200(success) 400(bad request) & 401(no token)
* GET /profile/:id tests for 200(success & token response) 404(bad id response) & 401(bad token)
