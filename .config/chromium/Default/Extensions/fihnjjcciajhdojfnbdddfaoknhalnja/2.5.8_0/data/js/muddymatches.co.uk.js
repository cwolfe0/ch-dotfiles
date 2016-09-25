function proceed()
{
	var c = document.getElementById('cookie_permission_submit');
	
	if (!c)
	{
		setTimeout(proceed, 1);
		return;
	}
	
	c.click();
}

proceed();