const mongoose = require('mongoose')
const moment = require('moment')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    travels: [
        {
            origin: {
                longitude: {
                    type: Number,
                    required: [true, 'Origin longitude is required']
                },
                latitude: {
                    type: Number,
                    required: [true, 'Origin latitude is required']
                }
            },
            destination: {
                longitude: {
                    type: Number,
                    required: [true, 'Destination longitude is required']
                },
                latitude: {
                    type: Number,
                    required: [true, 'Destination latitude is required']
                }
            },
            distance: {
                type: Number,
                required: [true, 'Distance is required.']
            },
            duration: {
                type: String,
                required: [true, 'Comment is required']
            },
            date: {
                type: Date,
                default: moment()
            },
            order: {
                orderID: {
                    type: String,
                    required: [true, 'Order ID is required']
                },
                amount: {
                    type: Number,
                    required: [true, 'Order amount is required']
                }
            }
        }
    ]
})

module.exports = mongoose.model('user', userSchema)