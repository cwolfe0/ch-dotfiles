function save_options()
{
	var contextmenu = document.getElementById('contextmenu').checked;
	
	chrome.storage.local.set({contextmenu:contextmenu}, function(){
		document.getElementById('status_saved').style.display = 'inline';
		
		setTimeout(function() {
			document.getElementById('status_saved').style.display = 'none';
		}, 2000);
		
		chrome.runtime.sendMessage(contextmenu ? 'show_menu' : 'hide_menu');
  });
}

function restore_options() {
  chrome.storage.local.get({
    contextmenu: true
  }, function(items) {
    document.getElementById('contextmenu').checked = items.contextmenu;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);