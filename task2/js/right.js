function onUpdateInfo()
{
    try
    {
        var input = document.getElementById('input');//get user request value
        if(/^[A-Z]{1}[a-z]+$/.test(input.value))//check if input valid name
        {
            var requests = ['/countries', '/cities', '/populations'];

            var c = [], cc = [], p = 0;//c for first task

            var callback = function (error, result) 
            {
                if(error !== null)
                {
                    console.log(error);
                }
                else
                {
                    var key = false;
                    for(a in result)
                    {
                        //for first task
                        /*if(result[a].hasOwnProperty('continent'))
                        {
                            if (result[a].continent === 'Africa') 
                            {
                                c.push(result[a].name);
                            }
                        }
                        else */if(result[a].hasOwnProperty('country'))
                        {
                            if (result[a].country === input.value) 
                            {
                                cc.push(result[a].name);
                            }
                            /*for (var j = 0; j < c.length; j++) 
                            {
                                if (result[a].country === c[j]) 
                                {
                                    cc.push(result[a].name);
                                }
                            }*/
                        }
                        else if(result[a].hasOwnProperty('count'))
                        {
                            if(cc.length === 0)//for town
                            {
                                if (result[a].name === input.value) 
                                {
                                    p += result[a].count;
                                }
                                if(!key)
                                {    
                                    key = true;
                                }
                            }
                            else//for country
                            {
                                for (var j = 0; j < cc.length; j++) 
                                {
                                    if (result[a].name === cc[j]) 
                                    {
                                        p += result[a].count;
                                    }
                                }
                                if(!key)
                                {    
                                    key = true;
                                }
                            }
                        }
                    }
                    if(key)
                    {
                        if(p === 0)
                        {
                            document.getElementById('output').innerHTML = "No information for " + input.value + "!";
                        }
                        else
                        {
                            document.getElementById('output').innerHTML = "Population of " + input.value + ": " + p;
                        }
                    }
                }
            };

            for (var i = 0; i < 3; i++) 
            {
                getData(requests[i], callback);
            }
        }
        else
        {
            document.getElementById('output').innerHTML = "Not valid input value!";
        }
    }
    catch(err)
    {
        console.log('Exeption occured! ' + err.name + ': ' + err.message /*+ ' stack: ' + err.stack*/);
    }
}