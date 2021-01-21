import { useEffect, useRef, useState, useContext } from 'react';
import Router from 'next/router';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_KEY;
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import UserContext from '../UserContext';
import PayPalButton from './PayPalButton';

const StreetNavigation = () => {

	const { user } = useContext(UserContext);

	const [distance, setDistance] = useState(0);
	const [duration, setDuration] = useState(0);
	const [originLong, setOriginLong] = useState(0);
	const [originLat, setOriginLat] = useState(0);
	const [destinationLong, setDestinationLong] = useState(0);
	const [destinationLat, setDestinationLat] = useState(0);
	const [isActive, setIsActive] = useState(false);
	// Will store the amount/price for the booking/order
	const [amount, setAmount] = useState(0);
	// const [orderID, setOrderId] = useState(0);

	const mapContainerRef = useRef(null);
	
	useEffect(() => {

		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [121.04382, 14.63289],
			zoom: 12
		})

		// Instantiate mapbox directions control overlay
		const directions = new MapboxDirections({
			accessToken: mapboxgl.accessToken,
			unit: 'metric',
			profile: 'mapbox/driving'
		})

		map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

		// Add Mapbox Directions control overlay to the map
		map.addControl(directions, 'top-left');

		// Whenever a route is generated it returns an array of route objects
		directions.on("route", e => {
			console.log(e)

			if (typeof e.route !== "undefined"){

				// console.log(e.route)
				
				setDistance(e.route[0].distance);
                setDuration((e.route[0].duration));
                setOriginLong(e.route[0].legs[0].steps[0].intersections[0].location[0]);
                setOriginLat(e.route[0].legs[0].steps[0].intersections[0].location[1]);
                setDestinationLong(e.route[0].legs[0].steps[e.route[0].legs[0].steps.length-1].intersections[0].location[0])
                setDestinationLat(e.route[0].legs[0].steps[e.route[0].legs[0].steps.length-1].intersections[0].location[1])

                setAmount(Math.round(e.route[0].distance/1000)*50)
			}
			
		})

		return () => map.remove()

	}, [])


	useEffect(() => {
		if(distance !== 0 && duration !== 0){
			setIsActive(true);
		}else {
        	setIsActive(false)
    	}
	}, [distance, duration])
	

	function recordTravel(orderID) {
        // console.log(originLong, originLat, destinationLong, destinationLat, distance, duration);

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/travels`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                originLong: originLong,
                originLat: originLat,
                destinationLong: destinationLong,
                destinationLat: destinationLat,
                distance: distance,
                duration: duration,
                orderID: orderID,
                amount: amount

            })
        })
            .then(res => res.json())
            .then(data => {
                if (data === true) {
                    // Redirect to history
                    Router.push('/history')
                } else {
                    // Error in creating record, redirect to error page
                    Router.push('/error')
                }
            })
    }

    function completeBooking(orderId){
    	setOriginLong(0)
    	setOriginLat(0)
    	setDestinationLong(0)
    	setDestinationLat(0)
    	setDistance(0)
    	setDuration(0)
    	setAmount(0)
    	recordTravel(orderId)
    }

	return(
		<Row>
			<Col xs={12} md={8}>
				<div className="mapContainer" ref={mapContainerRef} />
			</Col>
			<Col xs={12} md={4}>
				{ user.id === null
					?
						<Alert variant="info">
							You must be logged in to record your travels.
						</Alert>
					:
						<Card>
							<Card.Body>
								<Card.Title>
									Record Route
								</Card.Title>
								<Card.Text>
									Origin Longitude: {originLong}
								</Card.Text>
								<Card.Text>
									Origin Latitude: {originLat}
								</Card.Text>
								<Card.Text>
									Destination Longitude: {destinationLong}
								</Card.Text>
								<Card.Text>
									Destination Latitude: {destinationLat}
								</Card.Text>
								<Card.Text>
									Total Distance: {Math.round(distance)} meters
								</Card.Text>
								<Card.Text>
									Total Duration: {Math.round(duration/60)} minutes
								</Card.Text>
								<Card.Text>
									Booking Cost: PHP {amount}
								</Card.Text>
								{ isActive === true
									?
										<PayPalButton
											amount={amount}
											completeBooking={completeBooking}
										/>
									:
										<Alert variant="info">
											Generate a route to book a ride
										</Alert>
								}
							</Card.Body>
						</Card>
				}
			</Col>
		</Row>
	)
}

export default StreetNavigation;