// TODO: remove all highlighted notes!
// global variables
//API variables
let apiSearchValue = "";
let userSearchValue = "";
// MusicBrainz API:
let musicBaseApi = "https://musicbrainz.org/ws/2/";
let userAgent = "Pumping Party Planner/1.0.0 (https://caoimhejyoti.github.io/pumping-party-planner)";

//modal variables
let musicModalEl = document.querySelector('#music-modal');
let musicSearchResultsEl = document.querySelector('#music-search-results'); 
let musicImageEl = document.querySelector('#music-image');
let artistSearchEl = document.querySelector('#artist-fields');
let genreSearchEl = document.querySelector('#genre-fields');

//local storage variables
let artistId = JSON.parse(localStorage.getItem("artist_id"));


//Button variables
let selectMusicBtnEl = document.querySelector(".music-select");
// console.log(selectMusicBtnEl); //used for debugging
let musicSearchBtnEl = document.querySelector("#music-search");
// console.log(musicSearchBtnEl); //used for debugging
let musicRandomBtnEl = document.querySelector("#music-randomize");
// console.log(musicRansdomBtnEl); //used for debugging
let closeMusicBtnEl = document.querySelector("#close-music-modal"); 
// console.log(closeMusicBtnEl); //used for debugging
var musicRadioEl = document.querySelector("#music-radio-buttons");
// console.log(musicRadioEl); //used for debugging

// WORKING! DESCRIPTION: Function - brings up music modal dialog TODO: add next function trigger
let openMusicModalFnc = function(){
    musicModalEl.classList.remove('hidden');
    console.log("openMusicModalFnc is reading"); //used for debugging
    musicRadioEl.addEventListener("click", userSelectionFnc);
    $('input[name="search-choice"]').attr('checked', false);
    $('#genre-fields').addClass("hidden");
    $('#artist-fields').addClass("hidden");
    $('#artist-fields').val(""); //clears search fields
    // $('#genre-fields').val(""); //clears search fields
    
};

//WORKING! DESCRIPTION: function to close music modal 
let closeMusicModalFnc = function () { 
    musicModalEl.classList.add('hidden');
    console.log("closeMusicModalFnc is reading"); //used for debugging
};

// DESCRIPTION: function to create API parameters based on user preferences
let userSelectionFnc = function () {

    let userRadioChoice = $("input[name='search-choice']:checked").val();

    if  (typeof userRadioChoice == "undefined"){
        // alert("Please select either Genre or Artist"); FIXME: make this a modal - Helen has started. 
        return;
    }
    if (userRadioChoice == "artist"){
        // console.log("radioChoice - Artist"); //used for debugging
        apiSearchValue = $("#artist-search").val();
        // console.log(apiSearchValue); //used for debugging
        artistSearchEl.classList.remove('hidden');

    } 


};

// DESCRIPTION: function calling API - using musicbrainz API
let callMusicApiFnc = function (){
    userSearchValue = $("#artist-value").val(); //FIXME: multiple words need to be separated by a - not a space. 
    console.log("userSearchValue within callMusicApiFnc: " + userSearchValue); //used for debugging WORKING!    
    let musicApi = musicBaseApi + apiSearchValue + "/?query=" + apiSearchValue + ":" + userSearchValue + "&fmt=json";
    console.log(musicApi); //used for debugging WORKING!
    // let userAgent = "Pumping Party Planner/1.0.0 (https://caoimhejyoti.github.io/pumping-party-planner)";
        
    fetch(musicApi, {userAgent}) //WORKING!
        .then (function (response){
            response.json().then(function (data) {
                console.log(data); //used for debugging 
            if (response.ok) {
                let artistIdData = data.artists[0].id;
                localStorage.setItem("artist_id", JSON.stringify(artistIdData));
                console.log("from fetch - artistID: " + artistIdData); //used for debugging WORKING!
                artistId = JSON.parse(localStorage.getItem("artist_id"));
                console.log("artistID from within fetch (post parsing): " + artistId); //used for debugging WORKING!

                displayArtistTrackListFnc();
            }
            else{
                let errorMessage = "Error location: display fetch results";
                displayErrorModal(errorMessage);
            }
            });
        })
        .catch (function (error) {
            let errorMessage = "Error location: fetch not possible";
            displayErrorModal(errorMessage);
        });
        console.log("music API fetch is reading"); //used to confirm function is reading
        
        // .then((response) => response.json())
        // .then((data) => console.log(data)) //used to confirm API fetch request works.
        //     if (response.ok){
};



let displayArtistTrackListFnc = function() {
    console.log("inside displayArtistTrackListFnc" ); //WORKING! 
    console.log("artistID from within displayArtistTrackListFnc: " + artistId); //WORKING! used for debugging
    let artistAlbumListApi = musicBaseApi + "release-group?" + apiSearchValue + "=" + artistId + "&type=album" + "&fmt=json";
    // let artistTrackListApi = musicBaseApi + "release-group?" + apiSearchValue + "=" + artistId + "&type=single" + "&fmt=json";
    // let artistTrackListApi = musicBaseApi + "release?track?" + apiSearchValue + "=" + artistId + "&fmt=json";
    console.log(artistAlbumListApi); //used for debugging 

    fetch(artistAlbumListApi, {userAgent})
        // .then((response) => response.json())
        // .then((data) => console.log(data)) //used to confirm API fetch request works.
        .then (function (response){
            response.json().then(function (data) {
                console.log(data); //used for debugging 
            if (response.ok) {
                let releaseGroups = data["release-groups"]; //not able to read the release-groups?
                console.log(releaseGroups);
                let albumList = [];
                for (var i = 0; i < releaseGroups.length; i++) {
                albumList.push(releaseGroups[i].title);

                console.log(albumList); // used for debugging
            }
            let updatedAlbumList = [];
            updatedAlbumList = albumList[0];
            let albumListEl = document.createElement("p");
            let musicSearchResultsEl = document.querySelector("#music-search-results")
            musicSearchResultsEl.classList.remove('hidden');
            console.log(updatedAlbumList);
            albumListEl.textContent = updatedAlbumList.forEach(element => element.textContent);
            musicSearchResultsEl.appendChild(albumListEl);
            }
        });
        })
}




//Event listeners
selectMusicBtnEl.addEventListener("click", openMusicModalFnc);
closeMusicBtnEl.addEventListener("click", closeMusicModalFnc);
musicSearchBtnEl.addEventListener("click", callMusicApiFnc);



// Access to fetch at 'https://api.deezer.com/artist/drake#access_token=frGsjr7kRQyN7XnSROHGZpqWPxulNpWLyjSg3wMBtMQYxKdiP7w&' from origin 'http://127.0.0.1:5502' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
