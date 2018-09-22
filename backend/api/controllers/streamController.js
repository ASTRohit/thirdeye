var util = require('../utility/util');

function insert(db, stream){	
	var insertQuery='INSERT INTO third_eye.stream_master(location_id, stream, label) '+
	'VALUES (${location_id}, ${stream}, ${label})  RETURNING id;';
	return db.one(insertQuery,stream);	
}

function fetch(db, ids) {	
	var fetchQuery = 'SELECT * FROM third_eye.stream_master WHERE id IN ' + idList;
	
	console.log("Query : "+fetchQuery);
	return db.any(fetchQuery);
}

function update(db, stream) {
	var updateQuery='UPDATE third_eye.stream_master SET location_id=${location_id}, stream=${stream}, label=${label} WHERE id =${id}';
	
	console.log("Query : "+updateQuery);
	return db.none(updateQuery,stream);		
}

function remove(db, id) {
	var removeQuery = 'DELETE FROM third_eye.stream_master WHERE id = '+id;
	console.log("Query : "+removeQuery);
	return db.none(removeQuery);
}

module.exports = {
	insertStream: insert,
	fetchStream: fetch,
	updateStream: update,
	deleteStream: remove
};
