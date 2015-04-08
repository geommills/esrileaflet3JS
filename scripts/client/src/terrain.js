
var container;
var camera, controls, scene;
var mesh, texture;
var worldWidth = 256, worldDepth = 256,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var clock;
var helper;
var mouse;
var helperTerrainGrid1, helperTerrainGrid2;
var previousExtent;
var previousGeometry;

var accessToken = ""; //Set Mapbox access token here...

function load3D(width, height, extent, mapurl)
{
	if ( ! Detector.webgl ) {
		Detector.addGetWebGLMessage();
	}
	init3JS();
	createTerrain(width, height, extent, mapurl);
	animate();
}	

function init3JS() {
		scene = null;
   	 	renderer = null;
    	camera = null;
    	clock = null;
		clock = new THREE.Clock();	
		mouse = new THREE.Vector2();	
		container = document.getElementById( 'map3D' );
		empty(container);
		container.innerHTML = "";
		scene = new THREE.Scene();
		scene.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
		camera = scene.camera;
		controls = new THREE.OrbitControls(camera);
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0x333333 );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth-4, window.innerHeight-4 );
		controls.center.set( 0.0, 50.0, 0.0 );
		controls.userPanSpeed = 100;
		camera.position.y =  controls.center.y + 800;
		camera.position.x = 0;
		camera.position.z = 500;
		container.appendChild( renderer.domElement );        
		var ambientLight = new THREE.AmbientLight(0xbbbbbb);
		scene.add(ambientLight);
		window.addEventListener( 'resize', onWindowResize, false );
}

function createHelperGrids(geometry1, geometry2)
{
	

	helperTerrainGrid1 = new THREE.Mesh(
		geometry1, 
		new THREE.MeshBasicMaterial({ 
			color: 0x888888, //0x888888, 
			wireframe: true, 
			transparent: true,
			opacity: 0.1 
		})
	); 
	scene.add(helperTerrainGrid1 );	

	helperTerrainGrid2 = new THREE.Mesh(
		geometry2, 
			new THREE.MeshBasicMaterial({ 
				color: 0x8888FF, //0x888888, 
				wireframe: true, 
				transparent: true,
				opacity: 0.1 
			})
	); 
	scene.add(helperTerrainGrid2 );	
}

function createTerrain(width, height, extent, mapurl){
	var totalPoints =50;
	var ratio = 0;
	var xdiff = 0;
	var ydiff = 0;
	if(width > height)
	{
		ratio = width / height;
		xdiff = Math.sqrt((ratio * totalPoints));
		ydiff = xdiff / ratio;
	}
	else
	{
		ratio = height / width;
		ydiff = Math.sqrt((ratio * totalPoints));
		xdiff = ydiff / ratio;
	}
	xdiff = Math.floor(xdiff);
	ydiff = Math.floor(ydiff);
	console.log("X Stagger", xdiff);
	console.log("Y Stagger", ydiff);

    if(mesh){
    	scene.remove(mesh);
		scene.remove(helperTerrainGrid1);
		scene.remove(helperTerrainGrid2);
	}
	var extentString = extent._southWest.lng + "," 
		+ extent._southWest.lat + "," 
		+ extent._northEast.lng + "," 
		+ extent._northEast.lat;

	var imageUrl = mapurl+"/export?"
		+ "bbox="+ extentString+"&bboxSR=4326&layers=&layerDefs=&size=" + window.innerWidth +"%2C" + window.innerHeight 
		+ "&imageSR=&format=jpg&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=image";

	var xInterval = (extent._northEast.lng - extent._southWest.lng) / xdiff;
	var yInterval = (extent._northEast.lat - extent._southWest.lat) / ydiff;
	console.log("xInterval", xInterval);
	console.log("yInterval", yInterval);
	var newWidth = xdiff * Math.floor(width / xdiff);
	var newHeight = ydiff * Math.floor(height / ydiff);

	var geometry = new THREE.PlaneBufferGeometry(newWidth, newHeight, xdiff-1, ydiff-1 );

	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );	

	var derivedPoints = "";
	var xAdd = 0;
	var yAdd = 0;
	var newX = 0;
	var newY = 0;
	console.log("Geometry Size: ", geometry.attributes.position.array.length);
	for ( var j = 0; j < geometry.attributes.position.array.length; j=j+3 ) {
		console.log("XPosition:", ((geometry.attributes.position.array[j] + (newWidth / 2)) / xdiff));
		xAdd = ((geometry.attributes.position.array[j] + (newWidth / 2)) / xdiff) * xInterval;
		yAdd = ((geometry.attributes.position.array[j+2] + (newHeight / 2)) / ydiff) * yInterval;
		newX = extent._southWest.lng + xAdd;
		newY = extent._southWest.lat + yAdd;		
		if(derivedPoints !== "") derivedPoints = derivedPoints + ';';
		derivedPoints += newX + "," + newY
	}
	var mapboxUrl = "https://api.tiles.mapbox.com/v4/surface/mapbox.mapbox-terrain-v1.json";
	console.log(mapboxUrl);
	console.log(derivedPoints);

	if(previousExtent === extentString)
	{
		geometry = previousGeometry
		accessToken = ""; //prevents calling mapbox too much;
	}

	if(accessToken !== "")
	{
		$.ajax({
	        url:  mapboxUrl,
	        type: 'get',
        	data: {
	            points: derivedPoints,
	            layer: "contour",
	            fields: "ele", 
	            access_token: accessToken
        	},
	        success: function(result){
	        	console.log("Results Length: ", result.results.length);
	        	var geoArrayPos = 0;
	        	var minZ = result.results[0].ele;
	        	minZ = 1000000;
				for ( var j = 0; j < result.results.length; j++ ) {
					if(minZ > result.results[j].ele && result.results[j].ele !== null)
					{
						minZ = result.results[j].ele;
					}
				}
				var previousZ = 0;
				var zVal = 0;
				for ( var i = 0; i < result.results.length; i++ ) {
					if(result.results[i].ele === null){
						zVal = previousZ;
					}
					else
					{
						zVal = (result.results[i].ele - minZ)/ 3;
						previousZ = zVal;
					}
					for ( var j = 0; j < geometry.attributes.position.array.length; j=j+3 ) {
						xAdd = ((geometry.attributes.position.array[j] + (newWidth / 2)) / xdiff) * xInterval;
						yAdd = ((geometry.attributes.position.array[j+2] + (newHeight / 2)) / ydiff) * yInterval;
						newX = extent._southWest.lng + xAdd;
						newY = extent._southWest.lat + yAdd;
						if(newX === result.results[i].latlng.lng && newY === result.results[i].latlng.lat)
						{ 
							geometry.attributes.position.array[j+1] = zVal;
						}
					}				
				}
		       	THREE.ImageUtils.crossOrigin = "";
				var material = new THREE.MeshLambertMaterial({
					          	map: THREE.ImageUtils.loadTexture(imageUrl),
								transparent: true,
								opacity: 1 
					        });
				mesh = new THREE.Mesh( geometry, material );
				previousGeometry = geometry;
				previousExtent = extentString;
				scene.add(mesh);
				var geometry1 = new THREE.PlaneBufferGeometry(newWidth, newHeight , xdiff-1, ydiff-1);
				var geometry2 = new THREE.PlaneBufferGeometry(newWidth, newHeight , xdiff-1, ydiff-1);
				geometry1.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
				geometry2.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
				for ( var j = 0; j < geometry2.attributes.position.array.length; j +=3 ) {
					geometry1.attributes.position.array[ j+1 ] = geometry.attributes.position.array[ j+1 ] - 2;
					geometry2.attributes.position.array[ j+1 ] = geometry2.attributes.position.array[ j+1 ]- 200;
				}
				createHelperGrids(geometry1, geometry2);
	        },
	    });
	}
	else
	{		
		THREE.ImageUtils.crossOrigin = "";
		var material = new THREE.MeshLambertMaterial({
					          	map: THREE.ImageUtils.loadTexture(imageUrl),
								transparent: true,
								opacity: 1 
					        });
		mesh = new THREE.Mesh( geometry, material );
		scene.add(mesh);
		var geometry1 = new THREE.PlaneBufferGeometry(newWidth, newHeight , xdiff-1, ydiff-1);
		var geometry2 = new THREE.PlaneBufferGeometry(newWidth, newHeight , xdiff-1, ydiff-1);
		geometry1.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
		geometry2.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		for ( var j = 0; j < geometry2.attributes.position.array.length; j +=3 ) {
			geometry1.attributes.position.array[ j+1 ] = geometry1.attributes.position.array[ j+1 ] - 2;
			geometry2.attributes.position.array[ j+1 ] = geometry2.attributes.position.array[ j+1 ]- 200;
		}
		createHelperGrids(geometry1, geometry2);
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth-4, window.innerHeight-4 );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	controls.update( clock.getDelta() );
	renderer.render( scene, camera );
}

function empty(elem) {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
}