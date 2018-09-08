var user = require('./userController');
var location = require('./locationController');
var stream = require('./streamController');
var mapping = require('./mappingController');

function register(req, res, next) {
	req.parent_id = parseInt(req.parent_id);
	req.status = parseInt(req.status);
	req.is_admin = getBoolean(req.is_admin);
	user.insertUser(req)
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
