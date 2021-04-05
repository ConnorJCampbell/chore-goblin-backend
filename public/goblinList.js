const urlParams = new URLSearchParams(window.location.search);
const houseCode = Cookies.get('code');



var houseRequest = new XMLHttpRequest();
var goblinRequest = new XMLHttpRequest();


houseRequest.open('GET', '/api/v1/houses/' + houseCode, true);

houseRequest.onload = function() {
    if (!(this.response)) {
        console.log('invalid house code');
        return;
    }
    var house = JSON.parse(this.response);

    var houseTitleTextNode = document.createTextNode(house.name);
    var houseTitleElement = document.getElementById("houseName");
    houseTitleElement.appendChild(houseTitleTextNode);

    goblinRequest.open('GET', 'api/v1/goblinList/' + house.id, true);

    goblinRequest.onload = function() {
        var goblins = JSON.parse(this.response)
        var goblinTable = document.getElementById("goblinTable");
        i = 1;
        goblins.forEach(goblin => {
            var tableRow = document.createElement("tr");
            var goblinPicture = document.createElement("td");
            var goblinImage = document.createElement("img");
            if (!isNaN(goblin.appearance) && parseInt(goblin.appearance, 10)<= 6 && parseInt(goblin.appearance, 10) > 0) {
                console.log("appearance for " + goblin.goblin_name + " is " + goblin.appearance);
                goblinImage.setAttribute("src", "/placeholder" + goblin.appearance + ".png");
            } else {
                goblinImage.setAttribute("src", "/placeholder.png");
            }
            goblinImage.setAttribute("width", "50px");
            goblinImage.setAttribute("height", "50px");
            goblinPicture.appendChild(goblinImage);
            tableRow.appendChild(goblinPicture);
            var goblinName = document.createElement("td");
            var goblinLink = document.createElement("a");
            goblinLink.appendChild(document.createTextNode(goblin.goblin_name));
            goblinLink.setAttribute("href", "/chores?goblinId=" + goblin.id);
            goblinName.appendChild(goblinLink);
            tableRow.appendChild(goblinName);
            var ownerName = document.createElement("td");
            ownerName.appendChild(document.createTextNode(goblin.owner_name));
            tableRow.appendChild(ownerName);
            var goblinHP = document.createElement("td");
            goblinHP.appendChild(document.createTextNode(goblin.hp));
            tableRow.appendChild(goblinHP);
            var goblinStrength = document.createElement("td");
            goblinStrength.appendChild(document.createTextNode(goblin.strength));
            tableRow.appendChild(goblinStrength);
            var goblinDefense = document.createElement("td");
            goblinDefense.appendChild(document.createTextNode(goblin.defense));
            tableRow.appendChild(goblinDefense);
            var goblinSpeed = document.createElement("td");
            goblinSpeed.appendChild(document.createTextNode(goblin.speed));
            tableRow.appendChild(goblinSpeed);
            var goblinFreePoints = document.createElement("td");
            goblinFreePoints.appendChild(document.createTextNode(goblin.free_points));
            tableRow.appendChild(goblinFreePoints);
            goblinTable.appendChild(tableRow);
            i = i + 1;
        });
    }

    goblinRequest.send();

}

houseRequest.send();
