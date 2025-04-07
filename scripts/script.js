/** @type {HTMLElement} */
const header =  document.querySelector("header");
/** @type {HTMLElement} */
const main =  document.querySelector("main");
/** @type {HTMLElement} */
const footer =  document.querySelector("footer");

fetch("header.htm").then(r=>r.text()).then(r=>{header.innerHTML = r;})
fetch("footer.htm").then(r=>r.text()).then(r=>{footer.innerHTML = r;})