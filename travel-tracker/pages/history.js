import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Table, Alert, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_KEY;

export default function History() {

	// State for storing all the records from the database.
	const [records, setRecords] = useState([]);
	const [longitude, setLongitude] = useState(0);
	const [latitude, setLatitude] = useState(0);

	const mapContainerRef = useRef(null);

	function setCoordinates(long, lat){
		setLongitude(long)
		setLatitude(lat)
	}

	// Get the user's record when the component mounts
	useEffect(() => {

		fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/details`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then(res => res.json())
        .then(data => {
        	if (data._id){ // JWT validated
        		setRecords(data.travels)
        	} else { // JWT is invalid or non-existent
        		setRecords([])
        	}
        })
	}, [])

	useEffect(() => {

		const map = new mapboxgl.Map({

			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [longitude, latitude],
			zoom: 12
		})

		map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

		const marker = new mapboxgl.Marker()
		.setLngLat([longitude, latitude])
		.addTo(map)

		return () => map.remove()

	}, [latitude, longitude])


	return (
		<React.Fragment>
			<Head>
				<title>My Travel Records</title>
			</Head>
			<Row>
				<Col xs={12} lg={6}>
					{records.length > 0
						?
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Origin</th>
										<th>Destination</th>
										<th>Date</th>
										<th>Distance (m)</th>
										<th>Duration (mins)</th>
									</tr>
								</thead>
								<tbody>
									{records.map(record => {
										return(
											<tr key={record._id}>
												<td onClick={() => setCoordinates(record.origin.longitude, record.origin.latitude)}>
													{record.origin.longitude}, {record.origin.latitude}
												</td>
												<td onClick={() => setCoordinates(record.destination.longitude, record.destination.latitude)}>
													{record.destination.longitude}, {record.destination.latitude}
												</td>
												<td>{moment(record.date).format('MMMM DD YYYY')}</td>
												<td>{Math.round(record.distance)}</td>
												<td>{Math.round(record.duration/60)}</td>
											</tr>
										)
									})}
								</tbody>
							</Table>
						:
							<Alert variant="info">No travel records yet.</Alert>
					}
				</Col>
				<Col xs={12} lg={6}>
					<div className="mapContainer" ref={mapContainerRef} />
				</Col>
			</Row>
		</React.Fragment>
	)
}