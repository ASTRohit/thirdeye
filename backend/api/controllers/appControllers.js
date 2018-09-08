var userCtrl = require('./userController');
var locationCtrl = require('./locationController');
var streamCtrl = require('./streamController');
var mappingCtrl = require('./mappingController');

function register(req, res, next) {
	var user = req.body;
	console.log('Request: '+JSON.stringify(user));
	userCtrl.insertUser(user)
		.then(function () {
			res
				.status(200)
		       	.json({
		          status: 'success',
		          message: 'Registered'
		      	 });
		})
		.catch(function(err){
			return next(err);
		});
}

module.exports = {
	authRegister: register
};
