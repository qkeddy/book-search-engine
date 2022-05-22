// Import Signing & Authentication libraries
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

// Import Mongoose data models
const { User } = require("../models");

const resolvers = {
    Query: {
        // Find a single or multiple users
        users: async (parent, { _id }) => {
            const params = _id ? { _id } : {};
            return await User.find(params);
        },

        // Get the profile of the logged in user and populate savedBooks
        me: async (parent, args, context) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id }).populate("savedBooks");
            }
            throw new AuthenticationError("You need to be logged in!");
        },
    },

    Mutation: {
        // TODO - Need to account for both email and username
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("No profile with this email found!");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect password!");
            }

            const token = signToken(user);
            return { token, user };
        },

        //     createUser: async (parent, args) => {},

        //     saveBook: async (parent, args) => {},

        //     deleteBook: async (parent, args) => {},
    },
};

module.exports = resolvers;
