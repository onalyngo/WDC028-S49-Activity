const User = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../auth')

//function to catch & handle errors
const errCatcher = err => console.log(err)

//function for finding duplicate emails
module.exports.emailExists = (params) => {
    //find a user document with matching email
    return User.find({ email: params.email })
    .then(result => {
        //if match found, return true
		return result.length > 0 ? true : false
    })
    .catch(errCatcher)
}

module.exports.register = (params) => {
    //instantiate a new user object
	let user = new User({
		email: params.email,
		password: bcrypt.hashSync(params.password, 10)
	})

    //save user object as a new document
    return user.save()
    .then((user, err) => {
        //if err generated, return false otherwise return true
		return (err) ? false : true
    })
    .catch(errCatcher)
}

module.exports.login = (params) => {
    //find a user with matching email
    return User.findOne({ email: params.email })
    .then(user => {
        //if no match found, return false
		if (user === null) return false

        //check if submitted password matches password on record
		const isPasswordMatched = bcrypt.compareSync(params.password, user.password)

        //if matching password
		if (isPasswordMatched) {
            //generate JWT
			return { accessToken: auth.createAccessToken(user.toObject()) }
		} else {
			return false
		}
    })
    .catch(errCatcher)
}

//function for getting details of a user based on a decoded token
module.exports.getPrivate = (params) => {
    return User.findById(params.userId)
    .then(user => {
        //clear the password property of the user object for security
		user.password = undefined
		return user
    })
    .catch(errCatcher)
}

module.exports.addTravel = (params) => {
    return User.findById(params.userId)
    .then((user, err) => {
        if(err) return false
        user.travels.push(params.travel)
        return user.save()
        .then((updatedUser, err) => {
            return err ? false : true
        })
        .catch(errCatcher)
    })
    .catch(errCatcher)
}