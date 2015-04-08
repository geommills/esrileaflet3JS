
var container;
var camera, controls, scene;
var mesh, texture;
var worldWidth = 256, worldDepth = 256,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var clock;
var helper;
var mouse;
var helperTerrainGrid1, helperTerrainGrid2;

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

function createHelperGrids(width, height)
{
	var geometry1 = new THREE.PlaneBufferGeometry( width, height, worldWidth - 1, worldDepth - 1 );
	var geometry2 = new THREE.PlaneBufferGeometry( width, height, worldWidth - 1, worldDepth - 1 );
	geometry1.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	geometry2.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	for ( var j = 0; j < geometry2.attributes.position.array.length; j +=3 ) {
		geometry1.attributes.position.array[ j+1 ] = geometry1.attributes.position.array[ j+1 ] - 2;
		geometry2.attributes.position.array[ j+1 ] = geometry2.attributes.position.array[ j+1 ]- 200;
	}

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


		


	var geometry = new THREE.PlaneBufferGeometry( width, height, worldWidth - 1, worldDepth - 1 );

	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );	

	THREE.ImageUtils.crossOrigin = "";
	var material = new THREE.MeshLambertMaterial({
		          	map: THREE.ImageUtils.loadTexture(imageUrl),
					transparent: true,
					opacity: 1 
		        });
	mesh = new THREE.Mesh( geometry, material );

	scene.add(mesh);
	createHelperGrids(width, height);
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