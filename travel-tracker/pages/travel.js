import React from 'react';
import Head from 'next/head';
// import StreetNavigation from '../components/StreetNavigation';
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import ('../components/StreetNavigation'), {ssr: false});

export default function Travel(){
	return (
		<React.Fragment>
			<Head>
				<title>Record Your Travels</title>
			</Head>
			<DynamicComponent />
		</React.Fragment>
	)
}