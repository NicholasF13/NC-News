# Northcoders News API

## Description

The Northcoders News API is a backend service that grants access to the application data, designed to mimic real-world platforms such as Reddit. This API was built using PostgreSQL and Node.js with node-postgres. 

This API allows users to interact with various endpoints. At the most basic level, these endpoints retrieve information about topics, users, articles & comments. There are also further endpoints that perform specific actions such as adding comments, updating artilces and deleting comments. The API also includes comment counts in article responses which makes it a versatile tool for both end-users and developers.

## Link to hosted version

https://nc-news-mrwy.onrender.com

## Installation


1. Clone this repository: https://github.com/NicholasF13/NC-News

2. Make sure you are in the project directory, then run the following command:

```
npm install
```

## Database Setup

### Create two new .env files for the project.

1. Make a file called: .env.developement with the following contents: PGDATABASE=nc_news

2. Make a file called: .env.test with the following contents: PGDATABASE=nc_news_test

### Create and seed the local database

This can be done using the following commands:

```
npm run setup-dbs
npm run seed
```

To run the tests for the express application, use the following command:

```
npm t app
```

## Minimum Requirements

Node.js >= v20.5.1
Postgres >= 8.8.0