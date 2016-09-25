var cookie_timer = 0;

var cookie_interval = setInterval(function(){
	var e = document.getElementById('gh-cookiebanner-close');
	cookie_timer++;
	
	if (e)
		e.click();
	
	if (e || cookie_timer == 1000)
		clearInterval(cookie_interval);
});