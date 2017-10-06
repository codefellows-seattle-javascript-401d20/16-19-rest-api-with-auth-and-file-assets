##  Lab 16-19 - Stuart

## About
This is an authentication / authorization router example. Users can signup for an account, and then store a list of their favorite sandwiches to that account. Sandwiches can have images associated with them via a separate route.

Authorization and Authentication are handled via Basic and Bearer Auth.

## Routes:

### `/signup`
#### POST: Required: `email` (unique), `username` (unique), and `password` string values.

### `/login`
#### GET: Requires username and password for Basic Auth.

### `/sandwiches`
#### POST: Required: `title` (unique), `bread`. Optional: `cheese`, `spread`, `veggies`.

### `/sandwiches/:id`
#### GET: Requires valid ID in URL.

### `/images`
#### POST: Required: `title` (unique).

### `/images/:id`
#### GET: Requires valid ID in URL.

### `/images/:id`
#### DELETE: Requires valid ID in URL.

## Testing
`npm test` from root /.
