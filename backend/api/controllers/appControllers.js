var userCtrl = require('./userController');
var locationCtrl = require('./locationController');
var streamCtrl = require('./streamController');
var mappingCtrl = require('./mappingController');

var connection = require('../utility/connection');
var db = connection.database;
var util = require('../utility/util');

async function register(req, res, next) {
	let request = req.body;
	console.log("Requqest: "+JSON.stringify(request));

	var user = request.user;
	var location = request.location;
	var streams = request.streams;

	try {
		let userInsert = await userCtrl.insertUser(db, user);
		user['id'] = parseInt(userInsert['id']);

		console.log("User: "+JSON.stringify(user));

		let locationInsert = await locationCtrl.insertLocation(db, location);
		location['id'] = parseInt(locationInsert['id']);

		console.log("Location: "+JSON.stringify(location));

		let ulm = {
			user_id: user['id'],
			location_id: location['id']
		}

		await mappingCtrl.insertMapULM(db, ulm);

		for (var i = 0; i < streams.length; i++) {
			let stream = {
				location_id: location['id'],
				label: streams[i]['label'],
				stream: streams[i]['stream']
			}

			let streamInsert = await streamCtrl.insertStream(db, stream);
			streams[i]['id'] = parseInt(streamInsert['id']);
			console.log("Stream: "+JSON.stringify(streams[i]));

			let usm = {
				user_id: user['id'],
				stream_id: streams[i]['id']
			}

			await mappingCtrl.insertMapUSM(db, usm);
		}	

		delete user['salt'];
		delete user['password'];

		let response = {
			user: user,
			location: location,
			streams: streams
		}

		res	.status(201)
		    .json({
		        status: 'success',
		        message: 'Registered',
		        result: response
		    });
	} catch(err) {
		console.log(err);
		return next(err);
	}
}

async function getAll(req,res, next) {
	try {
		let data = await userCtrl.fetchAllUser(db);
		console.log('Return on Async/Await : '+JSON.stringify(data))
		res .status(200)
			.json({
				status: 'success',
				result: data,
			    message: ''
			});
	} catch(err) {
		console.error(err);
	}
}

async function login(req, res, next) {
	console.log('Login Request: '+JSON.stringify(req.body));
	var username = req.body.username;
	var password = req.body.password;

	try {
		let userData = await userCtrl.fetchUser(db, username);
		if (userData != undefined && userData.length>0) {
			userData = userData[0];
			var reqPassword = util.createPassword(userData.salt, password);

			if (reqPassword == userData.password) {
				delete userData['salt'];
				delete userData['password']; 

				let ulmData = await mappingCtrl.fetchMapULM(db, 'user_id', userData['id']);
				let locationData = await locationCtrl.fetchLocation(db, ulmData[0].location_id);

				let usmData = await mappingCtrl.fetchMapUSM(db, 'user_id', userData['id']);

				var idList = '';
				for (var i = 0; i < usmData.length; i++) {
					if (idList == '') {
						idList = '('+usmData[i].stream_id;
					} else {
						idList = idList + ', ' + usmData[i].stream_id;
					}
				}

				idList = idList + ')';

				let streamData = await streamCtrl.fetchStream(db, idList);

				response = {
					user: userData,
					location: locationData[0],
					streams: streamData
				};

				res .status(200)
					.json({
						status: 'success',
						result: response,
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
	} catch (err) {
		console.error(err);
		return next(err);
	}
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
