import React, { useState, useContext } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Form, Button } from 'react-bootstrap';
import UserContext from '../UserContext';

export default function Login() {

    // Use the UserContext and destructure it to access the user and setUser defined in the App component
    const { setUser } = useContext(UserContext)

    // States for form input
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Function to process user authentication
    function authenticate(e) {
        // Prevent redirection via form submission
        e.preventDefault()

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {

            // Successful authentication will return a JWT via the response accessToken property
            if(data.accessToken){

                // Store JWT in local storage
                localStorage.setItem('token', data.accessToken);

                // Send a fetch request to decode JWT and obtain user ID and role for storing in context
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/details`, {
                    headers: {
                        Authorization: `Bearer ${data.accessToken}`
                    } 
                })
                .then(res => res.json())
                .then(data => {

                    // Set the global user state to have properties containing authenticated user's ID
                    setUser({
                        id: data._id
                    })
                    Router.push('/travel')

                })

            }else{ // Authentication failure
                Router.push('/error')
            }
        })
    }

    return (
        <React.Fragment>
            <Head>
                <title>Login</title>
            </Head>
            <Form onSubmit={(e) => authenticate(e)}>
                <Form.Group controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </React.Fragment>
    )
}