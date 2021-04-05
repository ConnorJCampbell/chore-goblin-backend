/* Set the width of the side navigation to 250px */
function openNav() {
    if (document.getElementById("sideNavBar").style.width == "250px") {
        document.getElementById("sideNavBar").style.width = "0";
    } else {
        document.getElementById("sideNavBar").style.width = "250px";
    }
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("sideNavBar").style.width = "0";
} 