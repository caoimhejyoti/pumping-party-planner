// global variables
//API variables
// deezer authorisation code = frafad6eb53d6a7c414cb7fd3bfb89b3
// deezer APP ID = 575722
// deezer secret Key = 74669ac83343e74a3ad8b7496a918e3e FIXME: remove before release
// server side deezer access token = frGsjr7kRQyN7XnSROHGZpqWPxulNpWLyjSg3wMBtMQYxKdiP7w @ 13:00 - 05.01.23 - with 3600s remaining
// client-side deezer access token = https://caoimhejyoti.github.io/pumping-party-planner/#access_token=frGsjr7kRQyN7XnSROHGZpqWPxulNpWLyjSg3wMBtMQYxKdiP7w&expires=2441
let musicApiAccessToken = "frGsjr7kRQyN7XnSROHGZpqWPxulNpWLyjSg3wMBtMQYxKdiP7w";
// let musicApi = 'https://api.deezer.com/version/service/id/method/?parameters';
let baseMusicApi = 'https://api.deezer.com/';
let musicApiFormat = '&output=json';
let genreAPI = 'https://api.deezer.com/genre/'; //each genre has an Id which must be added to the url. The resulting object has a name as well as an id. use name to connect to the correct genre.
let artistAPI = 'https://api.deezer.com/artist/'; //artists can be added by name to the url
let apiSearchValue = "";
let userSearchValue = "";

//modal variables
let musicModalEl = document.querySelector('#music-modal');
let musicSearchResultsEl = document.querySelector('#music-search-results'); 
let musicImageEl = document.querySelector('#music-image');
let artistSearchEl = document.querySelector('#artist-fields');
let genreSearchEl = document.querySelector('#genre-fields');



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

// DESCRIPTION: function calling API
let callMusicApiFnc = function (){
    userSearchValue = $("#artist-value").val(); //FIXME: multiple words need to be separated by a - not a space. 
    console.log("userSearchValue within callMusicApiFnc: " + userSearchValue); //used for debugging WORKING!    
    let musicApi = "https://api.deezer.com/search/"  + apiSearchValue + "/?q=" + userSearchValue + "&index=0&limit=2&output=json"; //+ "#access_token=frGsjr7kRQyN7XnSROHGZpqWPxulNpWLyjSg3wMBtMQYxKdiP7w&"
    console.log(musicApi); //used for debugging WORKING!
    fetch(musicApi)
        .then((response) => response.json())
        .then((data) => console.log(data));
        // .then(function(response){
        //     console.log(response); //used for debugging FIXME: not currently got the correct permissions. Error Code 200. Read for debugging: https://developers.deezer.com/api/oauth
        // });
};



//Event listeners
selectMusicBtnEl.addEventListener("click", openMusicModalFnc);
closeMusicBtnEl.addEventListener("click", closeMusicModalFnc);
musicSearchBtnEl.addEventListener("click", callMusicApiFnc);



// Access to fetch at 'https://api.deezer.com/artist/drake#access_token=frGsjr7kRQyN7XnSROHGZpqWPxulNpWLyjSg3wMBtMQYxKdiP7w&' from origin 'http://127.0.0.1:5502' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
