// Import Mongoose data models
const { Book, User } = require("../models");

// Import Authentication libraries 

const resolvers = {
    Query: {
        user: (parent, { _id }) => {
            const params = _id ? { _id } : {};
            return await User.find(params);
        },
    },

    Mutation: {
        createUser: async (parent, args) => {},

        login: async (parent, args) => {},

        saveBook: async (parent, args) => {},

        deleteBook: async (parent, args) => {},
    },
};

module.exports = resolvers;