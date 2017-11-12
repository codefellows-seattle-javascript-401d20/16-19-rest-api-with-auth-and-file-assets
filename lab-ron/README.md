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
The **POST /signup** route takes in a `username`, `email`, and `password` as and returns a `token`

`http://locahost:8080/signup`

```
{
  username: "felixfelicis",  
  email: "felix@felicis.com",
  password "mySecretPassword"
}
```

### GET /login

The **GET /login** route takes in a required `username` and `password` as JSON and returns a `token`

`http://locahost:8080/login`

```
{
  username: "felixfelicis",  
  password "mySecretPassword"
}
```
## Profiles
### POST /profiles
The **POST /profiles** route takes in a `firstName`, `lastName`, `location`, `birthday`, and `bio` with a `Bearer token header` and returns the user's profile

`http://locahost:8080/profiles`

```
{
  firstName: "Felix",
  lastName: "Felicis",
  location: "yorkshire",
  birthday: "02/04/1989",
  bio: "I am a lucky guy"
}
```

### GET /profiles/id
The **GET /profiles/id** route takes in an ID and returns the profile

`http://locahost:8080/profiles/89afhj89u2983hfa8`

## Images
### POST /images
The **POST /profiles** route takes in an `url`*(required)*, `title` *(required)*, `description`, `alt`, and `bio` with a `Bearer token header` and returns the a json with an image

`http://locahost:8080/images`

```
  url: "some/url/image.jpg",
  title: "my awesome image",
  description: "this is a really awesome image",
  alt: "image rulez"
```
 
### GET /images/id

The **GET /profiles/id** route takes and `id` and returns the a json with an image

`http://locahost:8080/images/3204938joafu2ojifeu`

### DELETE /images/id

The **POST /profiles** route takes in an `ID` with a `Bearer token header` and returns 204

`http://locahost:8080/images/3204938joafu2ojifeu`