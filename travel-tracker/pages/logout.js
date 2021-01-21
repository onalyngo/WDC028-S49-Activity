import { useContext, useEffect } from 'react';
import UserContext from '../UserContext';
import Router from 'next/router';

export default function Logout() {

    // Consume the UserContext and destructure it to access the user and unsetUser values from the context provider
    const { unsetUser } = useContext(UserContext);
    
    // Invoke unsetUser only after initial render
    useEffect(() => {

        // Invoke unsetUser() to clear local storage of user info
        unsetUser();
        Router.push('/login');

    })

    return null;

}