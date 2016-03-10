/*

Designed by: Robert Thayer
rob@gamergadgets.net
Purpose: Application for tracking health or points for board games/RPGs.
Hosted at http://tracker.gamergadgets.net/

*/

var body = document.body,
    playerArea = document.getElementById("playerArea"), // Area to hold the player trackers
    newPlayerArea = document.getElementById("newPlayer"), // Area for input of new players
    header = document.getElementById("header"), // header
    footer = document.getElementById("footer"), // footer
    numOfPlayers = 0, // holds number of players
    COLORS = []; // Array to hold colors generated by Create Colors function


// Tracker object
/*

--------------------------------------
|                Name                 |
---------------------------------------
|                ****                 |
|  -3           *    *          +3    |
|  -5        -  * HP * +        +5    |
|  -10          *    *          +10   |
|                ****                 |
|                                     |
---------------------------------------
 
*/
var Tracker = function (health, name, color) {
    // Variables:
    // name
    this.name = name;
    // color
    this.color = color;
    
    // Determine the color of the text dependent on how dark the background is
    this.textColor = color.substring(4, color.length-1)
         .replace(/ /g, '')
         .split(',');
    this.contrast = contrastText(parseInt(this.textColor[0]), parseInt(this.textColor[1]), parseInt(this.textColor[2]));

    // Components:
    // Div to hold the tracker object
    this.trackerDiv = document.createElement("div");
    this.trackerDiv.style.background = color;
    this.trackerDiv.classList.add("tracker");
    this.trackerDiv.classList.add(this.contrast);
    
    // First row of flex box
    this.firstRow = document.createElement("div");
    this.firstRow.classList.add("firstRow");
    
    // Area for the player's name
    this.nameArea = document.createElement("div");
    this.nameArea.classList.add("nameArea");
    // Set the name label to the player's name
    this.nameArea.innerHTML = name;
    
    // Area for the delete button
    this.deletePlayer = document.createElement("div");
    this.deletePlayer.classList.add("deletePlayer");
    this.deletePlayer.innerHTML = "X";
    this.deletePlayer.addEventListener("click", function (e) { e = e || window.event; removePlayer(e.target); }, false);

    // Add the name and delete button areas to the row
    this.firstRow.appendChild(this.nameArea);
    this.firstRow.appendChild(this.deletePlayer);
    this.trackerDiv.appendChild(this.firstRow);
    
    // Second row of the flex box
    this.secondRow = document.createElement("div");
    this.secondRow.classList.add("secondRow");
    
    // Quick mod area for minus 3, 5, 10
    this.minusModArea = document.createElement("div");
    this.minusModArea.classList.add("modArea");
    this.minusModArea.appendChild(modButton(-3));
    this.minusModArea.appendChild(modButton(-5));
    this.minusModArea.appendChild(modButton(-10));
    this.secondRow.appendChild(this.minusModArea);
    
    // Quick -1
    this.minusArea = document.createElement("div");
    this.minusButton = document.createElement("div");
    this.minusArea.classList.add("modButton");
    this.minusButton.classList.add("quickMod");
    this.minusButton.innerHTML = "-";
    this.minusArea.addEventListener("click", function (e) { e = e || window.event; changeHealth(e.target, -1); }, false);
    this.minusArea.appendChild(this.minusButton);
    this.secondRow.appendChild(this.minusArea);
    
    // Health Area
    this.healthArea = document.createElement("div");
    this.healthArea.classList.add("healthArea");
    this.healthArea.innerHTML = health;
    this.secondRow.appendChild(this.healthArea);
    
    // Quick +1
    this.plusArea = document.createElement("div");
    this.plusButton = document.createElement("div");
    this.plusArea.classList.add("modButton");
    this.plusButton.classList.add("quickMod");
    this.plusButton.innerHTML = "+";
    this.plusArea.addEventListener("click", function (e) { e = e || window.event; changeHealth(e.target, +1); }, false);
    this.plusArea.appendChild(this.plusButton);
    this.secondRow.appendChild(this.plusArea);
    
    // Quick mod area for plus 3, 5, 10
    this.plusModArea = document.createElement("div");
    this.plusModArea.classList.add("modArea");
    this.plusModArea.appendChild(modButton(3));
    this.plusModArea.appendChild(modButton(5));
    this.plusModArea.appendChild(modButton(10));
    this.secondRow.appendChild(this.plusModArea);
    
    this.trackerDiv.appendChild(this.secondRow);
    
    playerArea.appendChild(this.trackerDiv);
};

// When number of trackers is changed, determine the size of the flex box and change.
function changeNumOfPlayers(num) {
    numOfPlayers = num;
    changeSize(numOfPlayers);
}

// Helper function to remove class styles for columns from all trackers.
function removeColAndRows(element) {
    var COLANDROW = ["col-2", "col-3", "col-4", "row-2", "row-3", "row-4"],
        i = 0;
    
    for (i = 0; i < COLANDROW.length; i++) {
        if (element.classList.contains(COLANDROW[i])) {
            element.classList.remove(COLANDROW[i]);
        }
    }
}
    
// Add row and column classes to all trackers
function setSize(row, column) {
    var rowClass = null,
        colClass = null;
    switch(row) {
        case 2:
            rowClass = "row-2";
            break;
        case 3:
            rowClass = "row-3";
            break;
        case 4:
            rowClass = "row-4";
            break;
        case 5:
            rowClass = "row-5";
            break;
        default:
            break;
    }
    
    switch(column) {
        case 2:
            colClass = "col-2";
            break;
        case 3:
            colClass = "col-3";
            break;
        case 4:
            colClass = "col-4";
            break;
        case 5:
            colClass = "col-5";
            break;
        default:
            break;
    }
    
    
    for (var i = 0; i < playerArea.children.length; i++) {
        var tracker = playerArea.children[i];
        removeColAndRows(tracker);
        if (rowClass !== null) {
            tracker.classList.add(rowClass);
        }
        
        if (colClass !== null) {
            tracker.classList.add(colClass);
        }
        // Add to the health area as well for text resizing
        removeColAndRows(tracker.querySelector(".healthArea"));
        tracker.querySelector(".healthArea").classList.add(rowClass);
    }
}

// Add css classes to all trackers based on the number of active trackers
function changeSize(numOfPlayers) {
    switch(numOfPlayers) {
        case 1:
            setSize(1, 1);
            break;
        case 2:
            setSize(1, 2);
            break;
        case 3:
        case 4:
            setSize(2, 2);
            break;
        case 5:
        case 6:
            setSize(3, 2);
            break;
        case 7:
        case 8:
            setSize(4, 2);
            break;
        case 9:
            setSize(3, 3);
            break;
        case 10:
        case 11:
        case 12:
            setSize(4, 3);
            break;
        case 13:
        case 14:
        case 15:
        case 16:
            setSize(4, 4);
            break;
        case 17:
        case 18:
        case 19:
        case 20:
            setSize(5, 4);
            break;
        case 21:
        case 22:
        case 23:
        case 24:
        case 25:
            setSize(5, 5);
            break;
        default:
            break;
    }
}

// Get number of pixels from header and footer in order to change viewport
function getHeadFootPixelCount() {
    var headHeight = header.clientHeight,
        footHeight = footer.clientHeight,
        totalHeight = headHeight + footHeight;
    
    return totalHeight;
}

// After user adds a player, hide the new player area.
function hideNewPlayerArea() {
    newPlayerArea.classList.add("hidden");
    playerArea.classList.remove("shrunk");
}

// When user clicks "Add New Player" button, show the new player area
function showNewPlayerArea() {
    if (newPlayerArea.classList.contains("hidden")) {
        newPlayerArea.classList.remove('hidden');
    }
    playerArea.classList.add("shrunk");
}

// Add a player
function addPlayer() {
    var name,
        health,
        color,
        tracker;
    
    // Get values from the input field
    name = document.getElementById("name").value;
    health = document.getElementById("health").value;
    color = document.getElementById("colorPicker").querySelector(".selected").style.backgroundColor;
    
    // Create a new tracker based on the info selected.
    if (name==null || name == "", health == null || health == "", color == null) {
        alert("Please fill in name, starting value, and choose a color");
        return;
    } else {
        tracker = new Tracker(health, name, color);
        changeNumOfPlayers(numOfPlayers + 1); // Increment number of players
        hideNewPlayerArea();
        document.getElementById("name").value = '';
        document.getElementById("health").value = '';
        document.getElementById("colorPicker").querySelector(".selected").classList.remove('selected');
    }
}

// Remove a player
function removePlayer(e) {
    var element = e.parentNode;
    while (!element.classList.contains("tracker")) {
        element = element.parentNode;
        console.log(element);
    }
    
    element.parentElement.removeChild(element);
    
    // Decrease number of players
    changeNumOfPlayers(numOfPlayers - 1);
}

// Modify the health/point value of a tracker
function changeHealth(target, num) {
    var label,
        health,
        tracker,
        el = target.parentNode;
    
    // Move up the DOM until you reach secondRow
    while (!el.classList.contains("secondRow")) {
        el = el.parentNode;
    }
    // Find the health label
    label = el.querySelector(".healthArea");
    // Get the current point value and add the chosen number
    health = parseInt(label.innerHTML);
    health += num;
    label.innerHTML = health;
}

// Create a quick modification button for the chosen value
function modButton(num) {
    var modArea = document.createElement("div");
    modArea.classList.add("quick");
    if (num > 0) {
        modArea.innerHTML = "+" + num;
    } else {
        modArea.innerHTML = num;
    }
    modArea.addEventListener("click", function (e) { e = e || window.event; changeHealth(e.target, num); }, false);
    return modArea;
}

// Check if the color is too dark
function darkCheck(int) {
    if (int < 115) {
        return true;
    }
}

// Function to generate a set of colors to choose from
function createColors() {
    var int1 = 0,
        int2 = 0,
        int3 = 0,
        bounce = false,
        i = 0,
        color,
        SPACER = 23;
    
    // 0-255, 0, 0;
    for (int1 = 0; int1 < 256; int1 += SPACER) {
        color = "rgb(" + int1 + ", " + int2 + ", " + int3 + ")";
        if (!darkCheck(int1+int2+int3)) {
            COLORS.push(color);
        }
    }
    int1 = 0;
    
    
    // 0, 0-255, 0
    for (int2 = SPACER; int2 < 256; int2 += SPACER) {
        color = "rgb(" + int1 + ", " + int2 + ", " + int3 + ")";
        if (!darkCheck(int1+int2+int3)) {
            COLORS.push(color);
        }
    }
    int2 = 0;
    
    // 0, 0, 0-255
    for (int3 = SPACER; int3 < 256; int3 += SPACER) {
        color = "rgb(" + int1 + ", " + int2 + ", " + int3 + ")";
        if (!darkCheck(int1+int2+int3)) {
            COLORS.push(color);
        }
    }
    
    
    // 0-255, 0-255, 0
    for (int1 = SPACER, int2 = SPACER, int3 = 0; (int1 < 255 && int2 < 255); bounce = !bounce) {
        color = "rgb(" + int1 + ", " + int2 + ", " + int3 + ")";
        if (!darkCheck(int1+int2+int3)) {
            COLORS.push(color);
        }
        if (bounce) {
            int1 += SPACER;
            if (int1 > 255) {
                int1 = 255;
            }
        } else {
            int2 += SPACER;
            if (int2 > 255) {
                int2 = 255;
            }
        }
    }
    
    // 0, 0-255, 0-255
    for (int1 = 0, int2 = SPACER, int3 = SPACER; (int2 < 255 && int3 < 255); bounce = !bounce) {
        color = "rgb(" + int1 + ", " + int2 + ", " + int3 + ")";
        if (!darkCheck(int1+int2+int3)) {
            COLORS.push(color);
        }
        if (bounce) {
            int2 += SPACER;
            if (int2 > 255) {
                int2 = 255;
            }
        } else {
            int3 += SPACER;
            if (int3 > 255) {
                int3 = 255;
            }
        }
    }
    
    // 0-255, 0, 0-255
    for (int1 = SPACER, int2 = 0, int3 = SPACER; (int1 < 255 && int3 < 255); bounce = !bounce) {
        color = "rgb(" + int1 + ", " + int2 + ", " + int3 + ")";
        if (!darkCheck(int1+int2+int3)) {
            COLORS.push(color);
        }
        if (bounce) {
            int1 += SPACER;
            if (int1 > 255) {
                int1 = 255;
            }
        } else {
            int3 += SPACER;
            if (int3 > 255) {
                int3 = 255;
            }
        }
    }

    
    // 0-255, 0-255, 0-255
    for (int1 = SPACER, int2 = SPACER, int3 = SPACER; (int2 < 255 && int3 < 255); i++) {
        color = "rgb(" + int1 + ", " + int2 + ", " + int3 + ")";
        if (!darkCheck(int1+int2+int3)) {
            COLORS.push(color);
        }
        if (i === 0) {
            int1 += SPACER;
            if (int1 > 255) {
                int1 = 255;
            }
        } else if (i === 1) {
            int2 += SPACER;
            if (int2 > 255) {
                int2 = 255;
            }
        } else {
            int3 += SPACER;
            if (int3 > 255) {
                int3 = 255;
            }
            i = -1;
        }
    } 
}

// Courtesy of Alex Merchant @ StackOverflow
function contrastText(red, green, blue) {
    var brightness;
    
    brightness = (red * 299) + (green * 587) + (blue * 114);
    brightness = brightness / 255000;

    // values range from 0 to 1
    // anything greater than 0.5 should be bright enough for dark text
    if (brightness >= 0.5) {
        return "dark-text";
    } else {
        return "light-text";
    }
}

// Triggers when user selects a color from the list. Sets the selected class and adds a border.
function chooseColor(target) {
    var children = document.getElementById("colorPicker").children,
        i;
    for (i = 0; i < children.length; i++) {
        children[i].classList.remove("selected");   
    }
    target.classList.add("selected");
}

// Generates the color swatches.
function displayColors() {
    var colorPicker = document.getElementById("colorPicker"),
        i,
        color;
    
    createColors();
    for (i = 0; i < COLORS.length; i++) {
        color = document.createElement("div");
        color.addEventListener("click", function (e) { e = e || window.event; chooseColor(e.target); }, false);
        color.classList.add("color");
        color.style.backgroundColor = COLORS[i];
        color.innerHTML = "<img />";
        colorPicker.appendChild(color);
    }
}
displayColors();

// Start by adding in the New Player area.
showNewPlayerArea();