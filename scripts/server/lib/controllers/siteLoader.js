var url = require('url');
var path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');
var pg = require('pg');
var mapBoxAPIToken = ""; //Set your token here!

exports.getMapBoxAPIToken = function (request, response, next)
{
	response.write(mapBoxAPIToken);
	response.end();
};

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '',
        pass: ''
    }
});

exports.sendEmail = function (request, response, next)
{
	var mailOptions = {
	    from: '', // sender address
	    to: '', // list of receivers
	    subject: '', // Subject line
	    text: decodeURI(request.params.body) , // plaintext body
	    html: decodeURI(request.params.body)  // html body
	};
	console.log(mailOptions);
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	    	console.log(error);
      		response.writeHead(200, {"Content-Type": "text/plain"});
	      	response.write(error);
	      	response.end();
	    }else{
      	  response.writeHead(200, {"Content-Type": "text/plain"});
	      response.write("" );
	      response.end();
	    }
	});
}

exports.bufferFeatures  = function (request, response, next)
{
	var connString = 'pg://postgres:P%ssword39@localhost:5432/bend_taxlots';

	var geojson= request.params.geometry;

    pg.connect(connString, function(err, client) {
        var sql =   "select ST_AsGeoJSON(geom) as shape ";
        sql = sql + "from public.taxlots ";
        sql = sql + "where ST_Intersects(geography(ST_GeomFromGeoJSON('"+geojson+"')), geography(geom))";
        console.log(sql);
        client.query(sql, function(err, result) {
            var featureCollection = new FeatureCollection();
            for (i = 0; i < result.rows.length; i++)
            {
                featureCollection.features[i] = JSON.parse(result.rows[i].shape);
            }
            response.send(featureCollection);
        });
    });
}

// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = new Array();
}

exports.loadsite = function (request, response, next)
{
	console.log('Called Load Site');

  	var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

    console.log(request);
    console.log(response);

  if(request.url.toLowerCase().indexOf("/controllers/") > -1)
	filename = "";
  if(request.url.toLowerCase().indexOf("/appServer/") > -1)
	filename = "";
  if(request.url.toLowerCase().indexOf("/utilities/") > -1)
	filename = "";

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n" + filename );
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

	console.log(filename);
	fs.readFile(filename, "binary", function(err, file) {
		if(err) {        
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(err + "\n");
			response.end();
			return;
		}
		var responseType = "";	  
		//fix specifically for contenttype in css, if not included IE9 it doesn't render for security purposes 
		switch(path.extname(filename))
		{
		case ".html":
			responseType = "text/html";
			break;
		case ".js":
			responseType = "text/javascript";
			break;
		case ".css":
			responseType = "text/css";
			break;	
		default:
			//nada
			break;
		}
		console.log(responseType);
		responseType !== "" ? response.writeHead(200, {"Content-Type": responseType}) : false;
		response.write(file, "binary");
		response.end();
	});
  }); 

} 
