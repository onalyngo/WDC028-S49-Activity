import React from 'react';
import ReactDOM from 'react-dom';
const PayPalBtn = paypal.Buttons.driver("react", { React, ReactDOM } );


// The amount property and completeBooking function will both come from the "StreetNavigation" component where the button will be rendered.
export default function PaypalButton({ completeBooking, amount }) {

	const createOrder = (data, actions) => {

		return actions.order.create({
			purchase_units: [
				{
					amount: {
						value: amount
					}
				}
			]
		})
	}

	// What will happen when transaction is approved by PayPal
	const onApprove = (data, actions) => {
		console.log(data);

		// Will reset the travel details and record travel in the database
		completeBooking(data.orderID);

		// Capture this transaction in your PayPal account dashboard
		return actions.order.capture();
	}


	return (
		<PayPalBtn 
			createOrder={(data, actions) => createOrder(data, actions)} 
			onApprove={(data, actions) => onApprove(data, actions)}
		/>
	)
}