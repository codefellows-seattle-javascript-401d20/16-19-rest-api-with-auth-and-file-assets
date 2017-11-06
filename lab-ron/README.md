# Imagr application

## About

This is Imagr, a image serving api to store pictures online

## Set up

This application requires **NodeJS** and **MongoDB**. If you don't have them, please click below to download them:

- [Download NodeJS](https://nodejs.org)
- [Download MongoDB](https://www.mongodb.com/download-center#community)

You are also expected to have an AWS Account with an S3 bucket

-[Get an AWS Account](https://aws.amazon.com/)

### Dependencies

The `package.json` already contain most of the dependencies needed to run your application. 
Make sure to install them by running `npm i`.

### Environment Variables

The application also requires some environment variables to run. You will need a port number, a path to the mongo url url, and a cors variable, as well as your AWS Credentials

* Create a `.env` file to hold your variables.
```
PORT=3000
CORS_ORIGIN=http://localhost:8080
MONGODB_URI=mongodb://localhost/dev
IMAGR_SECRET=some string to help with the salt
AWS_BUCKET=imagrproject
AWS_ACCESS_KEY_ID=YourAWSKeyId
AWS_SECRET_ACCESS_KEY=YourAWSSecret
```
> *NOTE:* Always remember to keep your environment variables safe. Never put your environment variable on your git repository.

### Starting and Stopping the Server

- To start the database and server, run the following command `npm run dbon && npm run start`.
- run `npm start` to start the application.
- To stop the database run `npm run dboff`.

# Api

## Authorization

### POST /signup
### GET /login

## Profiles
### POST /profiles
### GET /profiles/id
### GET /profiles

 ## Images
 ### POST /images/id
 ### GET /images/id
 ### DELETE /images/id