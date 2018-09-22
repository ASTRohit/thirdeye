var userCtrl = require('./userController');
var locationCtrl = require('./locationController');
var streamCtrl = require('./streamController');
var mappingCtrl = require('./mappingController');

var connection = require('../utility/connection');
var db = connection.database;
var util = require('../utility/util');

function register(req, res, next) {
	var user = req.body;
	console.log('Register Request: '+JSON.stringify(user));
	userCtrl.insertUser(db, user)
		.then(function (data) {
			console.log('Return on insert : '+JSON.stringify(data));
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

function getAll(req,res, next) {
	let data = userCtrl.fetchAllUser(db);
	console.log('Return on Async/Await : '+JSON.stringify(data))
	res .status(200)
		.json({
			status: 'success',
			result: data,
		    message: ''
		});
}

function login(req, res, next) {
	console.log('Login Request: '+JSON.stringify(req.body));
	var username = req.body.username;
	var password = req.body.password;

	userCtrl.fetchUser(db, username)
		.then(function(data) {
			if (data != undefined && data.length>0) {
				data = data[0];
				console.log('Fetched data: '+JSON.stringify(data))
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

function updateProfile(req, res, next){
	var user = req.body;
	console.log('Update Profile Request: '+JSON.stringify(user));
	userCtrl.updateUser(db,user)
		.then(function() {
			userCtrl.fetchUser(db, username)
				.then(function(data) {
					if (data != undefined && data.length>0) {
						data = data[0];
						console.log('Fetched data: '+JSON.stringify(data));
						delete data['salt'];
						delete data['password'];
						res .status(200)
							.json({
								status: 'success',
								result: data,
				          		message: ''
							});
					} else {
						res .status(403)
							.json({
								status: 'fail',
								result: null,
				          		message: 'User does not found'
							});
					}			
				})
				.catch(function(err){
					return next(err);
				});
		})
		.catch(function(err){
			return next(err);
		});
}

module.exports = {
	authRegister: register,
	authLogin: login,
	getUsers: getAll
};
