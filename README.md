# movieApp

This is a single page website powered by NodeJs, Express, Socket.io, and ReactJS which displays a list of movies based on a search parameter, defaulting to "Batman". The list includes the title, year of release, movie poster and an interactive rating display which is persisted in the users browser and is paginated to display only ten movies per page.

## Installation
In order to run this project, you will need to install NodeJS and NPM.
After these are installed, you will need run npm install because the node modules are not included in the repo.
After the dependencies are installed, npm run-script run will start the application and it runs on localhost on port 4444.

## Usage
After running npm start, the website will be available at localhost:4444.
If you wish to search for movies other than Batman movies, you can, but who really wants to do that?
If you insist, you can do so by passing a url parameter s={search term}, ex: localhost:4444/?s=Batman