// import gql statement
const { gql } = require('apollo-server-express')

// create type definitions
const typeDefs = gql`
  # types 
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Auth {
    token: ID
    user: User
  }

  # queries
  type Query {
    me: User
  }

  # inputs
  input bookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
  }

  # mutations
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: bookInput): User
    removeBook(bookId: String!): User
  }
`

// export typeDefs
module.exports = typeDefs 