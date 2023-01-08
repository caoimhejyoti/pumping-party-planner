const clientId = 'daac8cdebd00499b81cecfb184e25364';
const clientSecret = '3996949e2e3b47858dab798103af04b7';
 
const getKey = async () => {
    let result = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("------------------------------------");
        console.log("First fetch returning the access key");
        console.log("------------------------------------");
        console.log(data.access_token);
        getCats(data.access_token);
    })
};

function getCats(token) {
    fetch("https://api.spotify.com/v1/browse/categories?locale=sv_US" , {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("-----------------------------------------");
        console.log("Second fetch req returning spofity genres");
        console.log("-----------------------------------------");
        let cats = data.categories.items;
        let genreId = cats[0].id;
        for(let el in cats) {
            console.log(cats[el].name);
        };
        getAlbumns(token, genreId);
    }); 
};

function getAlbumns(token, genreId) {
    fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=10`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("-----------------------------------------------");
        console.log("Third fetch returning albumns from chosen genre");
        console.log("-----------------------------------------------");
        let playlists = data.playlists.items;
        let albumnId = playlists[0].id;
        for(let el in playlists) {
            console.log(playlists[el].name);
        };
        getSongs(token, albumnId);
    });
};

function getSongs(token, albumnId) {
    fetch(`https://api.spotify.com/v1/playlists/${albumnId}/tracks`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("---------------------------------------------------");
        console.log("Fourth fetch req returning the songs from the chosen albumn");
        console.log("---------------------------------------------------");
        let songs = data.items;
        let songId = songs[0].track.id;
        for(let el in songs) {
            console.log(songs[el].track.name);
        }
        getSongInfo(token, songId);
    });
}

function getSongInfo(token, songId) {
    fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("---------------------------------------------------");
        console.log("Fifth fetch req returning all the info for a given song");
        console.log("---------------------------------------------------");
        console.log(data);
    });
}

getKey();    
 




    // "https://api.spotify.com/v1/browse/categories"
    // "https://api.spotify.com/v1/browse/categories/{category_id}/playlists"
    // "https://api.spotify.com/v1/playlists/{playlist_ID}/tracks"
    // "https://api.spotify.com/v1/tracks/{id}"

