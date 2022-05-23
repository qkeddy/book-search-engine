import React from "react";

import { useParams } from "react-router-dom";

import { Jumbotron, Container, CardColumns, Card, Button } from "react-bootstrap";

// Import the `useMutation()` and `useQuery()` hooks from Apollo Client
import { useMutation, useQuery } from "@apollo/client";

// Import query and mutation hooks
import { GET_ME, QUERY_SINGLE_PROFILE } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
    const { profileId } = useParams();

    // If there is no `profileId` in the URL as a parameter, execute the `GET_ME` user query hook with the logged in user's information. In addition to data, also brings along the loading boolean, and an error code if needed.
    const { loading, data } = useQuery(profileId ? QUERY_SINGLE_PROFILE : GET_ME, {
        variables: { profileId: profileId },
    });

    // Waiting for books to come back
    const userData = data?.books || "";

    const [removeBook, { error }] = useMutation(REMOVE_BOOK);

    // TODO - handle error

    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        try {
            await removeBook({
                variables: {},
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Jumbotron fluid className="text-light bg-dark">
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </Jumbotron>
            <Container>
                {loading ? (
                    <h2>LOADING...</h2>
                ) : (
                    <div>
                        <h2>{userData.savedBooks.length ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"}:` : "You have no saved books!"}</h2>
                        <CardColumns>
                            {userData.savedBooks.map((book) => {
                                return (
                                    <Card key={book.bookId} border="dark">
                                        {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                                        <Card.Body>
                                            <Card.Title>{book.title}</Card.Title>
                                            <p className="small">Authors: {book.authors}</p>
                                            <Card.Text>{book.description}</Card.Text>
                                            <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                                                Delete this Book!
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </CardColumns>
                    </div>
                )}
            </Container>
        </>
    );
};

export default SavedBooks;
