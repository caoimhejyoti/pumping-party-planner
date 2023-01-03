// global variables
//API variables
let musicApi = 'https://api.deezer.com/version/service/id/method/?parameters';
let musicApiFormat = '&output=json';
let genreAPI = 'https://api.deezer.com/genre/'; //each genre has an Id which must be added to the url. The resulting object has a name as well as an id. use name to connect to the correct genre.
let artistAPI = 'https://api.deezer.com/artist/'; //artists can be added by name to the url
let apiSearchValues = "";

//modal variables
let musicModalEl = document.querySelector('#music-modal');
let musicSearchResultsEl = document.querySelector('#music-search-results'); 
let musicImageEl = document.querySelector('#music-image');
let userRadioChoice = $("input[name='search-options']:checked").val();
let musicSearchType = "";
let filterType = "";


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
let musicSelectionFnc = function(){
    musicModalEl.classList.remove('hidden');
    console.log("musicSelectionFnc is reading"); //used for debugging
};

//WORKING! DESCRIPTION: function to close music modal 
let closeMusicModalFnc = function () { 
    musicModalEl.classList.add('hidden');
    console.log("closeMusicModalFnc is reading"); //used for debugging
};

// DESCRIPTION: function to create API parameters based on user preferences
let userSelectionFnc = function () {

    let userRadioChoice = $("input[name='search-choice']:checked").val();
    let musicSearchType = "";
    let filterType = "";

    console.log(userRadioChoice);

    if  (typeof userRadioChoice == "undefined"){
        alert("Please select either Genre or Artist");
        return;
    }
    if (userRadioChoice == "artist"){
        console.log("radioChoice - Artist"); //used for debugging
        // apiSearchValues = $("#artist-search").val();
    } 
};

// DESCRIPTION: function calling API




//Event listeners
selectMusicBtnEl.addEventListener("click", musicSelectionFnc);
closeMusicBtnEl.addEventListener("click", closeMusicModalFnc);
musicSearchBtnEl.addEventListener("click", userSelectionFnc);




