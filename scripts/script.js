/** @type {HTMLElement} */
const header =  document.querySelector("header");
/** @type {HTMLElement} */
const main =  document.querySelector("main");
/** @type {HTMLElement} */
const footer =  document.querySelector("footer");
/** @type {HTMLElement} */
const mobile_nav = document.getElementById('mobile-nav');
var cooldown = false;

function show_nav(state) {
    if (cooldown) {return;}
    // header.style.display = ( state ? 'none' : 'block');
    mobile_nav.style.display = (state ? 'block' : 'none');
    cooldown = true;
    setTimeout(_=>{cooldown = false;}, 100);
}

fetch("header.htm").then(r=>r.text()).then(r=>{header.innerHTML = r; mobile_nav.innerHTML += r; })
fetch("footer.htm").then(r=>r.text()).then(r=>{footer.innerHTML = r;})