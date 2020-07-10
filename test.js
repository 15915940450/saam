import * as THREE from './__3/three.module.js';
import {OrbitControls} from './__3/OrbitControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 60;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2.5;

  const controls = new OrbitControls(camera, canvas);
  // controls.enableDamping = true;
  // controls.enablePan = false;
  // controls.minDistance = 1.2;
  // controls.maxDistance = 4;
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#d50000');

  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./resources/images/country-outlines-4k.png', render);
    const geometry = new THREE.SphereBufferGeometry(1, 64, 32);
    const material = new THREE.MeshBasicMaterial({map: texture});
    scene.add(new THREE.Mesh(geometry, material));
  }

  async function loadJSON(url) {
    const req = await fetch(url);
    // console.log(req);
    var reqjson=req.json();
    // console.log(reqjson);
    return reqjson;
  }


  //============================================================================fetch
  var tttoken="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySW5mbyI6IntcImlkXCI6XCI2MkVCREUwMEEzRDQ0MTE4QjVEMTEzMzU5QkYxM0IyM1wiLFwicGhvbmVcIjpcIjE5OTY2NjY5OTk5XCIsXCJuYW1lXCI6XCJpbGlcIixcInJvbGVzXCI6W3tcImlkXCI6XCI0Y2Y0OWYyNjExMTM0NTdkYmVlOWFmYzg2ZWMwNWU1ZFwiLFwibmFtZVwiOlwic3VwZXJhZG1pblwiLFwiZW5hYmxlZFwiOjEsXCJ0aW1lXCI6MTUwMTgyNzMxNjAwMCxcImRlc2NyaXB0aW9uXCI6XCLotoXnuqfnrqHnkIblkZgxMjNcIixcInBsYXRmb3JtXCI6MSxcImVkaXRcIjoxfV19IiwidGltZSI6MTU5NDM0NTc3NzAzOSwiZXhwIjoxNTk0MzUyOTc3fQ.Jq7qQcLHALJCIn1HgYH5BbgUQZyza7uFF8wIyn4JHbc"
  async function rqs(){
    var __url='http://admin.ce59e336fb1da4a72a0f53e21dd1598a6.cn-shenzhen.alicontainer.com/ecadmin/statistics/total';
    var x=await fetch(__url,{
      headers:{
        AccessToken:tttoken
      }
    });
    var json=x.json();
    console.log(json);
    console.log(typeof json);
    json.then(function(aaa){
      console.log(aaa);
    });
  };
  rqs();
  /*var __url='http://ecadmin.ce59e336fb1da4a72a0f53e21dd1598a6.cn-shenzhen.alicontainer.com/ecadmin/statistics/total';
  fetch(__url).then(function(res){
    return (res.json());
  }).then(function(json){
    console.log(json);
  });*/
  //============================================================================

  /*
  //上述代碼的寫法就是具有適當錯誤處理的簡單明確的鍊式寫法。

  doSomething()
  .then(function(result) {
    return doSomethingElse(result);
  })
  .then(newResult => doThirdThing(newResult))
  .then(() => doFourthThing())
  .catch(error => console.log(error));

  //使用async/await可以解決以上大多數錯誤，使用async/await時，最常見的語法錯誤就是忘記了await關鍵字。
  */

  let countryInfos;
  async function loadCountryData() {
    countryInfos = await loadJSON('./resources/country-info.json');
    // console.log(countryInfos);

    const lonFudge = Math.PI * 1.5;
    const latFudge = Math.PI;
    // these helpers will make it easy to position the boxes
    // We can rotate the lon helper on its Y axis to the longitude
    const lonHelper = new THREE.Object3D();
    // We rotate the latHelper on its X axis to the latitude
    const latHelper = new THREE.Object3D();
    lonHelper.add(latHelper);
    // The position helper moves the object to the edge of the sphere
    const positionHelper = new THREE.Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper);

    const labelParentElem = document.querySelector('#labels');
    for (const countryInfo of countryInfos) {
      const {lat, lon, name} = countryInfo;

      // adjust the helpers to point to the latitude and longitude
      lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + lonFudge;
      latHelper.rotation.x = THREE.MathUtils.degToRad(lat) + latFudge;

      // get the position of the lat/lon
      positionHelper.updateWorldMatrix(true, false);
      const position = new THREE.Vector3();
      positionHelper.getWorldPosition(position);
      countryInfo.position = position;

      // add an element for each country
      const elem = document.createElement('div');
      elem.textContent = name;
      labelParentElem.appendChild(elem);
      countryInfo.elem = elem;
    }
    requestRenderIfNotRequested();
  }
  loadCountryData();

  const tempV = new THREE.Vector3();

  function updateLabels() {
    // exit if we have not yet loaded the JSON file
    if (!countryInfos) {
      return;
    }

    for (const countryInfo of countryInfos) {
      const {position, elem} = countryInfo;

      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      tempV.copy(position);
      tempV.project(camera);

      // convert the normalized position to CSS coordinates
      const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
      const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

      // move the elem to that position
      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

      // set the zIndex for sorting
      elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
    }
  }

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

  let renderRequested = false;

  function render() {
    renderRequested = undefined;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();

    updateLabels();

    renderer.render(scene, camera);
  }
  render();

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }

  controls.addEventListener('change', requestRenderIfNotRequested);
  window.addEventListener('resize', requestRenderIfNotRequested);
}

main();
