// Import Mongoose data models
const { Book, User } = require("../models");

// TODO Import Authentication libraries

const resolvers = {
    Query: {
        users: async (parent, { _id }) => {
            const params = _id ? { _id } : {};
            return await User.find(params);
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate("savedBooks");
            }
            throw new AuthenticationError("You need to be logged in!");
        },
    },

    // Mutation: {
    //     createUser: async (parent, args) => {},

    //     login: async (parent, args) => {},

    //     saveBook: async (parent, args) => {},

    //     deleteBook: async (parent, args) => {},
    // },
};

module.exports = resolvers;
