if (/cookies/.test(document.location.pathname))
{
	var a = document.querySelector('.knopbox .accept-link');
	
	if (a)
		a.click();
}