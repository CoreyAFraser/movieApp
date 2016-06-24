var request      	= require('request');
var fs      	 	= require('fs');
var app			 	= require('../app');
var imageDownloader = require('./imageDownloader');

var count = 0;
var searchResults;
var json;
var poster;

function ifDoneDownloadingImagesReturnResults(callback) {
	count++;
	if(count >= searchResults.length) {
		count = -2;
		json.Search = searchResults;
		if(callback) {
			console.log("Returning Results");
			callback(json);
		}
	}
}

module.exports = {
  search: function(user, callback) {
  	count = 0;
  	json = {};
  	searchResults = [];
  	poster = '';
  	var url = "http://www.omdbapi.com/?s=" + user.searchTerm + "&page=" + user.selectedPage;
  	
  	console.log("Calling " + url)
  	request(url, function(error, response, result){	
  		if(error) {
  			callback(error, response);
  		}
  		json = JSON.parse(result);
  		searchResults = json.Search;
  		for(var movie in searchResults) {
	  		searchResults[movie].rating = 0;
	  		poster = searchResults[movie].Poster;
	  		if(poster != 'N/A') {
		 		poster = poster.substring(0, poster.length - 7) + ".jpg";
		 		searchResults[movie].Poster = './posters/' + searchResults[movie].imdbID + ".jpg";
		  		try {
				    fs.accessSync(searchResults[movie].Poster, fs.F_OK);
				    ifDoneDownloadingImagesReturnResults(callback);
				} catch (e) {
				    imageDownloader.downloadPoster(poster, searchResults[movie].Poster, function() {
				 		ifDoneDownloadingImagesReturnResults(callback);
				  	});
				}	  			
		  	} else {
		  		searchResults[movie].Poster = './views/images/posterNotFound.jpg';
		  		ifDoneDownloadingImagesReturnResults(callback);
		  	}
  		}		
	});	  	
  }
};