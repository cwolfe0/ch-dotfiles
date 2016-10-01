// Common

function getHostname(url)
{
	var a = document.createElement('a');
	a.href = url;
	
	return a.hostname;
}


// URL blocking

function block_url_callback(details)
{
	return {cancel:true};
}

function set_url_blocking()
{
	if (chrome.webRequest.onBeforeRequest.hasListener(block_url_callback))
		chrome.webRequest.onBeforeRequest.removeListener(block_url_callback);
	
	chrome.webRequest.onBeforeRequest.addListener(block_url_callback, {urls: block_urls}, ["blocking"]);
}


// Whitelisting

var permanent_whitelist = {
	"plus.google.com":1,
	"hangouts.google.com":1,
	"clients5.google.com":1,
	"clients6.google.com":1,
	"arcot.com":1,
	"orteil.dashnet.org":1
};

var global_exclude_list = {};

chrome.storage.local.get('global_exclude_list', function(r) {
	if (typeof r.global_exclude_list != 'undefined')
		global_exclude_list = r.global_exclude_list;
	
	for (var i in permanent_whitelist)
		if (!global_exclude_list[i])
			global_exclude_list[i] = true;
	
	delete permanent_whitelist;
});

function isWhitelisted(hostname)
{
	if (typeof global_exclude_list[hostname] != 'undefined')
		return true;
	
	return false;
}

function toggleWhitelist(info, tab)
{
	if (!/^http/.test(tab.url))
		return;
	
	var hostname = getHostname(tab.url).replace(/^w{2,3}\d*\./i, '');
	
	if (isWhitelisted(hostname))
	{
		delete global_exclude_list[hostname];
		
		for (var i in block_urls_backup)
			if (block_urls_backup[i].indexOf(hostname) > -1)
				block_urls.push(block_urls_backup[i]);
	}
	else
	{
		global_exclude_list[hostname] = true;
		
		var i = block_urls.length;
		
		while (i--)
		{
			if (block_urls[i].indexOf(hostname) > -1)
				block_urls.splice(i, 1);
		}
	}
	
	chrome.storage.local.set({'global_exclude_list': global_exclude_list}, function(){
		chrome.tabs.executeScript(tab.id, {code: 'window.location.reload();'});
	});
	
	set_url_blocking();
}


// Reporting

function reportWebsite(info, tab)
{
	if (!/^http/.test(tab.url))
		return;
	
	var hostname = getHostname(tab.url);
	
	if (hostname.length > 0 && confirm("Would you like to report a cookie warning on this website?"))
	{
		var img = document.createElement('img');
		img.src = 'http://www.kiboke-studio.hr/i-dont-care-about-cookies/report/252.php?d=' + hostname + '&t=' + (new Date()).getTime();
		
		img.onload = function()
		{
			alert("Thanks! This website will probably be free of cookie warnings very soon :)");
			document.body.removeChild(img);
		};
		
		document.body.appendChild(img);
	}
}


// Context menu

var show_contextmenu = true;

function toggleContextMenu(instruction)
{
	chrome.contextMenus.removeAll();
	
	if (instruction == 'show_menu')
	{
		chrome.contextMenus.create({
			"title":'Report a cookie warning',
			"contexts":["page","selection","link","editable","image","video", "audio"],
			"onclick":reportWebsite
		});

		chrome.contextMenus.create({
			"title":'Switch addon on/off on this domain',
			"contexts":["page","selection","link","editable","image","video", "audio"],
			"onclick":toggleWhitelist
		});
		
		chrome.contextMenus.create({
			"title":'Support this project',
			"contexts":["page","selection","link","editable","image","video", "audio"],
			"onclick":function(){window.open("http://www.kiboke-studio.hr/i-dont-care-about-cookies/");}
		});
	}
}

chrome.storage.local.get('contextmenu', function(r) {
	if (typeof r.contextmenu != 'undefined')
		show_contextmenu = r.contextmenu;
	
	toggleContextMenu((show_contextmenu == true ? 'show' : 'hide') + '_menu');
});

chrome.runtime.onMessage.addListener(toggleContextMenu);


// Add global rules

function activate_domain(hostname, tabId, status)
{
	if (typeof rules[hostname] != 'undefined')
	{
		if (isWhitelisted(hostname))
			return true;
		
		if (status == 'loading')
		{
			if (rules[hostname] == 0)
				chrome.tabs.insertCSS(tabId, {file:'data/css/'+hostname+'.css', allFrames:true, runAt:'document_start'});
			else if (rules[hostname] != 'js')
				chrome.tabs.insertCSS(tabId, {file:'data/css/common'+rules[hostname]+'.css', allFrames:true, runAt:'document_start'});
		}
		else if (status == 'complete')
		{
			if (rules[hostname] == 'js')
				chrome.tabs.executeScript(tabId, {file:'data/js/'+hostname+'.js', allFrames:true, runAt:'document_end'});
		}
		
		return true;
	}

	return false;
}


// Adding custom CSS/JS, blocking URLs

var tabs = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	if (!/^http/.test(tab.url))
		return;
	
	// Hash detected
	if (tab.url.indexOf('#') > -1)
	{
		var hash_free_url = tab.url.replace(/#.+/, '');
		
		if (tabs[tab.id] && tabs[tab.id] == hash_free_url)
			return;
		
		tabs[tab.id] = hash_free_url;
	}
	
	if (changeInfo.status == "loading" || changeInfo.status == "complete")
	{
		var hostname = getHostname(tab.url).replace(/^w{2,3}\d*\./i, '');
		
		if (!isWhitelisted(hostname))
			chrome.tabs.insertCSS(tabId, {file:"data/css/common.css", allFrames:true, runAt:'document_start'});
		
		if (activate_domain(hostname, tabId, changeInfo.status))
			return;
		
		var possible_hosts = [];
		var host_parts = hostname.split('.');
		
		for (var i=host_parts.length; i>=2; i--)
			if (activate_domain(host_parts.slice(-1*i).join('.'), tabId, changeInfo.status))
				return true;
	}
});

set_url_blocking();


// Update notification

// chrome.runtime.onInstalled.addListener(function(d){
// 	if (d.reason == "update" && chrome.runtime.getManifest().version > d.previousVersion)
// 	{
// 		chrome.notifications.create(
// 			'update',
// 			{
// 				type: "basic",
// 				title: "'I don't care about cookies' just got better",
// 				message: "324 websites added to the list! You'll see even fewer cookie warnings than before :)",
// 				iconUrl: "http://www.kiboke-studio.hr/i-dont-care-about-cookies/images/chrome2.png",
// 				buttons:[{title:'Make a small donation to support this project.'}]
// 			}
// 		);
// 		
// 		chrome.notifications.onButtonClicked.addListener(function(){
// 			window.open("http://www.kiboke-studio.hr/i-dont-care-about-cookies/?chrome-upgrade");
// 		});
// 	}
// });