var cookie_timer = 0;

var cookie_interval = setInterval(function(){
	var a = document.querySelectorAll('#footer > div[style*="position:fixed"] a');
	cookie_timer++;
	
	if (a.length > 1)
		a[1].click();
	
	if (a.length > 1 || cookie_timer == 1000)
		clearInterval(cookie_interval);
});