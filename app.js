require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next) => res.render("index"));

app.get("/artist", (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            const artistResults = data.body.artists.items;
            console.log('The received data from the API: ', { artistResults });
            res.render("artist", { artistResults });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.id)
        .then(results => {
            const albumResults = results.body.items;
            console.log('Artist albums', { results: albumResults });
            res.render("albums", { results: albumResults });
        })
        .catch(err => console.log('The error while searching albums occurred: ', err));
});

app.get('/tracks/:id', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.id)
        .then(results => {
            const tracksResult = results.body.items;
            console.log('Albums Tracks', { results: tracksResult });
            res.render("tracks", { results: tracksResult });
        })
        .catch(err => console.log('The error while searching tracks occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
