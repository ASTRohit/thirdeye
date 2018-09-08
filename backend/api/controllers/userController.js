var connection = require('../utility/connection');
var util = require('../utility/util');
var db = connection.database;

function insert(user){
	user.salt = util.createSalt();
	user.password = util.createPassword(user.salt, user.password);
	var insertQuery='INSERT INTO third_eye.user_master(name, email, mobile, parent_id, is_admin, salt, password, status) '+
	'VALUES (${name}, ${email}, ${mobile}, ${parent_id}, ${is_admin}, ${salt}, ${password}, ${status});';
	return db.none(insertQuery,user);	
}

module.exports = {
	insertUser: insert
};
