var cookie_timer = 0;

var cookie_interval = setInterval(function(){
	var a = document.querySelector('.fancybox-close');
	cookie_timer++;
	
	if (a)
		a.click();
	
	if (a || cookie_timer == 1000)
		clearInterval(cookie_interval);
});