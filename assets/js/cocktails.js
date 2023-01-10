
//button variables
let selectCocktailBtnEl = document.querySelector(".cocktail-select");
let cocktailModalEl = document.querySelector("#cocktail-modal");
let searchButtonEl = document.querySelector("#search-button");
let searchResultsEl = document.querySelector("#search-results");
let resultsEl = document.querySelector("#results");
let searchImageEl = document.querySelector("#search-image");
var radioEl = document.querySelector("#radio-buttons");
var closeModalEl = document.querySelector("#close-modal");
var errorModalEl = document.querySelector("#error-modal");
var closeButtonEl = document.querySelector("#close-button");
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
    let chosenImg = event.target;
    let cocktailID = chosenImg.getAttribute("data-id");
    if (cocktailID != null) {
        callAPI("lookup", "i", cocktailID);
    }
    
}

//display image for cocktail using data-set values in clicked element eg src and cocktail name
function displayImage(event) {
    let chosenDrink = event.currentTarget;
    
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
    //indicates its a clickable element
    imgEl.classList.add("rounded-b-2xl");
    

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
    pEl.classList.add("text-lg");
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
        pEl.classList.add("text-lg");
        pEl.classList.add("font-bold");
        pEl.classList.add("block");
        pEl.classList.add("w-full");
        pEl.setAttribute("id", "search-count");
        pEl.classList.add("text-center");
    }
    //set value of search count to display the number of cocktails returned from the search
    pEl.innerHTML = "Search Results - " + data.drinks.length + " cocktail(s) found";

    //create table to display search results
    var table = document.createElement('table');
    //loop through search results array and create row in table for each result
    for (var i = 0; i < data.drinks.length; i++){
        blAlreadySaved = false;
        //check if this cocktail was already saved and set boolean blAlreadySaved
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
        td1.innerHTML ='<i class="fas fa-cocktail" aria-hidden="true"></i>';

        //add data-set so these can be used if needed when icon is clicked
        if (strIngredients.length > 0) {
            td1.setAttribute("data-ingred", strIngredients);
        }
        td1.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td1.setAttribute("data-id", data.drinks[i].idDrink);
        td1.setAttribute("data-name", data.drinks[i].strDrink);
       
        //style 1st column - turn it orange if cocktail has been saved
        td1.classList.add("pr-2");
        if (blAlreadySaved) {
             td1.classList.add("dark-orange");  
        } 

        //2nd column in table - holds cocktail name
        td2.classList.add("text-lg");
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
       td3.innerHTML = '<i class="fa-solid fa-image" aria-hidden="true"></i><span class="sr-only">Image</span>';
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
            td4.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
            td4.classList.add("dark-orange");  
        } else {
            //otherwise dsplay "save" icon
            td4.innerHTML = '<i class="far fa-save" aria-hidden="true"></i><span class="sr-only">Save</span>';
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
    //only scroll in y direction
    searchResultsEl.classList.add("h-full");
    searchResultsEl.classList.add("max-h-full");
    
    searchResultsEl.classList.add("overflow-y-auto");
    searchResultsEl.classList.add("max-w-full");
    //add p element before search results tells how many results were returned
    resultsEl.parentNode.insertBefore(pEl, resultsEl);
    searchResultsEl.appendChild(table);
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
    pEl.classList.add("text-lg");
    pEl.classList.add("font-bold");
    pEl.innerHTML = data.drinks[0]["strDrink"];

    //create Ul to hold cocktail ingredients
    ulEl = document.createElement("ul");
    ulEl.classList.add("text-lg");
    
    ulEl.classList.add("cadet-blue");
    //add bullet point to each ingredient
    ulEl.classList.add("list-disc");
    ulEl.classList.add("p-2");
    ulEl.classList.add("pl-4");
    //loop through 15 strings of ingredients returned from API
    //match with measures and display
    for (let i = 1; i < 15; i++) {
        
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
            displayError("Sorry nothing matches your search. Please try again.");
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
   
    if (chosenValue == "name") {
        //show appropriate fields to get cocktail name from user
        //clear previous elements
        
        nameValue.classList.remove("hidden");
        ingredientValue.classList.add("hidden"); 
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl); 
        //search-count displays results - clear any value there
        $("#search-count").html("");

    } else if (chosenValue == "ingredient"){
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
//function called when search button clicked
function searchHandler() {
    //get value of checked radio button
    let chosenValue = $("input[name='search-options']:checked").val();
   
    let searchValue = '';
    let searchType = '';
    let filterType = '';
    //remove any previously created elements
    removeAllChildren(searchImageEl);
    removeAllChildren(searchResultsEl);
    //remove the border around the ingredients/image if its still there
    searchImageEl.classList.remove("cocktail-border");
    //check user actually selected something before clicking search button
    if (typeof chosenValue == "undefined") { //user did nt select anything
        //("Please select to search by cocktail name, cocktail ingredient or choose a random cocktail.");
        errorModalEl.classList.remove("hidden");
        $("#error-modal-text").text("Please select to search by cocktail name, cocktail ingredient or choose a random cocktail.");
        return;
    }
    if (chosenValue == "name"){
        //user chose "name" search, check they entered a cocktail name
        if (!isValid("cocktail-name")){
            displayError("Please enter the cocktail name.");
            return;
        }
        //set up parameters for API call
        searchValue = $("#cocktail-name").val();
        searchType = "s";
        filterType = "search";
        $("#cocktail-name").val("");
    } else if (chosenValue == "ingredient"){
        //user chose "ingredient" search, check they actually entered an ingredient
       
        if (!isValid("cocktail-ingredient")){
            displayError("Please enter the ingredient name.");
            return;
        }
        //setup parameter for API call
        searchValue = $("#cocktail-ingredient").val();
        searchType = "i";
        $("#cocktail-ingredient").val("");
        filterType = "filter";
    } else {
        //setup parameter for API call
        filterType = "random";
    }
    //call API with correct parameters
    callAPI(filterType, searchType, searchValue);
    
}

//called from randomize button - select a random cocktail
function randomize(){
    removeAllChildren(searchImageEl);
    searchImageEl.classList.remove("cocktail-border");
    callAPI("random", "", "");
}

//called from main page to open cocktail modal
function openModal() {
    //remove any previous elements and clear all input fields
    removeAllChildren(searchResultsEl);
    clearInputFields();
    removeAllChildren(searchImageEl);
    //show modal
    cocktailModalEl.classList.remove("hidden");
    //get access to "randomise button", and add eventlistener
    var cancelEl = document.querySelector("#cancel-button");
    cancelEl.addEventListener("click", randomize);
    //add eventlistener to radion buttons     
    radioEl.addEventListener("click", chooseOption);

    //make sure previous selections/inputs are cleared and hidden
    $('input[name="search-options"]').attr('checked', false);
    $('#name-fields').addClass("hidden");
    $('#ingredient-fields').addClass("hidden");
}
//closes modal - called from "X" at top right of modal window
function closeModal() {
    //hide all elements
    cocktailModalEl.classList.add("hidden");
    searchResultsEl.classList.add("hidden");
    searchImageEl.classList.add("hidden");
    //clear element that shows search results
    $("#search-count").html("");
    $("#search-count").remove();
   
}
//closes error modal - attached to ok button on error modal
function closeErrorModal() {
    errorModalEl.classList.add("hidden");
}

//helper function to display any error messsage to the error-modal element
function displayError(msg) {
    errorModalEl.classList.remove("hidden");
    $("#error-modal-text").text(msg);
       
}
//save cocktail details to local storage
function saveCocktail(event) {
    //ensure no further events are triggered
    event.stopPropagation();
    //find out which cocktail was clicked
    let chosenDrink = event.currentTarget;
    //get cocktail details
    let cocktailID = chosenDrink.getAttribute("data-id");
    let cocktailName = chosenDrink.getAttribute("data-name");
    let cocktailImg = chosenDrink.getAttribute("data-img");
    let cocktailIngred = chosenDrink.getAttribute("data-ingred");
    let arrayCocktails;
    //get previous stored details 
    let storedCocktails = localStorage.getItem("cocktails");
    searchCriteria = cocktailID;

    //check if we have ingredients from original API call
    //API call by name returns ingredients and we keep them in data-set
    //API call by ingredient does nt return all ingredients
    //need to make another API call to get ingredients using ingredient ID
    if (cocktailIngred != "" && cocktailIngred != null) {
        //already have ingredients
        let currentCocktail = {
            id: cocktailID,
            name: cocktailName,
            img: cocktailImg,
            ingredients: cocktailIngred
        }  

        //check if first time to store to local storage
        //create blank array and add element
        if (storedCocktails == null){
            arrayCocktails = [currentCocktail];
        } else {
        //already have saved cocktail so update array with new cocktail
            arrayCocktails = JSON.parse(storedCocktails);
            //check if we already saved this actual cocktail
            //dont want to store it again
            //filter array of objects based on id field in objects
            if (arrayCocktails.filter(e => e.id === cocktailID).length === 0) {
                arrayCocktails.push(currentCocktail);
            }
        }
        //convert to JSON and save
        localStorage.setItem("cocktails", JSON.stringify(arrayCocktails));
        //turn saved cocktail orange to indicate saved
        $(`td[data-id='${cocktailID}']`).addClass("dark-orange");  
        //change icon to indicate saved cocktail    
        chosenDrink.innerHTML = "<i class='fa-solid fa-check' aria-hidden='true'></i>";
    } else {
        //we dont already have the ingredients - need to make new API call to get them
        let requestUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${searchCriteria}`;

        fetch(requestUrl) //API call
            .then(function (response) {
                //convert to JSON
                return response.json();
            })
            .then(function (data) {
                //extract ingredients from object returned by API call
                cocktailIngred = getAllIngredients(data.drinks[0]);
                //create new object to add to local storage
                let currentCocktail = {
                    id: cocktailID,
                    name: cocktailName,
                    img: cocktailImg,
                    ingredients: cocktailIngred.join("#")
            }  

            //check if first time to store to local storage
            //create blank array and add element
            if (storedCocktails == null){
                arrayCocktails = [currentCocktail];
            } else {
            //already have saved cocktail so update array with new cocktail
                arrayCocktails = JSON.parse(storedCocktails);
                //check if we already have this exact cocktails stored already
                if (arrayCocktails.filter(e => e.id === cocktailID).length === 0) {
                    arrayCocktails.push(currentCocktail);
                }
            }
            //convert to JSON and store in local storage
            localStorage.setItem("cocktails", JSON.stringify(arrayCocktails));
            //turn orange to indicate saved
            $(`td[data-id='${cocktailID}']`).addClass("dark-orange"); 
            //change icon to tick - indiate saved  
            chosenDrink.innerHTML = "<i class='fa-solid fa-check' aria-hidden='true'></i>";
       })
        .catch(function(error){
            displayError("Error saving cocktails details, please try again.");
            return null;
        }
        );   
    
    }
    
}
//use jquery too setup autocomplete for name/ingredient fields

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

      //add eventlisteners
      selectCocktailBtnEl.addEventListener("click", openModal);
      searchButtonEl.addEventListener("click", searchHandler);
      closeModalEl.addEventListener("click", closeModal);
      closeButtonEl.addEventListener("click", closeErrorModal);
      
  });

//Clear storage when testing
//localStorage.clear("cocktails");