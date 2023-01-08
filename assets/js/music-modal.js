// TODO: remove all highlighted notes!
// GLOBAL variables
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
let musicErrorModalEl = document.querySelector('#music-error-modal');

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
let closeErrorModalBtnEl = document.querySelector("#music-error-close-button"); 
// console.log(closeMusicBtnEl); //used for debugging
var musicRadioEl = document.querySelector("#music-radio-buttons");
// console.log(musicRadioEl); //used for debugging

// WORKING! DESCRIPTION: Function - brings up music modal dialog 
let openMusicModalFnc = function(){
    musicModalEl.classList.remove('hidden');
    console.log("openMusicModalFnc is reading"); //used for debugging
    musicRadioEl.addEventListener("click", userSelectionFnc);
    $('input[name="search-choice"]').attr('checked', false);
    $('#genre-fieldset').addClass("hidden");
    $('#artist-fields').addClass("hidden");
    $('#artist-value').val(""); //clears search value
    $('#user-genre').val(""); //clears search value
    $('#music-search-results').addClass("hidden");
    $('#music-search-results').val(""); //clears results 
    
};

//COMPLETE! DESCRIPTION: function to close music modal 
let closeMusicModalFnc = function () { 
    musicModalEl.classList.add('hidden');
    console.log("closeMusicModalFnc is reading"); //used for debugging
};

//DESCRIPTION: function to create API parameters based on user preferences //FIXME: not reading error message!
let userSelectionFnc = function () {

    let userRadioChoice = $("input[name='search-choice']:checked").val();

    if  (typeof userRadioChoice == "undefined"){
    console.log("help!");

        musicErrorModalEl.classList.remove("hidden");
        $("#music-error-modal-text").text("Please select a search criteria");//FIXME: this is not being triggered.
        return;
    }
    if (userRadioChoice == "artist"){
        // console.log("radioChoice - Artist"); //used for debugging
        apiSearchValue = $("#artist-search").val();
        // console.log(apiSearchValue); //used for debugging
        artistSearchEl.classList.remove('hidden');

    } 
    else if (userRadioChoice == "genre"){
        apiSearchValue = $("#genre-search").val();
        genreSearchEl.classList.remove('hidden');

    }

};

//COMPLETE! DESCRIPTION: function calling API - using musicbrainz API
let callMusicApiFnc = function (){
    userSearchValue = $("#artist-value").val() || $("#genre-value").val(); 
    // console.log("userSearchValue within callMusicApiFnc: " + userSearchValue); //used for debugging    
    let musicApi = musicBaseApi + apiSearchValue + "/?query=" + apiSearchValue + ":" + userSearchValue + "&fmt=json";
    console.log(musicApi); //used for debugging
            
    if (apiSearchValue == "genre"){
        let errorMessage = "We are still working on sourcing our Genre information. Try searching an artist.";
        displayErrorModalFnc(errorMessage);        
    }
    else {
        fetch(musicApi, {userAgent})
            .then (function (response){
                response.json().then(function (data) {
                    console.log(data); //used for debugging 
                if (response.ok) {
                    let artistIdData = data.artists[0].id;
                    localStorage.setItem("artist_id", JSON.stringify(artistIdData));
                    // console.log("from fetch - artistID: " + artistIdData); //used for debugging
                    artistId = JSON.parse(localStorage.getItem("artist_id"));
                    // console.log("artistID from within fetch (post parsing): " + artistId); //used for debugging 
                    displayArtistAlbumListFnc();
                }
                else{
                    let errorMessage = "Error location: display fetch results";
                    displayErrorModalFnc(errorMessage);
                }
                });
            })
            .catch (function (error) {
                let errorMessage = "Error location: fetch not possible";
                displayErrorModalFnc(errorMessage);
            });
        console.log("music API fetch is reading"); //used to confirm function is reading
    }
};

//DESCRIPTION: function to display artist album - using musicbrainz API
let displayArtistAlbumListFnc = function() {
    // console.log("inside displayArtistAlbumListFnc" ); //used for debugging
    // console.log("artistID from within displayArtistAlbumListFnc: " + artistId); //used for debugging
    let artistAlbumListApi = musicBaseApi + "release-group?" + apiSearchValue + "=" + artistId + "&type=album" + "&fmt=json";
    // console.log(artistAlbumListApi); //used for debugging 

    fetch(artistAlbumListApi, {userAgent})
        .then (function (response){
            response.json().then(function (data) {
                console.log(data); //used for debugging 
                if (response.ok) {
                    let releaseGroups = data["release-groups"]; 
                    // console.log(releaseGroups); //used for debugging
                    let albumList = [];
                    let albumId = [];
                    for (var i = 0; i < releaseGroups.length; i++) {
                        albumList.push(releaseGroups[i].title);
                        albumId.push(releaseGroups[i]["primary-type-id"]);
                    }
                    // console.log(albumList); // used for debugging
                    console.log(albumId); // used for debugging
                    console.log(albumId[0]); //used for debugging 
                    window.albumId = albumId[0]
                    let albumListEl = document.createElement("p");
            let musicSearchResultsEl = document.querySelector("#music-search-results")
            musicSearchResultsEl.classList.remove('hidden');
            albumListEl.textContent = albumList;
            let musicTableEl = document.createElement("table");
            for (var i = 0; i < albumList.length; i++) {
                // creating table html for albums to be entred into 
                let mtr = document.createElement("tr");
                let mtd1 = document.createElement("td");
                let mtd2 = document.createElement("td");
                let mtd3 = document.createElement("td");
                let mtd4 = document.createElement("td");

                //first column = album icon from font awesome.
                mtd1.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';
                mtd1.classList.add("pr-2");
                // mtd1.innerHTML = '<i class="fa-solid fa-music"></i>'; //TODO: icon for tracks.

                //TODO: add saved styling

                //second column = artist name 
                mtd2.classList.add("text-lg");
                mtd2.innerHTML = albumList[i];

                //second column hover styling = grey background + tooltip for instructions
                mtd2.classList.add("hover:bg-gray-300");
                mtd2.classList.add("rounded-lg");
                mtd2.classList.add("cursor-pointer");
                mtd2.setAttribute("data-bs-toggle","tooltip");
                mtd2.setAttribute("title", "Click to see album tracks.");

                //TODO: add saved styling
                //Event listener to list tracks once album name is clicked TODO: create function!
                mtd2.addEventListener("click", displayTracksFnc);

                //third column = img icon from font awesome. User to click to display album artwork
                //font awesome picture icon
                mtd3.innerHTML = '<i class="fa-solid fa-image"></i>';
                mtd3.classList.add("cursor-pointer");
                mtd3.classList.add("pr-2");
                //add tooltip so when you hover it gives instructions 
                mtd3.setAttribute("data-bs-toggle","tooltip");
                mtd3.setAttribute("title", "Click to view album artwork.");

                //TODO: add saved styling 
                //Event listener to list tracks once album name is clicked TODO: create function!
                mtd3.addEventListener("click", displayArtworkFnc);

                //fourth column = save/tick icon from font awesome depending on whether album is saved.
                //TODO: add saved styling [if function/else]
                mtd4.innerHTML = '<i class="far fa-save"></i>';
                mtd4.classList.add("cursor-pointer");
                //add tooltip so when hover instructions are displayed
                mtd4.setAttribute("data-bs-toggle","tooltip");
                mtd4.setAttribute("title", "Click to save full album.");

                //Event listener to save album when save icon clicked TODO: create function!
                mtd4.addEventListener("click", saveAlbumFnc);

                //add all colums to each row
                mtr.appendChild(mtd1);
                mtr.appendChild(mtd2);
                mtr.appendChild(mtd3);
                mtr.appendChild(mtd4);
                //add row to table
                musicTableEl.appendChild(mtr);
            }
            //create scrollable element around results
            musicSearchResultsEl.classList.add("h-full");
            musicSearchResultsEl.classList.add("max-h-full");
            //only scrollable on y axis
            musicSearchResultsEl.classList.add("overflow-y-auto");
            musicSearchResultsEl.classList.add("max-w-full");
            //add table to search results
            musicSearchResultsEl.appendChild(musicTableEl);
            }
            });
        })
};

//DESCRIPTION: function to display selected album tracks - using musicbrainz API
//TODO: create function!
let displayTracksFnc = function(){
console.log("displayTracksFnc is reading");
let testAPI = "https://musicbrainz.org/ws/2/release-group/a73cecde-0923-40ad-aad1-e8c24ba6c3d2?inc=aliases%2Bartist-credits%2Breleases&fmt=json"
fetch (testAPI)
    .then((response) => response.json())
    .then((data) => console.log(data)) //used to confirm API fetch request works.
};

//DESCRIPTION: function to display artwork - using musicbrainz API
//TODO: create function!
let displayArtworkFnc = function(){
    console.log("displayArtworkFnc is reading");

    
    // fetch ("http://coverartarchive.org/release/f529b476-6e62-324f-b0aa-1f3e33d313fc")
    fetch ("https://coverartarchive.org/release/"+window.albumId)
    .then((response) => response.json())
    .then((data) => console.log(data)) //used to confirm API fetch request works.    
};

//DESCRIPTION: function to display artwork - using musicbrainz API
//TODO: create function!
let saveAlbumFnc = function(){
    console.log("saveAlbumFnc is reading");
};

let displayErrorModalFnc = function(message){
    let musicErrorModalEl = document.querySelector('#music-error-modal');
    musicErrorModalEl.classList.remove("hidden");
    $("#music-error-modal-text").text(message);
};

let closeErrorModalFnc = function(){
    musicErrorModalEl.classList.add("hidden");
};

let displayRandomErrorModalFnc = function(){
    let musicErrorModalEl = document.querySelector('#music-error-modal');
    musicErrorModalEl.classList.remove("hidden");
    $("#music-error-modal-text").text("We are still working on Music Randomizer. Try searching an artist.");
};

//Event listeners
selectMusicBtnEl.addEventListener("click", openMusicModalFnc);
closeMusicBtnEl.addEventListener("click", closeMusicModalFnc);
closeErrorModalBtnEl.addEventListener("click", closeErrorModalFnc);
musicSearchBtnEl.addEventListener("click", callMusicApiFnc);
musicRandomBtnEl.addEventListener("click", displayRandomErrorModalFnc);

//temporary code for api functions.
// .then((response) => response.json())
// .then((data) => console.log(data)) //used to confirm API fetch request works.
//     if (response.ok){