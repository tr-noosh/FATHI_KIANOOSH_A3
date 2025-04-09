/** @type {HTMLElement} */
const linklist =  document.getElementById("linklist");

function getBlogPost(i = 0) {
	fetch(`posts/${i}.htm`)
		.then(r=>{return ( r.ok ? r.text() : Promise.reject(r));})
		.then(addPost)
		.then(_=>{getBlogPost(i+1)})
		.catch(_=>{console.log("No more blog posts.")});
}

function textOrThrow(r) {
	if (r.ok) {
		return r.text();
	}
	return Promise.reject(r);
}

function addPost(postHTML) {
	let post = document.createElement("article");
	post.classList.add("blog-post");

	let postContent = document.createElement("div");
	postContent.innerHTML = postHTML;

	
	let postHead = document.createElement("h2");
	let title = postContent.querySelector('title').text;
	postHead.innerText = title;
	let titleID = title.replaceAll(' ','-').toLowerCase();
	post.id = titleID;
	let link = document.createElement("li");
	link.innerHTML = `<a href="#${titleID}">${title}</a>`;

	post.appendChild(postHead);
	post.appendChild(postContent);

	main.prepend(post);
	linklist.prepend(link);
	mobile_nav.prepend(link.cloneNode());
}

setTimeout(10, getBlogPost(0))