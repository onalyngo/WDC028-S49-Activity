const express = require('express')
const router = express.Router()
const auth = require('../auth')
const UserController = require('../controllers/user')

router.post('/email-exists', (req, res) => {
    UserController.emailExists(req.body).then(result => res.send(result))
})

router.post('/', (req, res) => {
    UserController.register(req.body).then(result => res.send(result))
})

router.post('/login', (req, res) => {
    UserController.login(req.body).then(result => res.send(result))
})

//for getting private user profile info
router.get('/details', auth.verify, (req, res) => {
	const user = auth.decode(req.headers.authorization)
    UserController.getPrivate({ userId: user.id }).then(user => res.send(user))
})

//for recording user travels
router.post('/travels', auth.verify, (req, res) => {
    const params = {
        userId: auth.decode(req.headers.authorization).id,
        travel: {
            origin: {
                longitude: req.body.originLong,
                latitude: req.body.originLat
            },
            destination: {
                longitude: req.body.destinationLong,
                latitude: req.body.destinationLat
            },
            distance: req.body.distance,
            duration: req.body.duration
        }
    }
    UserController.addTravel(params).then(result => res.send(result))
})

module.exports = router