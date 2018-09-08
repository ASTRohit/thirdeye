var promise = require('bluebird');
var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')
var pgPromise = pgp(options);
var db = pgPromise('postgres://ehtqkppspslltn:06705a8ec4fdc5297e1746abca20e207c70bfe3d57c1e73d291d516ded4340d4@ec2-54-247-123-231.eu-west-1.compute.amazonaws.com:5432/dftmt8u3vlhos6')

module.exports = {
	database: db
}