function proceed()
{
	var c = document.getElementById('acceptCheck');
	
	if (!c)
	{
		setTimeout(proceed, 1);
		return;
	}
	
	c.click();
	document.getElementsByClassName('ui-dialog-buttonpane')[0].getElementsByTagName('button')[0].click();
}

proceed();