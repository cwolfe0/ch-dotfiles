var a = document.querySelector('.white-fill-btn-01');

if (a)
{
	a.click();
	
	if (document.cookie.indexOf("CONSENT") == -1)
	{
		document.cookie = 'CONSENT=YES';
		document.location.reload();
	}
}