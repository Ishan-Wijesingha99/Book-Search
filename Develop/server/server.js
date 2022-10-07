
// need to import this for apollo-server-express
const { ApolloServer } = require('apollo-server-express')

// need to import typeDefs and resolvers
const { resolvers, typeDefs } = require('./schemas/index')

const express = require('express');

const path = require('path');

const db = require('./config/connection');

const routes = require('./routes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

// create apollo server with typeDefs and resolvers 
const server = new ApolloServer({ typeDefs, resolvers })

// apply the apollo middleware
server.applyMiddleware({ app })

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
