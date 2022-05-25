import { Jumbotron, Container, CardColumns, Card, Button } from "react-bootstrap";

// import { getMe, deleteBook } from '../utils/API';
// Import query and mutation hooks
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { removeBookId } from "../utils/localStorage";

// Pass in authentication hook
import Auth from "../utils/auth";

// Import the `useMutation()` and `useQuery()` hooks from Apollo Client
import { useMutation, useQuery } from "@apollo/client";

const SavedBooks = () => {
    // `data` represents the state and is live and gets triggered
    const { loading, data } = useQuery(GET_ME);

    // Waiting for books to come back. Using `me` as this is what is coming back on the `data` object. Can use Apollo Explorer or console.log(data)
    const userData = data?.me || [];

    // Remove the book with a mutation
    const [deleteBook, { error }] = useMutation(REMOVE_BOOK);

    // Create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        // Check if there is a token in local storage to prevent any deletion of books if not logged in
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
            return false;
        }

        try {
            await deleteBook({ variables: { bookId } });

            // Upon success, remove book's id from localStorage
            removeBookId(bookId);

            // Reload the books
            // TODO - should we be using cache here?
            // TODO - look at this: https://stackoverflow.com/questions/63192774/apollo-client-delete-item-from-cache
            window.location.reload();
        } catch (err) {
            console.log(err);
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
                            {userData.savedBooks?.map((book) => {
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
                {error && <div>Something went wrong with the delete</div>}
            </Container>
        </>
    );
};

export default SavedBooks;
