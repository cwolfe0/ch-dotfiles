var i = setInterval(function(){
	var e = document.querySelector('#cookie_compliance:not(.hidden) #agree_cc');
	
	if (e)
		e.click();
},50);

// FF detach
typeof self == 'object' && self.port && self.port.on("detach", function() {clearInterval(i)});