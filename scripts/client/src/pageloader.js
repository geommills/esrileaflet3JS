
var layer;
function loadPage()
{
      loadMap();
      $('#map3D').css('display', 'none');

}
function  changeView(target){
        $('#twoControl').removeClass('active');
        $('#threeControl').removeClass('active');
        $('#' + target).addClass('active');
        if(target==='twoControl')
        {
      		$('#map3D').css('display', 'none');
      		$('#map2D').css('display', 'block');
      		map.invalidateSize();
        }
        else if(target==='threeControl')
        {
      		$('#map2D').css('display', 'none');
      		$('#map3D').css('display', 'block');

          var extent = map.getBounds();
          var width = window.innerWidth;
          var height = window.innerHeight;
          var mapurl = layer._url.toString().replace("/tile/{z}/{y}/{x}", "").replace("{s}", "services");
          console.log(scene);
          if(scene)
          {
              scene.remove(mesh);
              createTerrain(width, height, extent, mapurl);
          }
          else
          {
              load3D(width, height, extent, mapurl);
          }
        }
}

