import React, { useContext } from 'react';
// Import nextJS Link component for client-side navigation
import Link from 'next/link';
// Import necessary bootstrap components
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import UserContext from '../UserContext';

export default function NavBar() {

    // Consume the UserContext and destructure it to access the user state from the context provider
    const { user } = useContext(UserContext);

    return (
        <Navbar bg="light" expand="lg">
            <Link href="/">
                <a className="navbar-brand">Travel Tracker</a>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    
                    {(user.id !== null)
                        ? 
                            <React.Fragment>
                                <Link href="/travel">
                                    <a className="nav-link" role="button">
                                        Travel
                                    </a>
                                </Link>
                                <Link href="/insights">
                                    <a className="nav-link" role="button">
                                        Insights
                                    </a>
                                </Link>
                                <Link href="/history">
                                    <a className="nav-link" role="button">
                                        History
                                    </a>
                                </Link>
                                <Link href="/logout">
                                    <a className="nav-link" role="button">
                                        Logout
                                    </a>
                                </Link>
                            </React.Fragment>
                        : 
                            <React.Fragment>
                                <Link href="/login">
                                    <a className="nav-link" role="button">
                                        Login
                                    </a>
                                </Link>
                                <Link href="/register">
                                    <a className="nav-link" role="button">
                                        Register
                                    </a>
                                </Link>
                            </React.Fragment>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}