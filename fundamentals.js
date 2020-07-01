import * as THREE from './__3/three.module.js';
//===============================================
var elBox=document.querySelector('.box');
console.log(elBox.className,elBox.className==='box');
console.log(elBox.textContent);
console.log(elBox.innerHTML);
console.log(elBox.innerHTML===elBox.textContent);


// https://threejsfundamentals.org/threejs/lessons/threejs-scenegraph.html
function main() {
  const canvas = document.querySelector('#c_copy');
  const renderer = new THREE.WebGLRenderer({
    canvas:canvas
  });

  const fov = 40;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  const objects = [];

  const radius = 1;
  const widthSegments = 60;
  const heightSegments = 60;
  const sphereGeometry = new THREE.SphereBufferGeometry(
      radius, widthSegments, heightSegments);

  const solarSystem = new THREE.Object3D();

  

  scene.add(solarSystem);
  objects.push(solarSystem);

  const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xec4783});
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(8, 8, 8);
  solarSystem.add(sunMesh);

  var axes=new THREE.AxesHelper(2);
  axes.material.depthTest=false;
  sunMesh.add(axes);


  objects.push(sunMesh);

  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 13;
  solarSystem.add(earthOrbit);
  objects.push(earthOrbit);

  const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);

  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 2;
  earthOrbit.add(moonOrbit);

  const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(.4, .4, .4);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);



  var gridHelper=new THREE.GridHelper();
  earthOrbit.add(gridHelper);
  // var gridHelper2=new THREE.GridHelper();
  // moonOrbit.add(gridHelper2);

  // add an AxesHelper to each node
  objects.forEach((node) => {
    // console.log(node.type); //Object3D,Mesh
    /*if(node.type!=='Object3D'){
      var axes=new THREE.AxesHelper(10);
      axes.material.depthTest=false;
      axes.renderOrder=1;
      node.add(axes);
    }*/
    /*const axes = new THREE.AxesHelper(19);
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    node.add(axes);*/
  });

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.0001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      obj.rotation.y = time;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

//setup
main();

//rotation
//position
//scale