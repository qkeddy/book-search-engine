// see SignupForm.js for comments
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

// Import the `useMutation()` hook from Apollo Client
import { useMutation } from "@apollo/client";

// Reference required mutation for logging in a user
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ email: "", password: "" });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // Assign the LOGIN_USER mutation to `loginUser` and capture any errors returned
    // TODO - should `error` be used in the JSX instead of the `<Alert` tag?
    const [loginUser, { error }] = useMutation(LOGIN_USER);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // check if form has everything (as per react-bootstrap docs)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            // Spread `userFormData` into `loginUser` and return context data about the user for the subsequent login function
            const { data } = await loginUser({ variables: { ...userFormData } });
            console.log(data);

            // Store the token to local storage. (`login` refers to the typesDefs mutation)
            Auth.login(data.login.token);
        } catch (err) {
            console.error(err);
            // If error in login, then show alert
            setShowAlert(true);
        }

        // Reset login form data
        setUserFormData({
            username: "",
            email: "",
            password: "",
        });
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
                    {/* This is a user friendly message */}
                    Something went wrong with your login credentials!
                </Alert>
                <Form.Group>
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control type="text" placeholder="Your email" name="email" onChange={handleInputChange} value={userFormData.email} required />
                    <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control type="password" placeholder="Your password" name="password" onChange={handleInputChange} value={userFormData.password} required />
                    <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
                </Form.Group>
                <Button disabled={!(userFormData.email && userFormData.password)} type="submit" variant="success">
                    Submit
                </Button>
            </Form>
            {error && <div>Something went wrong...</div>}
        </>
    );
};

export default LoginForm;
