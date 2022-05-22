import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import the Apollo client wrapper
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

const client = new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
});

function App() {
    return (
        // Wrap everything in the ApolloProvider and client being passed in a `props`
        <ApolloClient client={client}>
            <Router>
                <>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<SearchBooks />} />
                        <Route path="/saved" element={<SavedBooks />} />
                        <Route path="*" element={<h1 className="display-2">Wrong page!</h1>} />
                    </Routes>
                </>
            </Router>
        </ApolloClient>
    );
}

export default App;
