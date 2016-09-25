var cookie_timer = 0;

var cookie_interval = setInterval(function(){
	var c = document.getElementById('cookie-cnil-mobile-close');
	cookie_timer++;
	
	if (c)
		c.click();
	
	if (c || cookie_timer == 1000)
		clearInterval(cookie_interval);
});