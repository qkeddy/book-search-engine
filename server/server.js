const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");

// Import schemas
const { typeDefs, resolvers } = require("./schemas");

// Connection to Mongo DB
const db = require("./config/connection");

// Initialize Express server
const app = express();
const PORT = process.env.PORT || 3001;

// New Apollo Server with context
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
});

// Initialize middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
}

// By default load the index.html in the client/build directory
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    // Wrap the express app with middleware
    server.applyMiddleware({ app });

    db.once("open", () => {
        app.listen(PORT, () => {
            console.log(`🌍 Now listening on localhost:${PORT}`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
