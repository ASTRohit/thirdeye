var util = require('../utility/util');

function insert(db, user){
	user.salt = util.createSalt();
	user.password = util.createPassword(user.salt, user.password);
	var insertQuery='INSERT INTO third_eye.user_master(name, email, mobile, parent_id, is_admin, salt, password, status) '+
	'VALUES (${name}, ${email}, ${mobile}, ${parent_id}, ${is_admin}, ${salt}, ${password}, ${status}) RETURNING id;';
	return db.one(insertQuery,user);	
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

async function fetchAll(db) {
	var fetchQuery = "SELECT um.id, um.name, um.email, um.mobile, um.parent_id, um.is_admin, " + 
					 "um.salt, um.password, um.dt_created, um.dt_modified, um.dt_login, sm.status " + 
					 "FROM third_eye.user_master AS um " + 
					 "JOIN third_eye.status_master AS sm ON um.status = sm.id;";	

	console.log("Query : "+fetchQuery);
	var data;
	try {
		data = await db.any(fetchQuery);
	} catch(err) {
		console.error(err);
	}
	return data;
}

function update(db, user) {
	var updateQuery='';
	if (user.password != undefined && user.password != '') {
		user.salt = util.createSalt();
		user.password  = util.createPassword(user.salt, user.password);
		updateQuery='UPDATE third_eye.user_master SET name=${name}, email=${email}, mobile=${mobile}, parent_id=${parent_id}, is_admin=${is_admin}, salt=${salt}, password=${password}, status=${status} WHERE id =${id}';
	} else {
		updateQuery='UPDATE third_eye.user_master SET name=${name}, email=${email}, mobile=${mobile}, parent_id=${parent_id}, is_admin=${is_admin}, status=${status} WHERE id =${id}';		
	}

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
	fetchAllUser: fetchAll,
	updateUser: update,
	deleteUser: remove
};
