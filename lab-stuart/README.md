##  Lab 16 - Lab Stuart

## About
This is an authentication / authorization router example. Users can signup for an account, and then store a list of their favorite sandwiches to that account.

## Methods:
- `/signup`
POST route. Required: `email` (unique), `username` (unique), and `password` string values. 
- `/sandwiches`
POST route. Required: `title` (unique), `bread`. Optional: `cheese`, `spread`, `veggies`.

## Testing
`npm test` from root /.