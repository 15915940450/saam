import * as THREE from './__three.js-master/build/three.module.js';
import {GLTFLoader} from './__three.js-master/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from './__three.js-master/examples/jsm/controls/OrbitControls.js';


//===============================
//0-dom
var el=document.querySelector('.__test');
var size=[el.clientWidth,el.clientHeight];  //容器大小

//1-object(geometry+material)(loader)


var loader=new GLTFLoader();
var gltfPath='./models/gltf/from_dae_min.gltf';
// var gltfPath='./__three.js-master/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';
loader.load(gltfPath,function(gltf){
  console.log(gltf);
  loadedFn(gltf);
});


var loadedFn=function(gltf){

  //2-scene
  var scene=new THREE.Scene();
  //envmap
  /*var envmapPath='./__three.js-master/examples/textures/cube/Bridge2/';
  var format='.jpg';
  var envmap=new THREE.CubeTextureLoader().load([
    `${envmapPath}posx${format}`,
    `${envmapPath}negx${format}`,
    `${envmapPath}posy${format}`,
    `${envmapPath}negy${format}`,
    `${envmapPath}posz${format}`,
    `${envmapPath}negz${format}`
  ]);
  scene.background=envmap;
  gltf.scene.traverse(function(child){
    if(child.isMesh){
      child.material.envMap=envmap;
    }
  });*/
  // var arrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3( 0, 0, 0 ), 1000, 0xff0000 );
  // scene.add( arrowHelper );
  var axishelper = new THREE.AxesHelper(3000);
  scene.add( axishelper );
  gltf.scene.position.y=0;
  gltf.scene.position.x=0;
  gltf.scene.position.z=18;
  scene.add(gltf.scene);

  //2.5-light
  var light = new THREE.PointLight(0xffffff,1);
  light.position.set(0,20,10);
  scene.add( light );

  var lighthelper = new THREE.PointLightHelper(light);
  scene.add(lighthelper);

  //3-camera
  var camera=new THREE.PerspectiveCamera(75,size[0]/size[1],10,1e6);
  camera.position.set(-10,20,40);
  
  

  //4-renderer
  var renderer=new THREE.WebGLRenderer({
    antialias:true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(size[0],size[1]);
  renderer.outputEncoding=THREE.sRGBEncoding;
  el.appendChild(renderer.domElement);

  //4.5-controls
  var controls=new OrbitControls(camera,renderer.domElement);
  controls.target.set(0,0,0);
  controls.autoRotate=true;

  console.log(scene);


  //5-requestAnimationFrame
  var rafCallback=function(){
    renderer.render(scene,camera);
    // camera.position.y+=.02;
    controls.update();

    window.requestAnimationFrame(rafCallback);
  };
  rafCallback();

};
