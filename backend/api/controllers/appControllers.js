var user = require('./userController');
var location = require('./locationController');
var stream = require('./streamController');
var mapping = require('./mappingController');

function register(req, res, next) {
	var user = req.body;
	console.log('Request: '+JSON.stringify(user));
	user.parent_id = parseInt(user.parent_id);
	user.status = parseInt(user.status);
	user.is_admin = getBoolean(user.is_admin);
	user.insertUser(user)
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

function getBoolean(value){
   switch(value){
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default: 
            return false;
    }
}

module.exports = {
	authRegister: register
};
