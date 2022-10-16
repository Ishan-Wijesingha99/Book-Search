// need to import this for apollo-server-express
const { ApolloServer } = require('apollo-server-express')

// need to import typeDefs and resolvers
const resolvers = require('./schemas/resolvers')
const typeDefs = require('./schemas/typeDefs')

// import authMiddleware function/context
const { authMiddleware } = require('./utils/auth')

// import express
const express = require('express');

// import built-in path module
const path = require('path');

// import mongoose/mongoDB connection
const db = require('./config/connection');

// create express app
const app = express();

// create variable to store port, if application is running on local device, it will be 3001, if it is running on heroku, it will be process.env.PORT
const PORT = process.env.PORT || 3001;

// express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// for all get request routes, render index.html from build folder
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// create apollo server with typeDefs, resolvers and authMiddleware context 
const server = new ApolloServer({ typeDefs, resolvers, context: authMiddleware })

// apply the apollo middleware
server.applyMiddleware({ app })

// once the mongoose/mongoDB connection is made, listen on the port and log message to console
db.once('open', () => app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`)))