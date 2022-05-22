// Import Apollo GraphQL
const { gql } = require("apollo-server-express");

// Setup type definitions
const typeDefs = gql`
    type Book {
        bookId: String!
        authors: [String]
        description: String!
        image: String
        link: String
        title: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [String]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        # Supports query of one or multiple users
        users(_id: String): [User]

        # TODO Question - is this correct?
        # Returns the profile of the person logged in
        me: User
    }

    type Mutations {
        # Create a user with username, email, password all required
        createUser(username: String!, email: String!, password: String!): Auth

        # Login user with the option to enter a username or email and require the password
        login(username: String, email: String, password: String!): Auth

        # Save book to user profile
        saveBook(bookId: String!): User

        # Delete book from user profile
        deleteBook(bookId: String!): User
    }
`;

module.exports = typeDefs;
