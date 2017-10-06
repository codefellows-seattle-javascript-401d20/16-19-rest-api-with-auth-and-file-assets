![cf](https://i.imgur.com/7v5ASc8.png) Lab 13: Express and Mongo two resoruce REST API
======


#### Server Endpoints
* `POST /<resource-name>`
  * pass a request with a resource.
    * For an account, resource should have at least a username, email, and password.
    * For a profile, resource should have at least a username, email, and account.
    * For a sound, resource should have at least a title, url, and account.
  * if all required fields are present, respond with a 200 success code and an authentication token
  * if not all required fields are present, respond with a 400 status code
  * for an account, if a request is made for a duplicate of a unique key, respond with a 409 status code
  * for a profile or sound, if a request is made with a bad token or lack of token, respond with a 401 status code
* `GET /login` and `GET /<resource-name>?id={id}`
  * pass a request with /login for account, or a /<resource-name> path with an id for a profile or sound
    * for /login, use authentication middleware to log in a user
      * if the login succeeds, respond with a 200 success code
      * if the login is missing authentication, respond with a 400 status code
      * if the login's authentication includes a bad password or bad account, respond with a 401 status code
    * for profile or sound, pass a bearer authentication token in the request to authorize the creation of the resource
      * on success, respond with a 200 status code and an authentication token
      * on failure due to a bad id, send a 404 status code
      * on failure due to bad token or lack of token, respond with a 401 status code
* `DELETE /api/<resource-name?id={id}>`
  *  pass a request with an /api/<resource-name> path for sounds
    * with an existing id in the query string, the program should delete a resource with the given id and return a 204 status code with no content in the body
    *  with a non-existent id in the query string, the program should respond with a 404 status code
    *  with a bad token or lack of token in the query string, the program should respond with a 401 status code
