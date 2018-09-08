var userCtrl = require('./userController');
var locationCtrl = require('./locationController');
var streamCtrl = require('./streamController');
var mappingCtrl = require('./mappingController');

var util = require('../utility/util');

function register(req, res, next) {
	var user = req.body;
	console.log('Register Request: '+JSON.stringify(user));
	userCtrl.insertUser(user)
		.then(function () {
			res	.status(201)
		       	.json({
		          status: 'success',
		          message: 'Registered'
		      	 });
		})
		.catch(function(err){
			return next(err);
		});
}

function login(req, res, next) {
	console.log('Login Request: '+JSON.stringify(req.body));
	var username = req.body.username;
	var password = req.body.password;

	userCtrl.fetchUser(username)
		.then(function(data) {
			if (data != undefined) {
				var reqPassword = util.createPassword(data.salt, password);
				if (reqPassword == data.password) {
					delete data['salt'];
					delete data['password'];
					res .status(200)
						.json({
							status: 'success',
							result: data,
		          			message: ''
						});
				} else {
					res .status(401)
						.json({
							status: 'fail',
							result: null,
		          			message: 'Unable to login with provided credentials'
						});
				}
			} else {
				res .status(401)
					.json({
						status: 'fail',
						result: null,
		          		message: 'Unable to login with provided credentials'
					});
			}			
		})
		.catch(function(err){
			return next(err);
		});
}

module.exports = {
	authRegister: register,
	authLogin: login
};
