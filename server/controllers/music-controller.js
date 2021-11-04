var SpotifyWebApi = require("spotify-web-api-node");
const { keys } = require(appRoot + "/config/auth.js");

exports.searchMusic = async (req, res) => {
  var spotifyApi = new SpotifyWebApi({
    clientId: keys["spotify"].clientID,
    clientSecret: keys["spotify"].clientSecret,
  });

  spotifyApi.clientCredentialsGrant().then(
    async (data) => {
      console.log("The access token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      const result = await spotifyApi.searchTracks("Notes pour trop tard");
      await spotifyApi.pause();
      res.json(result);
    },
    (err) => {
      console.log("Something went wrong when retrieving an access token", err);
    }
  );
};
