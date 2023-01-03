// global variables
//API variables
let musicApi = 'https://api.deezer.com/version/service/id/method/?parameters';
let musicApiFormat = '&output=json';


//modal variables
let musicModalEl = document.querySelector('#music-modal');
let musicSearchResultsEl = document.querySelector('#music-search-results'); 
let musicImageEl = document.querySelector('#music-image'); 

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







//Event listeners
selectMusicBtnEl.addEventListener("click", musicSelectionFnc);
closeMusicBtnEl.addEventListener("click", closeMusicModalFnc);





