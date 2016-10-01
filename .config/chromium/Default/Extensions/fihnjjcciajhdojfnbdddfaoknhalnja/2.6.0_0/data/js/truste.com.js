var c = 0;

var i = setInterval(function(){
	var a = document.querySelector('.pdynamicbutton .call, #gwt-debug-close_id');
	c++;
	
	if (a)
		a.click();
	
	if (a || c == 1000)
		clearInterval(i);
}, 50);