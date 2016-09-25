var cookie_timer = 0;

var cookie_interval = setInterval(function(){
	var a = document.querySelector('body.sitewide-consent-visible .consent-close');
	cookie_timer++;
	
	if (a)
		a.click();
	
	if (cookie_timer == 1000)
		clearInterval(cookie_interval);
}, 50);