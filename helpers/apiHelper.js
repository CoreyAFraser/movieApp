var request      = require('request');
var MongoClient  = require('mongodb').MongoClient;
var assert 		 = require('assert');
var config 		 = require('../configs/config');
var app			 = require('../app');

module.exports = {
  search: function(searchTerm, page, callback) {
  	var url = "http://www.omdbapi.com/?s=" + searchTerm + "&page=" + page;
  	console.log("Calling " + url)
  	request(url, function(error, response, result){	
  		if(error) {
  			callback(error, response);
  		}
  		var json = JSON.parse(result);
  		var searchResults = json.Search;
  		for(var movie in searchResults) {
  			searchResults[movie].rating = 0;
  		}
  		json.Search = searchResults;
  		if(callback) {
  		  callback(json);
  		}
  // 		MongoClient.connect(config.mongoDb.url, function(err, db) {
	 //      assert.equal(null, err);
		//     console.log("Connected correctly to server to write to DB");
		// 	var collection = db.collection(config.mongoDb.name);
		// 	collection.insertMany(
		// 		searchResults, 
		// 		function(err, result) {
		// 			console.log(searchResults.length);
		// 			assert.equal(searchResults.length, result.insertedCount);
		// 		    db.close();
		// 			res.send(json);
		// 		}
		// 	);
		// });			
	});	  	
  }
};