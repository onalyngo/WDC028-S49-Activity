import React from 'react';
import Head from 'next/head';
import Banner from '../components/Banner';

export default function Home() {
    const data = {
        title: "Travel Tracker",
        content: "Book a ride. Record your travels. Gain insights."
    }

    return (
        <React.Fragment>
            <Head>
                <title>Travel Tracker</title>
            </Head>
            <Banner data={data} />
        </React.Fragment>
    )
}