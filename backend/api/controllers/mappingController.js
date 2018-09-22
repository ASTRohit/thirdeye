var util = require('../utility/util');

function insertULM(db, ulm){	
	var insertQuery='INSERT INTO third_eye.user_location_map(user_id, location_id) '+
	'VALUES (${user_id}, ${location_id});';
	return db.none(insertQuery,ulm);	
}

function fetchULM(db, key, id) {
	var fetchQuery = 'SELECT * FROM third_eye.user_location_map WHERE '+ key +' = ' + id;
	
	console.log("Query : "+fetchQuery);
	return db.any(fetchQuery);
}

function removeULM(db, key, id) {
	var removeQuery = 'DELETE FROM third_eye.user_location_map  WHERE '+ key +' = ' + id;
	console.log("Query : "+removeQuery);
	return db.none(removeQuery);
}

function insertUSM(db, usm){	
	var insertQuery='INSERT INTO third_eye.user_stream_map(user_id, stream_id) '+
	'VALUES (${user_id}, ${stream_id})';
	return db.none(insertQuery,usm);	
}

function fetchUSM(db, key, id) {
	var fetchQuery = 'SELECT * FROM third_eye.user_stream_map  WHERE '+ key +' = ' + id;
	
	console.log("Query : "+fetchQuery);
	return db.any(fetchQuery);
}

function removeUSM(db, key, id) {
	var removeQuery = 'DELETE FROM third_eye.user_stream_map  WHERE '+ key +' = ' + id;
	console.log("Query : "+removeQuery);
	return db.none(removeQuery);
}

module.exports = {
	insertMapULM: insertULM,
	fetchMapULM: fetchULM,
	deleteMapULM: removeULM,
	insertMapUSM: insertUSM,
	fetchMapUSM: fetchUSM,
	deleteMapUSM: removeUSM
};
