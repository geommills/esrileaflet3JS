var flag = true;

$(document).ready(function () 
{
	$('.img-circle').click(function(e)
		{
    	if(flag)
        	$(e.target).animate(
        		{
        			width: [ '340px' , "linear" ],
        			height: [ '340px' , "linear" ]
        		}, 800, function()
        			{
            		//animation complete.
        			});    					
    	else
        	$(e.target).animate(
        		{
        			width: [ '140px' , "linear" ],
        			height: [ '140px' , "linear" ]
        		}, 800, function()
    				{
    				//animation complete.
					});
    	flag=!flag;	
    });
});
