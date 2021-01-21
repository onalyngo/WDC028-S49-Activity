import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import Head from 'next/head';

export default function Register() {

    // Form input state hooks
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')

    // State to determine whether submit button is enabled or not
    const [isActive, setIsActive] = useState(false)

    // Validate form input whenever email, password1, or password2 is changed
    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if((password1 !== '' && password2 !== '') && (password2 === password1)){
            setIsActive(true)
        }else{
            setIsActive(false)
        }

    }, [password1, password2])

    /* useEffect(() => {
        effect
        return () => {
            cleanup
        }
    }, [input]) */

    // Function to register user
    function registerUser(e) {

        e.preventDefault();

        // Check for duplicate email in database first
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/email-exists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            })
        })
        .then(res => res.json())
        .then(data => {

            // If no duplicates found
            if (data === false){

                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password1
                    })
                })
                .then(res => res.json())
                .then(data => {

                    // Registration successful
                    if(data === true){
                        // Redirect to login
                        Router.push('/login')
                    }else{
                        // Error in creating registration, redirect to error page
                        Router.push('/error')
                    }

                })

            }else{ // Duplicate email found
                Router.push('/error')
            }

        })
    } 

    return (
        <React.Fragment>
            <Head>
                <title>Register</title>
            </Head>
            <Form onSubmit={(e) => registerUser(e)}>

                <Form.Group controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="password1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={password1} 
                        onChange={e => setPassword1(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password2">
                    <Form.Label>Verify Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Verify Password" 
                        value={password2} 
                        onChange={e => setPassword2(e.target.value)} 
                        required
                    />
                </Form.Group>

                {/* Conditionally render submit button based on isActive state */}
                {isActive
                    ? 
                        <Button 
                            variant="primary" 
                            type="submit" 
                            id="submitBtn"
                        >
                            Submit
                        </Button>
                    : 
                        <Button 
                            variant="primary" 
                            type="submit" 
                            id="submitBtn" 
                            disabled
                        >
                            Submit
                        </Button>
                }
                
            </Form>
        </React.Fragment>
    )
}