# movieApp

This is a single page website powered by NodeJs, Express, Socket.io, and ReactJS which displays a list of movies based on a search parameter, defaulting to "Batman". The list includes the title, year of release, movie poster and an interactive rating display and is paginated to display only ten movies per page.
The ratings are derived from all users who have rated each movie and the combined ratings with the movie data are stored in a MongoDb.

## Installation
In order to run this project, you will need to install NodeJS, NPM and MongoDb.
After all of these are installed, you will need to start MongoDb and run npm install to install all of the node dependencies.
After the dependencies are installed, npm start will start the application and it runs on localhost on port 4444.

## Usage
After running npm start, the website will be available at localhost:4444.
If you wish to search for movies other than Batman movies, you can, but who really wants to do that?
If you insist, you can do so by passing a url parameter s={search term}, ex: localhost:4444/?s=Batman