import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// Import the `useMutation()` hook from Apollo Client
import { useMutation } from "@apollo/client";

// Reference required mutation for adding a user
import { ADD_USER as CREATE_USER } from "../utils/mutations";

import Auth from '../utils/auth';

const SignupForm = () => {
    // set initial form state
    const [userFormData, setUserFormData] = useState({ username: "", email: "", password: "" });
    // set state for form validation
    const [validated] = useState(false);
    // set state for alert
    const [showAlert, setShowAlert] = useState(false);

    // Assign the ADD_USER mutation to `addUser` and capture any errors returned
    const [createUser, { error }] = useMutation(CREATE_USER);

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
            // Spread `userFormData` into `createUser` and return context data about the user for the subsequent login function
            const { data } = await createUser({ variables: { ...userFormData } });

            // Login
            Auth.login(data.login.token);

            // If error, throw error & write to console
            if (error) {
                console.log(error);
                throw new Error("something went wrong!");
            }
        } catch (err) {
            console.error(err);
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
            {/* This is needed for the validation functionality above */}
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                {/* show alert if server response is bad */}
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
                    Something went wrong with your signup!
                </Alert>

                <Form.Group>
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control type="text" placeholder="Your username" name="username" onChange={handleInputChange} value={userFormData.username} required />
                    <Form.Control.Feedback type="invalid">Username is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control type="email" placeholder="Your email address" name="email" onChange={handleInputChange} value={userFormData.email} required />
                    <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control type="password" placeholder="Your password" name="password" onChange={handleInputChange} value={userFormData.password} required />
                    <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
                </Form.Group>
                <Button disabled={!(userFormData.username && userFormData.email && userFormData.password)} type="submit" variant="success">
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default SignupForm;
