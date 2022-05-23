// Import Apollo GraphQL
const { gql } = require("apollo-server-express");

// Setup type definitions
const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    type Book {
        bookId: String!
        authors: [String]
        description: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        # Supports query of one or multiple users
        users(_id: String): [User]

        # A query for the logged in user of "User" type and return only selected fields. 
        me: User
    }

    type Mutation {
        # Create a user with username, email, password all required
        createUser(username: String!, email: String!, password: String!): Auth

        # Login user with the option to enter a username or email and require the password
        login(username: String, email: String, password: String!): Auth

        # Save book to user profile
        saveBook(bookId: String!, authors: [String], description: String!, image: String, link: String, title: String! ): User

        # Delete book from user profile
        deleteBook(bookId: String!): User
    }
`;

module.exports = typeDefs;
