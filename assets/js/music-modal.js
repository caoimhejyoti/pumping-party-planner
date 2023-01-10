// TODO: remove all highlighted notes!
// GLOBAL variables
//API variables
let apiSearchValue = "";
let userSearchValue = "";
// MusicBrainz API:
let musicBaseApi = "https://musicbrainz.org/ws/2/";
let userAgent = "Pumping Party Planner/1.0.0 (https://caoimhejyoti.github.io/pumping-party-planner)";

//modal variables
let userRadioChoice = "";
let musicModalEl = document.querySelector('#music-modal');
let musicSearchResultsEl = document.querySelector('#music-search-results'); 
let musicImageEl = document.querySelector('#music-image');
let artistSearchEl = document.querySelector('#artist-fields');
let genreSearchEl = document.querySelector('#genre-fields');
let musicErrorModalEl = document.querySelector('#music-error-modal');
let musicImgContainerEl = document.querySelector("#music-image");
let musicImgEl = document.createElement("img");

//local storage variables
let musicAlreadySaved;
let artistId = JSON.parse(localStorage.getItem("artist_id"));
let storedMusic;

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

// DESCRIPTION: Function - brings up music modal dialog 
let openMusicModalFnc = function(){
    musicModalEl.classList.remove('hidden');
    musicImgContainerEl.classList.add('hidden');
    genreSearchEl.classList.add('hidden');
    artistSearchEl.classList.add('hidden');
    musicSearchResultsEl.classList.add('hidden');
    musicRadioEl.addEventListener("click", userSelectionFnc);
    $('input[name="search-choice"]').attr('checked', false);
    $('#artist-value').val(""); //clears search value
    $('#genre-value').val(""); //clears search value
    $('#music-search-results').val(""); //clears results 
    
    console.log("openMusicModalFnc is reading"); //used for debugging
};

//DESCRIPTION: function to close music modal
let closeMusicModalFnc = function () { 
    removeAllPreviousChildren(musicImgContainerEl);
    musicModalEl.classList.add('hidden');
    console.log("closeMusicModalFnc is reading"); //used for debugging
    apiSearchValue = "";
};

//DESCRIPTION: function to create API parameters based on user preferences
let userSelectionFnc = function () {
    userRadioChoice = $("input[name='search-choice']:checked").val();
    // console.log(userRadioChoice);
    if (userRadioChoice == "artist"){
        musicSearchResultsEl.classList.add('hidden');
        genreSearchEl.classList.add('hidden');
        apiSearchValue = $("#artist-search").val();
        artistSearchEl.classList.remove('hidden');
    } 
    else if (userRadioChoice == "genre"){
        musicSearchResultsEl.classList.add('hidden');
        artistSearchEl.classList.add('hidden');
        apiSearchValue = $("#genre-search").val();
        genreSearchEl.classList.remove('hidden');
    }
    else {
        apiSearchValue = "";      
        return;
    }
};

//DESCRIPTION: function calling API - using musicbrainz API
let callMusicApiFnc = function (){
    userSearchValue = $("#artist-value").val() || $("#genre-value").val(); 
    let musicApi = musicBaseApi + apiSearchValue + "/?query=" + apiSearchValue + ":" + userSearchValue + "&fmt=json";
    console.log(musicApi); //used for debugging
    console.log(apiSearchValue); //used for debugging
    if (apiSearchValue == ""){
        let errorMessage = "Please select a search criteria";
        displayErrorModalFnc(errorMessage);        
    }
    else if (apiSearchValue == "genre"){
        let errorMessage = "We are still working on sourcing our Genre information. Try searching an artist.";
        displayErrorModalFnc(errorMessage);        
    }
    else if (apiSearchValue == "artist" && userSearchValue == ""){
        let errorMessage = "Please enter an " + apiSearchValue + "'s name.";
        displayErrorModalFnc(errorMessage);        
    }
    else if (apiSearchValue == "genre" && userSearchValue == ""){
        let errorMessage = "Please enter a " + apiSearchValue;
        displayErrorModalFnc(errorMessage);        
    }
    else {
        fetch(musicApi, {userAgent})
            .then (function (response){
                response.json().then(function (data) {
                    console.log(data); //used for debugging 
                if (response.ok) {
                    let artistIdData = data.artists[0].id;
                    let artistNameData = data.artists[0].name;
                    localStorage.setItem("artist_id", JSON.stringify(artistIdData));
                    // console.log("from fetch - artistID: " + artistIdData); //used for debugging
                    artistId = JSON.parse(localStorage.getItem("artist_id"));
                    // console.log("artistID from within fetch (post parsing): " + artistId); //used for debugging 
                    localStorage.setItem("artist_name", JSON.stringify(artistNameData));
                    artistName = JSON.parse(localStorage.getItem("artist_name"));
                    console.log(artistName); //used for debugging
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

//FIXME: causing bug - no data displayed. check if album already saved DESCRIPTION: function to display artist album - using musicbrainz API
let displayArtistAlbumListFnc = function() {
    let artistAlbumListApi = musicBaseApi + "release-group?" + apiSearchValue + "=" + artistId + "&type=album" + "&fmt=json";
    // console.log(artistAlbumListApi); //used for debugging 

    //remove any dynamically created elements from previous searches.
    removeAllPreviousChildren(musicSearchResultsEl);
    //clear search value
    $('#artist-value').val(""); 
    $('#genre-value').val(""); 
    
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
                        albumId.push(releaseGroups[i]["primary-type-id"]); //used when working on album artwork developments
                        console.log(releaseGroups[i].title);
                    }
                    // console.log(album);
                    // console.log(albumList); // used for debugging
                    // console.log(albumId); // used for debugging
                    // console.log(albumId[0]); //used for debugging 
                    // window.albumId = albumId[0] //used when working on album artwork developments
                    let albumListEl = document.createElement("p");
                    let musicSearchResultsEl = document.querySelector("#music-search-results")
                    musicSearchResultsEl.classList.remove('hidden');
                    albumListEl.textContent = albumList;
                    let musicTableEl = document.createElement("table");
                    for (var i = 0; i < albumList.length; i++) {
                        musicAlreadySaved = false;

                        //FIXME: causing bug - no data displayed. check if album already saved
                        if (storedMusic != null && storedMusic !== "") {
                            arrayMusic = JSON.parse(storedMusic);
                            console.log(arrayMusic.filter(e => e.album === releaseGroups[i].title));
                            if (arrayMusic.filter(e => e.album === releaseGroups[i].title).length !== 0) {
                                musicAlreadySaved = true;
                            }
                        }

                        // creating table html for albums to be entred into 
                        let mtr = document.createElement("tr");
                        let mtd1 = document.createElement("td");
                        let mtd2 = document.createElement("td");
                        let mtd3 = document.createElement("td");
                        let mtd4 = document.createElement("td");

                        //first column = album icon from font awesome.
                        mtd1.innerHTML = '<i class="fa-solid fa-compact-disc"></i>';
                        mtd1.classList.add("pr-2");
                        // mtd1.innerHTML = '<i class="fa-solid fa-music"></i>'; //icon for tracks when Pumping Party Planner is developed.

                        //gives icon API data
                        mtd1.setAttribute("artist", artistName);
                        mtd1.setAttribute("album-name", albumList[i]);

                        //style if previously saved - turn orange
                        if(musicAlreadySaved){
                            mtd1.classList.add("dark-orange");
                        }

                        //second column = artist name 
                        mtd2.classList.add("text-lg");
                        mtd2.innerHTML = albumList[i];

                        //second column hover styling = grey background + tooltip for instructions
                        mtd2.classList.add("hover:bg-gray-300");
                        mtd2.classList.add("rounded-lg");
                        mtd2.classList.add("cursor-pointer");
                        mtd2.classList.add("pr-2");
                        mtd2.setAttribute("data-bs-toggle","tooltip");
                        mtd2.setAttribute("title", "Click to see album tracks.");
                        //gives icon API data
                        mtd2.setAttribute("artist", artistName);
                        mtd2.setAttribute("album-name", albumList[i]);

                        //style if previously saved - turn orange
                        if(musicAlreadySaved){
                            mtd2.classList.add("dark-orange");
                        }

                        //Event listener to list tracks once album name is clicked - for future developments
                        mtd2.addEventListener("click", displayTracksFnc);

                        //third column = img icon from font awesome. User to click to display album artwork
                        //font awesome picture icon
                        mtd3.innerHTML = '<i class="fa-solid fa-image"></i>';
                        mtd3.classList.add("cursor-pointer");
                        mtd3.classList.add("pr-2");
                        //add tooltip so when you hover it gives instructions 
                        mtd3.setAttribute("data-bs-toggle","tooltip");
                        mtd3.setAttribute("title", "Click to view album artwork.");
                        mtd3.setAttribute("album-name", albumList[i]);

                        //style if previously saved - turn orange
                        if(musicAlreadySaved){
                            mtd3.classList.add("dark-orange");
                        }

                        //Event listener to list tracks once album name is clicked
                        mtd3.addEventListener("click", displayArtworkFnc);

                        //fourth column = save/tick icon from font awesome depending on whether album is saved.
                        //style if previously saved - turn orange
                        if(musicAlreadySaved){
                            mtd4.innerHTML = '<i class="fa-solid fa-check"></i>';
                            mtd4.classList.add("dark-orange");
                        }
                        else {
                        mtd4.innerHTML = '<i class="far fa-save"></i>';
                        mtd4.classList.add("cursor-pointer");
                        //add tooltip so when hover instructions are displayed
                        mtd4.setAttribute("data-bs-toggle","tooltip");
                        mtd4.setAttribute("title", "Click to save album name.");
                        //gives icon API data
                        mtd4.setAttribute("artist", artistName);
                        mtd4.setAttribute("album-name", albumList[i]);
                        //Event listener to save album when save icon clicked 
                        mtd4.addEventListener("click", saveAlbumFnc);
                        }

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
let displayTracksFnc = function(){
    let errorMessage = "We are still working on sourcing our track information. Please try again later!";
    displayErrorModalFnc(errorMessage);

    console.log("displayTracksFnc is reading"); //used to confirm function is reading
};

//DESCRIPTION: function to display artwork - using musicbrainz API
let displayArtworkFnc = function(){

    // Artwork development code:
    // musicImgEl.src = "assets/imgs/blank-img.png";
    // musicImgEl.classList.add('rounded-b-2xl');

    // musicImgContainerEl.appendChild(musicImgEl);
    // musicImgContainerEl.classList.add('mx-auto');
    // musicImgContainerEl.classList.add('my-auto');
    // musicImgContainerEl.classList.add('cocktail-border');
    // musicImgContainerEl.classList.add('p-0');
    // musicImgContainerEl.classList.add('ml-2');
    // musicImgContainerEl.classList.remove('hidden');

    let errorMessage = "We are still working on sourcing our Album Artwork. Please try again later!";
    displayErrorModalFnc(errorMessage);

    console.log("displayArtworkFnc is reading"); //used to confirm function is reading

};

//DESCRIPTION: function to display artwork - using musicbrainz API
function saveAlbumFnc (event){
    //Ensure no further events are triggered
    event.stopPropagation();
    //Determin which album was selected
    let chosenAlbum = event.currentTarget;
    // console.log(chosenAlbum); //used for debugging
    //Get album details
    let albumName = chosenAlbum.getAttribute("album-name");
    let artist = chosenAlbum.getAttribute("artist");
    let arrayMusic; 
    //get previously user stored details
    let storedMusic = localStorage.getItem("storedMusic"); 

    let currentMusic = {
        artist: artist,
        album: albumName
    };
    // if first time storing, create blank array and add to array
    if(storedMusic == null){
        arrayMusic = [currentMusic];
    }
    else{ 
        //when already stored.
        arrayMusic = JSON.parse(storedMusic);
        console.log(arrayMusic);
        if (arrayMusic.filter(e => e.album === albumName).length === 0) {
            arrayMusic.push(currentMusic);
        }
    }

    //store to local storage
    localStorage.setItem("storedMusic", JSON.stringify(arrayMusic));

    //trigger saved style to indicate item saved successfully
    $(`td[album-name='${albumName}']`).addClass("dark-orange");
    chosenAlbum.innerHTML = "<i class='fa-solid fa-check'></i>";

    console.log("saveAlbumFnc is reading"); //used to confirm function is reading
};

//DESCRIPTION: function to display error modal - called in various functions
let displayErrorModalFnc = function(message){
    let musicErrorModalEl = document.querySelector('#music-error-modal');
    musicErrorModalEl.classList.remove("hidden");
    $("#music-error-modal-text").text(message);
};

//DESCRIPTION: function to close error modal
let closeErrorModalFnc = function(){
    musicErrorModalEl.classList.add("hidden");
};

//DESCRIPTION: function to display error modal for randomize button.
let displayRandomErrorModalFnc = function(){
    let musicErrorModalEl = document.querySelector('#music-error-modal');
    musicErrorModalEl.classList.remove("hidden");
    $("#music-error-modal-text").text("We are still working on Music Randomizer. Try searching an artist.");
};

//DESCRIPTION: function to remove previously created children through searches.
function removeAllPreviousChildren(elem){
    while (elem.lastElementChild) {
        elem.removeChild(elem.lastElementChild);
    }
}

//Global Event listeners
selectMusicBtnEl.addEventListener("click", openMusicModalFnc);
closeMusicBtnEl.addEventListener("click", closeMusicModalFnc);
closeErrorModalBtnEl.addEventListener("click", closeErrorModalFnc);
musicSearchBtnEl.addEventListener("click", callMusicApiFnc);
musicRandomBtnEl.addEventListener("click", displayRandomErrorModalFnc);