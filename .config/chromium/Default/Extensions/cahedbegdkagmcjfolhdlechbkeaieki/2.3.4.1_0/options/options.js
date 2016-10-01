
function loadOptions() {
	var scale = document.getElementById("fieldscale");
	scale.value = localStorage["scale"];

	var usefont = document.getElementById("fieldusefont");
	usefont.checked = (localStorage["usefont"] == "true");

	var keepPopup = document.getElementById("fieldKeepPopup");
	keepPopup.checked = (localStorage["keepPopup"] == "true");

	var hidePUA = document.getElementById("fieldhidePUA");
	hidePUA.checked = (localStorage["hidePUA"] == "true");
	
	var blacklist = document.getElementById("fieldblacklist");
	blacklist.value = localStorage["blacklist"];

	document.getElementById("dontsupport").checked = (localStorage.support == "false");///
}

function saveOptions() {
	var scale = document.getElementById("fieldscale");
	localStorage["scale"] = scale.value;
	
	var usefont = document.getElementById("fieldusefont");
	localStorage["usefont"] = usefont.checked;

	var keepPopup = document.getElementById("fieldKeepPopup");
	localStorage["keepPopup"] = keepPopup.checked;

	var hidePUA = document.getElementById("fieldhidePUA");
	localStorage["hidePUA"] = hidePUA.checked;

	var blacklist = document.getElementById("fieldblacklist");
	localStorage["blacklist"] = blacklist.value;

	localStorage.support = !(document.getElementById("dontsupport").checked);///

	window.close();
}

function cancelOptions() {
	window.close();
}

function init() {
	var save = document.getElementById("buttonsave");
	save.addEventListener("click", saveOptions);

	var cancel = document.getElementById("buttoncancel");
	cancel.addEventListener("click", cancelOptions);

	loadOptions();
}

document.body.addEventListener("load", init());


//
// Some of this is a duplicate of emoji.js
//

var emojisByChar = {}
var items = chardict.items;

for (var i in items) {
  if (items.hasOwnProperty(i)) {
    var chars = items[i].chars;
    for (var j = chars.length; j--;) {
    	var ch = items[i].image.split('.')[0];
      emojisByChar[ch] = items[i];
    }
  }
}

function getEmojiImage(ch) {
  var emoji = emojisByChar[ch];
  if (!emoji) return;
  var img = dummyImage.cloneNode(true);   
  img.title = emoji.name; 
  img.alt = ch; // for copying
  img.src = baseUrl + '/' + emoji.image;      
  img.style.cssText += '; padding: 0 2px !important';   
  return img;
}

function addGlobalStyle() {
  var css = document.createElement("style");
  var cssScale = localStorage.scale + 'em !important';
  css.innerHTML = 'img.chromoji { width:'+ cssScale +'; height:'+ cssScale +'; }' + 
                  '.chromoji-font, #chromoji-font { font-size:'+ cssScale +'; }';
  document.head.appendChild(css);
}

addGlobalStyle();

// init chosen collection
var collectionId = localStorage.collection + 'collection';
document.getElementById(collectionId).classList.add('chosen');

// show collection option
var chars = ["1f600","263a","1f609","1f618","1f61c","1f633","1f602","1f620","1f62f"];

// duplicated content from emoji.js
var dummyImage = document.createElement('img');
dummyImage.className = 'chromoji';

var baseUrl = chrome.extension.getURL('images/apple');
var appleCollection = document.getElementById('applecollection');
for (var i = 0; i < chars.length; i++) {
	appleCollection.appendChild(getEmojiImage(chars[i]));
}

var baseUrl = chrome.extension.getURL('images/google');
var googleCollection = document.getElementById('googlecollection');
for (var i = 0; i < chars.length; i++) {
	googleCollection.appendChild(getEmojiImage(chars[i]));
}

appleCollection.onclick = function () {
	appleCollection.classList.add('chosen');
	googleCollection.classList.remove('chosen');
	localStorage.collection = 'apple';
}

googleCollection.onclick = function () {
	googleCollection.classList.add('chosen');
	appleCollection.classList.remove('chosen');
	localStorage.collection = 'google';
}

