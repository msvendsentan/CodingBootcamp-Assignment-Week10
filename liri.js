require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var twitterparams = {screen_name: "Michael79766623"};

var userCommand = process.argv[2];
var query = process.argv.slice(3).join(" ");

var commandList = {
    "my-tweets": function() {
        client.get('statuses/user_timeline', twitterparams, function(error, tweets, response) {
            if (!error) {
                console.log("Most recent tweets:");
                fs.appendFile("log.txt", "my-tweets\r\n\r\n", function(err) {});
                tweets.forEach(function(element) {
                    console.log(element.text);
                    console.log(element.created_at);
                    console.log("----------------------");
                    fs.appendFile("log.txt", 
                        element.text + "\r\n" +
                        element.created_at + "\r\n" +
                        "-----------\r\n", 
                        function(err) {}
                    );
                });
                fs.appendFile("log.txt", "=============\r\n\r\n", function(err) {});
            } else {
                console.log(error);
            }
        });
    },
    "spotify-this-song": function(query) {
        if (query) {
            spotify.search({ type: "track", query: query, }, function(error, data) {
                if (!error) {
                    console.log("The song's artist is: " + data.tracks.items[0].artists[0].name);
                    console.log("The song's name is: " + data.tracks.items[0].name);    
                    console.log("The song's preview link is: " + data.tracks.items[0].external_urls.spotify);                    
                    console.log("The song's album is: " + data.tracks.items[0].album.name);
                    fs.appendFile("log.txt", 
                        "spotify-this-song " + query + "\r\n\r\n" +
                        "The song's artist is: " + data.tracks.items[0].artists[0].name + "\r\n" + 
                        "The song's name is: " + data.tracks.items[0].name + "\r\n" +
                        "The song's preview link is: " + data.tracks.items[0].external_urls.spotify + "\r\n" +
                        "The song's album is: " + data.tracks.items[0].album.name + "\r\n" +
                        "=============\r\n\r\n", 
                        function(err) {}
                    );
                } else {
                    console.log(error);
                }
            });
        } else {
            console.log("Please type a song name after the spotify-this-song command!");
        }
    },
    "movie-this": function(query) {
        if (query) {
            request("http://www.omdbapi.com/?t=" + query.replace(/\s/g, "+") + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
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
                    fs.appendFile("log.txt", 
                        "movie-this " + query + "\r\n\r\n" + 
                        "The movie's release year is: " + JSON.parse(body).Year + "\r\n" + 
                        "The movie's IMDB rating is: " + JSON.parse(body).imdbRating + "\r\n" + 
                        "The movie's Rotten Tomatoes rating is: " + rtobject.Value + "\r\n" + 
                        "The movie's country of production is: " + JSON.parse(body).Country + "\r\n" + 
                        "The movie's language is: " + JSON.parse(body).Language + "\r\n" + 
                        "The movie's plot is: " + JSON.parse(body).Plot + "\r\n" + 
                        "The movie's actors are: " + JSON.parse(body).Actors + "\r\n" + 
                        "=============\r\n\r\n", 
                        function(err) {}
                    );
                } else {
                    console.log(error);
                }
            });
        } else {
            console.log("Please type a movie name after the movie-this command!");
        }
    },
    "do-what-it-says": function() {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (!error) {
                var randomCommand = data.split(",");
                if (commandList.hasOwnProperty(randomCommand[0])) {
                    commandList[randomCommand[0]](randomCommand[1].replace(/['"]+/g, ""));
                }

            } else {
                return console.log(error);
            }
        })
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
    commandList[userCommand](query);
} else if (userCommand) {
    console.log("Please use a proper command. Type \"node liri.js help\" to see a list of commands.");
} else {
    console.log("Welcome to liri.js! Make sure you've run npm install. Type \"node liri.js help\" to see a list of commands.");
}