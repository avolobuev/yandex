function updateTable()
{
    try
    {
        var http = new XMLHttpRequest();
        http.onreadystatechange = function()
        {
            if(http.readyState === 4 && http.status === 200)
            {
                document.getElementById('content').innerHTML = http.responseText;
            }
        };
        http.open('GET','php/request.php',true);
        http.send();
    }
    catch(err)
    {
        console.log(err.message);
    }
}

setTimeout(updateTable(), 20000, true);

