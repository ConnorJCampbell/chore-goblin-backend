var input = document.getElementById("house_code");

//eat enter key presses and click the button instead
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("submitHouseCode").click();
  }
}); 

function hideCookieWarning() {
    var cookieWarning = document.getElementById("CookieWarning");
    cookieWarning.style.height = "0px";
}

function submitHouseCode() {
    var houseCode = document.getElementById("house_code").value;
    
    var houseRequest = new XMLHttpRequest();

    houseRequest.open('GET', '/api/v1/houses/' + houseCode, true);

    houseRequest.onload = function() {
        console.log(this.response);
        if (this.response) {
            var house = JSON.parse(this.response);
            Cookies.set('code', house.code);
            window.location.href = '/chores';
        } else {
            alert('Invalid house code')
        }
    }

    houseRequest.send();
    

}