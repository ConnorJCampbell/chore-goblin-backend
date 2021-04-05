const urlParams = new URLSearchParams(window.location.search);
const houseCode = Cookies.get('code');
const goblinId = urlParams.get('goblinId');


var houseRequest = new XMLHttpRequest();
var goblinRequest = new XMLHttpRequest();
var choreRequest = new XMLHttpRequest();

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
        var choreTable = document.getElementById("choreTable");
        choreRequest.open('GET', 'api/v1/choreList/' + house.id, true);

        choreRequest.onload = function() {
            var chores = JSON.parse(this.response);
            chores.sort(function(a, b){
                var goblinA = goblins.find(function(element) {
                    return element.id == a.goblin_id;
                });
                var goblinB = goblins.find(function(element) {
                    return element.id == b.goblin_id;
                });
                if (goblinA.owner_name < goblinB.owner_name) {
                    return -1;
                }
                if (goblinA.owner_name > goblinB.owner_name) {
                    return 1;
                }
                return b.effort_value - a.effort_value;
            });
            chores.forEach(chore => {
                console.log(chore);
                var goblin = goblins.find(function(element) {
                    return element.id == chore.goblin_id;
                });
                if (goblinId != undefined) {
                    if (goblin.id != goblinId) {
                        return;
                    }
                }

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
                var ownerName = document.createElement("td");
                var ownerLink = document.createElement("a");
                ownerLink.appendChild(document.createTextNode(goblin.owner_name));
                ownerLink.setAttribute("href", "/chores?goblinId=" + goblin.id);
                ownerName.appendChild(ownerLink);
                tableRow.appendChild(ownerName);
                var title = document.createElement("td");
                title.appendChild(document.createTextNode(chore.title));
                tableRow.appendChild(title);
                var status = document.createElement("td");
                status.appendChild(document.createTextNode(chore.status));
                tableRow.appendChild(status);
                var effortValue = document.createElement("td");
                effortValue.appendChild(document.createTextNode(chore.effort_value));
                tableRow.appendChild(effortValue);
                choreTable.appendChild(tableRow);
            });
        }

        choreRequest.send();
        
    }

    goblinRequest.send();

}

houseRequest.send();
