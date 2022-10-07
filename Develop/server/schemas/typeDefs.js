
import { gql } from 'apollo-server-express'



export const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int!
        savedBooks: [Book!]!
    }

    type Book {
        bookId: ID!
        authors: [String!]!
        description: String!
        title: String!
        image: String!
        link: String!
    }

    type Auth {
        token: String!
        user: User!
    }
    
    type Query {
        me: User!
    }

    type Mutation {
        login(email: String!, password: String!): Auth!
        authUser(username: String!, email: String!, password: String!): Auth!
        savedBook(authArray: [Auth!]!, description: String!, title: String!, bookId: String!, image: String!, link: String!): User!
        removedBook(bookId: ID!): User!
    }
`