async function fetchData(trainName) {
    const url = 'https://trains.p.rapidapi.com/';
    const apiKey = '6798782acdmshcadbf40f28fa39bp1a6828jsn25bccbd3f737'; // Replace 'YOUR-API-KEY' with your actual API key
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'trains.p.rapidapi.com'
        },
        body: JSON.stringify({ search: trainName }) // Use the entered train name in the API request
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        displayTrainInfo(result);
        console.log('Fetched data:', result); // Log fetched data to the console
    } catch (error) {
        console.error(error);
        displayError();
    }
}

function searchTrain() {
    const trainNameInput = document.getElementById('trainNameInput');
    const trainName = trainNameInput.value.trim();
    if (trainName !== '') {
        fetchData(trainName);
    } else {
        alert('Please enter a train name.');
    }
}

function displayTrainInfo(data) {
    const trainInfoContainer = document.getElementById('trainInfo');
    trainInfoContainer.innerHTML = '';

    data.forEach(train => {
        const trainDiv = document.createElement('div');
        trainDiv.classList.add('train');
        trainDiv.innerHTML = `
            <h2>${train.name}</h2>
            <p>Train Number: ${train.train_num}</p>
            <p>Departure Time: ${train.data.departTime}</p>
            <p>Arrival Time: ${train.data.arriveTime}</p>
        `;
        trainInfoContainer.appendChild(trainDiv);
    });
}

function displayError() {
    const trainInfoContainer = document.getElementById('trainInfo');
    trainInfoContainer.innerHTML = `<p>Error fetching train information. Please try again later.</p>`;
}


/* -------------------------------- suggestion code -------------------------------- */

const trainNames = ["Train 1", "Train 2", "Train 3", "Train 4", "Train 5"]; // Example train names, replace with actual data

function autocomplete(input, trainNames) {
    let currentFocus;

    input.addEventListener("input", function(e) {
        const value = this.value;
        closeAllLists();
        if (!value) { return false; }
        currentFocus = -1;

        const suggestions = document.createElement("div");
        suggestions.setAttribute("class", "autocomplete-items");
        suggestions.setAttribute("id", "trainSuggestions");
        this.parentNode.appendChild(suggestions);

        for (let i = 0; i < trainNames.length; i++) {
            if (trainNames[i].toUpperCase().includes(value.toUpperCase())) {
                const suggestion = document.createElement("div");
                suggestion.innerHTML = "<strong>" + trainNames[i].substr(0, value.length) + "</strong>";
                suggestion.innerHTML += trainNames[i].substr(value.length);
                suggestion.innerHTML += "<input type='hidden' value='" + trainNames[i] + "'>";
                suggestion.addEventListener("click", function(e) {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                suggestions.appendChild(suggestion);
            }
        }
    });

    input.addEventListener("keydown", function(e) {
        let suggestionList = document.getElementById("trainSuggestions");
        if (suggestionList) { suggestionList = suggestionList.getElementsByTagName("div"); }
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(suggestionList);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(suggestionList);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (suggestionList) suggestionList[currentFocus].click();
            }
        }
    });

    function addActive(items) {
        if (!items) { return false; }
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (items.length - 1);
        items[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists() {
        const suggestions = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].parentNode.removeChild(suggestions[i]);
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

autocomplete(document.getElementById("trainNameInput"), trainNames);

// Rest of your script...
