import React from 'react';
import Head from 'next/head';
import Banner from '../components/Banner';

export default function Error() {
	return (
		<React.Fragment>
			<Head>
				<title>Oops...</title>
			</Head>
			<Banner 
				title="Something went wrong" 
				content="Please try again later." 
			/>
		</React.Fragment>
	)
}