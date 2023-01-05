
//button variables
let selectCocktailBtnEl = document.querySelector(".cocktail-select");
let cocktailModalEl = document.querySelector("#cocktail-modal");
let searchButtonEl = document.querySelector("#search-button");
let searchResultsEl = document.querySelector("#search-results");
let resultsEl = document.querySelector("#results");
let searchImageEl = document.querySelector("#search-image");
var radioEl = document.querySelector("#radio-buttons");
var closeModalEl = document.querySelector("#close-modal");

//remove user selections
function clearInputFields() {
    $("#cocktail-name").val("");
    $("#cocktail-ingredient").val("");
}

//helper function - remove any child elements previously created dynamically
function removeAllChildren(elem){
    while (elem.lastElementChild) {
        elem.removeChild(elem.lastElementChild);
    }
}

//used when no ingredients were provied initailly from API
//call API with cocktailID
function getIngredients(event){
    //event.stopPropagation();
    console.log("inside getIngredients");
    let chosenImg = event.target;
    console.log(event.target.getAttribute('class'));
    let cocktailID = chosenImg.getAttribute("data-id");
    console.log("getIngredients id " + cocktailID);
    if (cocktailID != null) {
        callAPI("lookup", "i", cocktailID);
    }
    
}

//display image for cocktail using data-set values in clicked element eg src and cocktail name
function displayImage(event) {
    let chosenDrink = event.currentTarget;
    console.log(event.currentTarget.getAttribute('class'));
    //if no data-set values then clicked somewhere other than on the icon to display an cocktail
    //image ie somewhere else in the search-results element
    if (chosenDrink.getAttribute("data-name") == null) {
        return;
    }

    //get data-set values
    let cocktailName = chosenDrink.getAttribute("data-name");
    let imgValue = chosenDrink.getAttribute("data-img");
    let cocktailID = chosenDrink.getAttribute("data-id");
    let ingredients = chosenDrink.getAttribute("data-ingred");
    //remove any previously created elements
    removeAllChildren(searchImageEl);
    let imgEl = document.createElement('img');
    //pass data-set values to newly created image
    imgEl.setAttribute("src", imgValue);
    imgEl.setAttribute("data-id", cocktailID);
    imgEl.setAttribute("data-ingred", ingredients);
    //style image ensuring cursor is a "hand"
    //indicates its a clickable element
    imgEl.classList.add("rounded-b-2xl");
    imgEl.classList.add("cursor-pointer");
    //add tooltip thats displayed when you hover over element
    imgEl.setAttribute("data-bs-toggle","tooltip");
    imgEl.setAttribute("title", "Click to see ingredients.");    

    //display image and style it
    searchImageEl.classList.remove("hidden");
    searchImageEl.classList.add("w-32");
    searchImageEl.classList.add("mx-auto");
    searchImageEl.classList.add("my-auto");
    searchImageEl.classList.add("cocktail-border");
    searchImageEl.classList.add("p-0");

    //create element to hold cocktail title at top of image
    let pEl = document.createElement('p');
    pEl.classList.add("text-center");
    pEl.classList.add("text-xs");
    pEl.classList.add("p-2");
    pEl.innerHTML = cocktailName;
    //add title and image
    searchImageEl.appendChild(pEl);
    searchImageEl.appendChild(imgEl);
}

//ingredients are returned from API as separate strings (up to 15 of them).
//the corresponding measures are also returned as strings (up to 15)
//this function links the measures and ingredients and adds them to an array
//returns array
function getAllIngredients(dataObj){
   //input is just one cocktail object 
    let strIngredients = [];
    for (let i = 1; i < 15; i++) {
        //check if we have come to the first "null" value out of the 15 ingredient values
        //if so no more ingredients, so exit loop
         if (dataObj["strIngredient" + i] != null) {  
            //not all ingredients have a corresponding measure, so check for this
             if (dataObj["strMeasure" + i] != null) {
                 strIngredients.push(dataObj["strMeasure" + i] + " " + dataObj["strIngredient" + i]);
             } else {
                 strIngredients.push(dataObj["strIngredient" + i]);
             }
         } else {
             break;
         }
     }
     return strIngredients;
}

//display search results from API
//data is whats returned from the API
function displayData(data){
    //unhide the search-results element
    searchResultsEl.classList.remove("hidden");
    //let ulEl = document.createElement('ul');
    //let liEl;
    //let linkEl;
    let strIngredients = '';
    //get stored cocktails so we can use a different colour for these when displaying them
    let storedCocktails = localStorage.getItem("cocktails");
    let arrayCocktails;
    let blAlreadySaved;
    let pEl;

    //remove any previously created elements
    removeAllChildren(searchImageEl);
    removeAllChildren(searchResultsEl);

    //search-count displays the number of cocktails returned from API search
    //see if we already created the element previously
    pEl = document.getElementById("search-count");
    if (!pEl) {
        //style search-count element
        pEl = document.createElement("p");
        pEl.classList.add("text-sm");
        pEl.classList.add("font-bold");
        pEl.classList.add("block");
        pEl.classList.add("w-full");
        pEl.setAttribute("id", "search-count");
    }
    //set value of search count to display the number of cocktails returned from the search
    pEl.innerHTML = "Search Results - " + data.drinks.length + " cocktail(s) found";

    //create table to display search results
    var table = document.createElement('table');
    //loop through search results array and create row in table for each result
    for (var i = 0; i < data.drinks.length; i++){
        blAlreadySaved = false;
        //check if this cocktail was already saved and set boolead blAlreadySaved
        if (storedCocktails != null && storedCocktails != "") {
            arrayCocktails = JSON.parse(storedCocktails);
            if (arrayCocktails.filter(e => e.id === data.drinks[i].idDrink).length !== 0) {
                blAlreadySaved = true;
            }
        }

        var tr = document.createElement('tr');   
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        //extract ingredients from search results (match measure and ingredient)
        //join all ingredients into one string with each measure/ingredient pair
        //separated by #
        strIngredients = getAllIngredients(data.drinks[i]).join("#");

        //1st column in table - font awesome cocktail icon 
        td1.innerHTML ='<i class="fas fa-cocktail"></i>';

        //add data-set so these can be used if needed when icon is clicked
        if (strIngredients.length > 0) {
            td1.setAttribute("data-ingred", strIngredients);
        }
        td1.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td1.setAttribute("data-id", data.drinks[i].idDrink);
        td1.setAttribute("data-name", data.drinks[i].strDrink);
        //td1.addEventListener("click", displayImage);
       
        //style 1st column - turn it orange if cocktail has been saved
        td1.classList.add("pr-2");
        if (blAlreadySaved) {
             td1.classList.add("dark-orange");  
        } 

        //2nd column in table - holds cocktail name
        td2.classList.add("text-sm");
        td2.innerHTML = data.drinks[i].strDrink;
        td2.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td2.setAttribute("data-id", data.drinks[i].idDrink);
        td2.setAttribute("data-name", data.drinks[i].strDrink);
        
        if (strIngredients.length > 0) {
            td2.setAttribute("data-ingred", strIngredients);
        }
        //style 2nd column so when you hover background is grey
        td2.classList.add("hover:bg-gray-300");
        td2.classList.add("rounded-lg");
        td2.classList.add("cursor-pointer");
        //add tooltip so when you hover it gives instruction
        td2.setAttribute("data-bs-toggle","tooltip");
        td2.setAttribute("title", "Click to see cocktail ingredients.");
        //if cocktail is saved colour orange
        if (blAlreadySaved){
            td2.classList.add("dark-orange");
        }
        //add eventlistener so ingredients are displayed when cocktail name is clicked
        td2.addEventListener("click", getIngredients);
        //3rd column in table - holds icon which when clicked opens cocktail image
        //font awesome picture icon
       td3.innerHTML = '<i class="fa-solid fa-image"></i>';
       td3.classList.add("cursor-pointer");
       //add tooltip so when you hover it gives instructions 
        td3.setAttribute("data-bs-toggle","tooltip");
        td3.setAttribute("title", "Click to view cocktail image.");

        //if already saved colour icon orange
       if (blAlreadySaved) {
        td3.classList.add("dark-orange");  
       } 
        
       //add data-set - used when we need to know which cocktail was clicked
        td3.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td3.setAttribute("data-id", data.drinks[i].idDrink);
        td3.setAttribute("data-name", data.drinks[i].strDrink);
        if (strIngredients.length > 0) {
            td3.setAttribute("data-ingred", strIngredients);
        }
        td3.classList.add("pl-2");
        //add event listener - want to display image of icon clicked
        td3.addEventListener("click", displayImage);

        //4th column in table - hold save icon or tick icon
        if (blAlreadySaved) {
            //if cocktail saved display tick and colour orange
            td4.innerHTML = '<i class="fa-solid fa-check"></i>';
            td4.classList.add("dark-orange");  
        } else {
            //otherwise dsplay "save" icon
            td4.innerHTML = '<i class="far fa-save"></i>';
            td4.classList.add("cursor-pointer");
            //add tooltip so when hover instructions are displayed
            td4.setAttribute("data-bs-toggle","tooltip");
            td4.setAttribute("title", "Click to save cocktail.");
            //add event listener to save cocktail
            td4.addEventListener("click", saveCocktail);
        }
        //add data-set values
        td4.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td4.setAttribute("data-id", data.drinks[i].idDrink);
        td4.setAttribute("data-name", data.drinks[i].strDrink);
        if (strIngredients.length > 0) {
            td4.setAttribute("data-ingred", strIngredients);
        }
        td4.classList.add("pl-2");
        //add all td elements to table row
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        //add row to table
        table.appendChild(tr);
    }
   
    //create scroll around results
    searchResultsEl.classList.add("h-full");
    searchResultsEl.classList.add("max-h-full");
    //only scroll in y direction
    searchResultsEl.classList.add("overflow-y-auto");
    searchResultsEl.classList.add("max-w-full");
    //add p element before search results tells how many results were returned
    resultsEl.parentNode.insertBefore(pEl, resultsEl);
    searchResultsEl.appendChild(table);
    
    //searchResultsEl.addEventListener("click", getIngredients);
}

//ingredients are returned from API as separate strings (up to 15 of them).
//the corresponding measures are also returned as strings (up to 15)
//this function links the measures and ingredients and displays them in the "search-image" element
function displayIngredients(data) {   
    let strIngredient = "";
    let strMeasure = "";   
    let ulEl;
    let liEl;
    let divEl;
    //remove any previously created elements
    removeAllChildren(searchImageEl);
    //create p element to hold cocktail name
    pEl = document.createElement("p");
    pEl.classList.add("text-sm");
    pEl.classList.add("font-bold");
    pEl.innerHTML = data.drinks[0]["strDrink"];

    //create Ul to hold cocktail ingredients
    ulEl = document.createElement("ul");
    ulEl.classList.add("text-sm");
    
    ulEl.classList.add("cadet-blue");
    //add bullet point to each ingredient
    ulEl.classList.add("list-disc");
    ulEl.classList.add("p-2");
    ulEl.classList.add("pl-4");
    //loop through 15 strings of ingredients returned from API
    //match with measures and display
    for (let i = 1; i < 15; i++) {
        console.log("ingredient = " + data.drinks[0]["strIngredient" + i]);
        if (data.drinks[0]["strIngredient" + i] != null) {
            liEl = document.createElement('li');
            if (data.drinks[0]["strMeasure" + i] != null) {
                liEl.innerHTML =  data.drinks[0]["strMeasure" + i] + " " + data.drinks[0]["strIngredient" + i];
            } else {
                liEl.innerHTML =  data.drinks[0]["strIngredient" + i];
            }
        } else {
            break;
        }
        //add li element
        ulEl.appendChild(liEl); 
    }
    //create div element, add p (cocktail name) and ul (list of ingredients)
    divEl = document.createElement("div");
    divEl.classList.add("bg-white");
    divEl.classList.add("rounded-2xl");
    divEl.classList.add("p-2");
    divEl.appendChild(pEl);
    divEl.appendChild(ulEl);
    searchImageEl.appendChild(divEl);
    //make search-image visible and style it
    searchImageEl.classList.remove("hidden");
    searchImageEl.classList.remove("w-32");
    searchImageEl.classList.add("mx-auto");
    searchImageEl.classList.add("my-auto");
    searchImageEl.classList.add("cocktail-border");
    searchImageEl.classList.add("p-0");
    searchImageEl.classList.add("ml-2");
    
}

//main call to API
function callAPI(filterType, searchType, searchCriteria) {
   
    let requestUrl;
    //API formats
    //www.thecocktaildb.com/api/json/v1/1/search.php?i=vodka
    //www.thecocktaildb.com/api/json/v1/1/random.php
    //www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007
    //check which call was made and use correct version of API
   if (filterType == "random") {
    requestUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
   } else {
    requestUrl = `https://www.thecocktaildb.com/api/json/v1/1/${filterType}.php?${searchType}=${searchCriteria}`;
   }
   
    fetch(requestUrl) // call API to get lat and lon
        .then(function (response) {
            //convert to JSON
            return response.json();
        })
        .then(function (data) {
            //we have JSON here 
            if (filterType.trim() == "lookup") {
                //lookup in API implies we got ingredients
                displayIngredients(data);
               
            } else {
                //we got list of cocktails
                //display details
                displayData(data);
            }
                       
       })
        .catch(function(error){
            //no data found in API search - tell user
            alert("Sorry nothing matches your search. Please try again."); 
            return null;
        }
        );

}

//validate to check user entered value for ingredient or cocktail name
function isValid(fieldName){
    if (document.getElementById(fieldName)) {
        if (document.getElementById(fieldName).value != "") {
            return true;
        }
        
    }
    return false;
}
//see which radio value was clicked and show appropriate fields
//for user to enter chosen details
function chooseOption(event) {
    
    let chosenValue = event.target.value;
    let nameValue = document.querySelector("#name-fields");
    let ingredientValue = document.querySelector("#ingredient-fields");
    if (chosenValue == "by name") {
        //show appropriate fields to get cocktail name from user
        //clear previous elements
        nameValue.classList.remove("hidden");
        ingredientValue.classList.add("hidden"); 
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl); 
        //search-count displays results - clear any value there
        $("#search-count").html("");

    } else if (chosenValue == "by ingredient"){
        //show appropriate fields to get cocktail ingredient from user
        //clear previous elements
        ingredientValue.classList.remove("hidden");
        nameValue.classList.add("hidden");
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl);
        //search-count displays results - clear any value there
        $("#search-count").html("");
    } else if (chosenValue == "random") {
        //hide any input fields not needed
        nameValue.classList.add("hidden");
        ingredientValue.classList.add("hidden");
        //remove any previously created elements
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl);
        //search-count displays results - clear any value there
        $("#search-count").html("");
    } else {
        return;
    }
    //hide 
    searchResultsEl.classList.add("hidden");
    searchImageEl.classList.add("hidden");
}

function searchHandler() {
    
    let chosenValue = $("input[name='search-options']:checked").val();
   
    let searchValue = '';
    let searchType = '';
    let filterType = '';

    removeAllChildren(searchImageEl);
    removeAllChildren(searchResultsEl);
    searchImageEl.classList.remove("cocktail-border");
    
    if (typeof chosenValue == "undefined") {
        alert("Please select to search by cocktail name, cocktail ingredient or choose a random cocktail.");
        return;
    }
    if (chosenValue == "by name"){
       // console.log('searchhandler - name');
        if (!isValid("cocktail-name")){
            alert("Please enter the cocktail name.");
            return;
        }
        searchValue = $("#cocktail-name").val();
        searchType = "s";
        filterType = "search";
        $("#cocktail-name").val("");
    } else if (chosenValue == "by ingredient"){
       // console.log('searchHandler - ingredient');
        if (!isValid("cocktail-ingredient")){
            alert("Please enter the ingredient name.")
            return;
        }
        searchValue = $("#cocktail-ingredient").val();
        searchType = "i";
        $("#cocktail-ingredient").val("");
        filterType = "filter";
    } else {
        filterType = "random";
    }
// XXX
    callAPI(filterType, searchType, searchValue);
    //console.log("returned = " + dataReturned);
    //displayData(dataReturned);
}

function openModal() {
    removeAllChildren(searchResultsEl);
    clearInputFields();
    removeAllChildren(searchImageEl);
    cocktailModalEl.classList.remove("hidden");
    
    //var cancelEl = document.getElementById("#cancel-button");
    var cancelEl = document.querySelector("#cancel-button");
    cancelEl.addEventListener("click", closeModal);
    //console.log('inside openmodal');
    
    radioEl.addEventListener("click", chooseOption);
    $('input[name="search-options"]').attr('checked', false);
    $('#name-fields').addClass("hidden");
    $('#ingredient-fields').addClass("hidden");
    //cancelEl.addEventListener("click", closeModal);
}

function closeModal() {
    //alert("close");
    cocktailModalEl.classList.add("hidden");
    searchResultsEl.classList.add("hidden");
    searchImageEl.classList.add("hidden");
    $("#search-count").html("");
    $("#search-count").remove();
   // console.log('inside openmodal');
}

function saveCocktail(event) {
    event.stopPropagation();
    let chosenDrink = event.currentTarget;
    console.log(event.target.getAttribute('class'));
    let cocktailID = chosenDrink.getAttribute("data-id");
    let cocktailName = chosenDrink.getAttribute("data-name");
    let cocktailImg = chosenDrink.getAttribute("data-img");
    let cocktailIngred = chosenDrink.getAttribute("data-ingred");
    let arrayCocktails;
    let storedCocktails = localStorage.getItem("cocktails");
    searchCriteria = cocktailID;

    if (cocktailIngred != "" && cocktailIngred != null) {
        console.log("got ingredients from data-set");
        let currentCocktail = {
            id: cocktailID,
            name: cocktailName,
            img: cocktailImg,
            ingredients: cocktailIngred
        }  

        //check if first time to store to local storage
        //create blank array and add element
        if (storedCocktails == null){
            console.log("Storing first cocktail");
            arrayCocktails = [currentCocktail];
        } else {
        //already have saved cocktail so update array with new cocktail
        console.log("already have cocktails")
            arrayCocktails = JSON.parse(storedCocktails);
        if (arrayCocktails.filter(e => e.id === cocktailID).length === 0) {
            console.log("Storing - " + cocktailName);
            arrayCocktails.push(currentCocktail);
        }
        }
        console.log("Final storing - " + JSON.stringify(arrayCocktails));
        localStorage.setItem("cocktails", JSON.stringify(arrayCocktails));


            $(`td[data-id='${cocktailID}']`).addClass("dark-orange");   
            chosenDrink.innerHTML = "<i class='fa-solid fa-check'></i>";
            //$(`td[data-id='${cocktailID}']`).addClass("font-bold"); 
             

    } else {
        console.log("API Call to get ingredients");
        let requestUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${searchCriteria}`;
        console.log("storing - " + cocktailName);

        fetch(requestUrl) // call API to get lat and lon
            .then(function (response) {
                //convert to JSON
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                cocktailIngred = getAllIngredients(data.drinks[0]);
                let currentCocktail = {
                    id: cocktailID,
                    name: cocktailName,
                    img: cocktailImg,
                    ingredients: cocktailIngred.join("#")
            }  

            //check if first time to store to local storage
            //create blank array and add element
            if (storedCocktails == null){
                console.log("Storing first cocktail");
                arrayCocktails = [currentCocktail];
            } else {
            //already have saved cocktail so update array with new cocktail
            console.log("already have cocktails")
                arrayCocktails = JSON.parse(storedCocktails);
            if (arrayCocktails.filter(e => e.id === cocktailID).length === 0) {
                console.log("Storing - " + cocktailName);
                arrayCocktails.push(currentCocktail);
            }
            }
            console.log("Final storing - " + JSON.stringify(arrayCocktails));
            localStorage.setItem("cocktails", JSON.stringify(arrayCocktails));
            $(`td[data-id='${cocktailID}']`).addClass("dark-orange");   
            chosenDrink.innerHTML = "<i class='fa-solid fa-check'></i>";
            //$(`td[data-id='${cocktailID}']`).addClass("font-bold");  
       })
        .catch(function(error){
            alert("Error!!"); 
            return null;
        }
        );   
    
    }
    
}

/*
Whisky Sour
Daiquiri
Manhattan
Dry Martini
Espresso Martini
Margarita
Aperol Spritz
Moscow Mule
*/

$(function () {
    var cocktailNames = [
      'Cosmopolitan',
      'Mojito',
      'Mai Tai',
      'Mint Julep',
      'Margarita',
      'Caipirinha',
      'Pina Colada',
      'Old Fashioned',
      'Negroni',
      'Whiskey Sour',
      'Daiquiri',
      'Manhattan',
      'Dry Martini',
      'Espresso Martini',
      'Aperol Spritz',
    ];
    $('#cocktail-name').autocomplete({
      source: cocktailNames,
    });

    var cocktailIngred = [
        'Vodka',
        'Gin',
        'Whiskey',
        'White Rum',
        'Dark Rum',
        'Syrup',
        'Lime',
        'Orange',
        'Soda Water',
        'Bourbon',
        'Baileys Irish Cream',
        'Amaretto'
      ];
      $('#cocktail-ingredient').autocomplete({
        source: cocktailIngred,
      });

      selectCocktailBtnEl.addEventListener("click", openModal);
      searchButtonEl.addEventListener("click", searchHandler);
    //btn.addEventListener("click", openModel);
      //searchResultsEl.addEventListener("click", displayImage);
      //searchResultsEl.addEventListener("click", getIngredients);
      //searchImageEl.addEventListener("click", getIngredients);
     // searchImageEl.addEventListener("click", displayImage);
      closeModalEl.addEventListener("click", closeModal);

  });


//localStorage.clear("cocktails");