var util = require('../utility/util');

function insert(db, location){	
	var insertQuery='INSERT INTO third_eye.location_master(address, city, state, zipcode) '+
	'VALUES (${address}, ${city}, ${state}, ${zipcode})  RETURNING id;';
	return db.one(insertQuery,location);	
}

function fetch(db, id) {
	var fetchQuery = 'SELECT * FROM third_eye.location_master WHERE id = ' + id;
	
	console.log("Query : "+fetchQuery);
	return db.any(fetchQuery);
}

function update(db, location) {
	var updateQuery='UPDATE third_eye.location_master SET address=${address}, city=${city}, state=${state}, zipcode=${zipcode} WHERE id =${id}';
	
	console.log("Query : "+updateQuery);
	return db.none(updateQuery,location);		
}

function remove(db, id) {
	var removeQuery = 'DELETE FROM third_eye.location_master WHERE id = '+id;
	console.log("Query : "+removeQuery);
	return db.none(removeQuery);
}

module.exports = {
	insertLocation: insert,
	fetchLocation: fetch,
	updateLocation: update,
	deleteLocation: remove
};
