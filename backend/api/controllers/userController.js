// var connection = require('../utility/connection');
var util = require('../utility/util');
// var db = connection.database;

function insert(db, user){
	user.salt = util.createSalt();
	user.password = util.createPassword(user.salt, user.password);
	var insertQuery='INSERT INTO third_eye.user_master(name, email, mobile, parent_id, is_admin, salt, password, status) '+
	'VALUES (${name}, ${email}, ${mobile}, ${parent_id}, ${is_admin}, ${salt}, ${password}, ${status});';
	return db.none(insertQuery,user);	
}

function fetch(db, username) {
	var isMobile = /^\d{10}$/.test(username);
	var fetchQuery = '';
	if (isMobile) {
		fetchQuery = "SELECT um.id, um.name, um.email, um.mobile, um.parent_id, um.is_admin, " + 
					 "um.salt, um.password, um.dt_created, um.dt_modified, um.dt_login, sm.status " + 
					 "FROM third_eye.user_master AS um " + 
					 "JOIN third_eye.status_master AS sm ON um.status = sm.id " + 
					 "WHERE um.mobile = '" + username + "'";
	} else {
		fetchQuery = "SELECT um.id, um.name, um.email, um.mobile, um.parent_id, um.is_admin, " + 
					 "um.salt, um.password, um.dt_created, um.dt_modified, um.dt_login, sm.status " + 
					 "FROM third_eye.user_master AS um " + 
					 "JOIN third_eye.status_master AS sm ON um.status = sm.id " + 
					 "WHERE um.email = '" + username + "'";
	}

	console.log("Query : "+fetchQuery);
	return db.any(fetchQuery);
}

function update(db, user) {	
	var updateQuery='UPDATE third_eye.user_master SET name=${name}, email=${email}, mobile=${mobile}, parent_id=${parent_id}, is_admin=${is_admin}, salt=${salt}, password=${password}, status=${status}) WHERE id =${id}';
	console.log("Query : "+updateQuery);
	return db.none(updateQuery,user);
}

function remove(db, id) {
	var removeQuery = "DELETE FROM third_eye.user_master WHERE id = "+id;
	console.log("Query : "+removeQuery);
	return db.none(removeQuery);
}

module.exports = {
	insertUser: insert,
	fetchUser: fetch,
	updateUser: update,
	deleteUser: remove
};
