require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var twitterparams = {screen_name: "Michael79766623"};

var userCommand = process.argv[2];

var commandList = {
    "my-tweets": function() {
        client.get('statuses/user_timeline', twitterparams, function(error, tweets, response) {
            if (!error) {
                console.log("Most recent tweets:")
                tweets.forEach(function(element) {
                    console.log(element.text);
                    console.log(element.created_at);
                    console.log("----------------------");
                });
            }
        });
    },
    "spotify-this-song": function() {

    },
    "movie-this": function() {
        var movie = process.argv.slice(3).join(" ");
        movie = movie.replace(/\s/g, "+");
        if (movie) {
            request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("The movie's title is: " + JSON.parse(body).Title);
                    console.log("The movie's release year is: " + JSON.parse(body).Year);
                    console.log("The movie's IMDB rating is: " + JSON.parse(body).imdbRating);
                    var rtobject = JSON.parse(body).Ratings.find(function(rating) {
                        return rating.Source == "Rotten Tomatoes";
                    });
                    console.log("The movie's Rotten Tomatoes rating is: " + rtobject.Value);
                    console.log("The movie's country of production is: " + JSON.parse(body).Country);
                    console.log("The movie's language is: " + JSON.parse(body).Language);
                    console.log("The movie's plot is: " + JSON.parse(body).Plot);
                    console.log("The movie's actors are: " + JSON.parse(body).Actors);
                }
            });
        } else {
            console.log("Please type a movie name after the movie-this command!");
        }
    },
    "do-what-it-says": function() {

    },
    "help": function() {
        console.log("Available commands:");
        console.log("my-tweets: shows my most recent tweets");
        console.log("spotify-this-song songname: shows song information");
        console.log("movie-this moviename: shows movie information");
        console.log("do-what-it-says: runs the commands in random.txt");
        console.log("help: shows this menu");
        
    }
}

if (commandList.hasOwnProperty(userCommand)) {
    commandList[userCommand]();
} else if (userCommand) {
    console.log("Please use a proper command. Type \"node liri.js help\" to see a list of commands.");
} else {
    console.log("Welcome to liri.js! Make sure you've run npm install. Type \"node liri.js help\" to see a list of commands.");
}