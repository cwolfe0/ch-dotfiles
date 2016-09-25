
function setDefaultSettings() {
	if (typeof localStorage.scale == 'undefined')
		localStorage.scale = 1.2;
    if (typeof localStorage.hidePUA == 'undefined') 
        localStorage.hidePUA = 'true';
    if (typeof localStorage.usefont == 'undefined') 
    	localStorage.usefont = 'false';
    if (typeof localStorage.keepPopup == 'undefined') 
        localStorage.keepPopup = 'false';
    if (typeof localStorage.blacklist == 'undefined') 
        localStorage.blacklist = 'example.com, another-example.com';
    if (typeof localStorage.collection == 'undefined') 
        localStorage.collection = 'apple';
    if (localStorage.scale === '1.0')
        localStorage.scale = '1.2'
}

function listener(request, sender, sendResponse) {
    if (request == 'get_settings') {
        var blacklist = localStorage.blacklist;
        blacklist = blacklist.replace(/\n/g, ',');
        blacklist = blacklist.replace(/,+/g, ',');
        blacklist = blacklist.replace(/^,|,$/g, '');
        blacklist = blacklist.split(',');
        for (var i = blacklist.length; i--;)
            blacklist[i] = blacklist[i].trim(); // TODO: on save?
        if (blacklist.length == 1 && !blacklist[0]) 
            blacklist = [];
    
        sendResponse({
            scale:      localStorage.scale,
            usefont:    localStorage.usefont   == 'true',
            keepPopup:  localStorage.keepPopup == 'true',
            hidePUA:    localStorage.hidePUA   == 'true',
            collection: localStorage.collection,
            blacklist:  blacklist
        });
    }
    /*
    if (request == 'insertCSS') {
        chrome.tabs.insertCSS(sender.tab.id, {
          file: 'backup/sprite/sprite.css',
          allFrames: true
        })
        return true
    }
    */
}

setDefaultSettings();
chrome.extension.onMessage.addListener(listener);




//
// Emoji pasting
//

localStorage.message_id = 0;

// listen to other tabs, last one always overwrites the others
chrome.extension.onMessage.addListener(function (message) {
    if (message.name == "input_deselected") {
        localStorage.message_id = 0;
    } 
    else if (message.name == "input_selected") {
        localStorage.message_id = message.id;
    }
});

// changing tabs should invalidate pending messages
chrome.tabs.onActivated.addListener(function () {
    localStorage.message_id = 0;
});

// add content script manually upon first run (just installed/enabled)
// (NOTE: currently doesn't work, requires tab permission)
chrome.tabs.query({}, function (tabs) {
	tabs.forEach(function (tab) {
		if (!tab.url || /^chrome/.test(tab.url)) return;
		chrome.tabs.insertCSS(tab.id, {
		    file: "emoji.css", allFrames: true
		});
		chrome.tabs.executeScript(tab.id, {
		    file: "chardict.js", allFrames: true
		});
		chrome.tabs.executeScript(tab.id, {
		    file: "emoji.js", allFrames: true
		});
		chrome.tabs.executeScript(tab.id, {
		    file: "emoji_insert.js", allFrames: true
		});
	})
});

// welcome page upon first install 
// check for event & setting cause only one of these is not sufficient
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == 'install' && localStorage.welcome_shown != 'true') {
    localStorage.welcome_shown  = 'true';
    localStorage.update_2_shown = 'true'; // only show welcome if it's a new install
    chrome.tabs.create({
        url: chrome.extension.getURL('welcome.html'),
        selected: true
     });
  }
  else if (details.reason == 'update' && localStorage.update_2_shown != 'true') {
    localStorage.update_2_shown = 'true';
    //chrome.tabs.create({
    //    url: chrome.extension.getURL('update.html'),
    //    selected: true
    //});
  }

});