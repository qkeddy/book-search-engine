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
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Wrong password!");
            }

            const token = signToken(user);
            return { token, user };
        },

        //     createUser: async (parent, args) => {},

        //     saveBook: async (parent, args) => {},

        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to be logged in to use this feature.");
        },
    },
};

module.exports = resolvers;
