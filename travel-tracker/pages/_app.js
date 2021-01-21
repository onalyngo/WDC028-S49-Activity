import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import '../styles/globals.css';
// Bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
// Mapbox css
import 'mapbox-gl/dist/mapbox-gl.css';
// Mapbox directions css
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { UserProvider } from '../UserContext';
import Navbar from '../components/NavBar';

export default function App({ Component, pageProps }) {

    //State hook for user state, define here for global scope 
    const [user, setUser] = useState({
        // Initialized as an object with properties set as null
        // Proper values will be obtained from localStorage AFTER component gets rendered due to Next.JS pre-rendering
        id: null
    })

    // Effect hook to set global user state when changes to the id property of user state is detected
    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {

            if(data._id){ //JWT validated
                setUser({
                    id: data._id
                })
            }else{ //JWT is invalid or non-existent
                setUser({
                    id: null
                })
            }    

        })

    }, [user.id])

    // Function for clearing local storage upon logout
    const unsetUser = () => {

        localStorage.clear()

        // Set the user global scope in the context provider to have its id set to null
        setUser({
            id: null
        });

    }

    return (
        <React.Fragment>
            {/* Wrap the component tree within the UserProvider context provider so that components will have access to the passed in values here */}
            <UserProvider value={{user, setUser, unsetUser}}>
                <Navbar />
                <Container>
                    <Component {...pageProps} />
                </Container>
            </UserProvider>
        </React.Fragment>
    )
}