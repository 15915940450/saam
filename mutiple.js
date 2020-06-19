// Three.js - Multiple Scenes - Controls
// from https://threejsfundamentals.org/threejs/threejs-multiple-scenes-controls.html


import * as THREE from './__3/three.module.js';
import {TrackballControls} from './__three.js-master/examples/jsm/controls/TrackballControls.js';


function main() {
  const canvas = document.querySelector('#c');
  // We make a single Renderer and then one Scene for each virtual canvas.
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true});

  const sceneElements = [];
  function addScene(elem, fn) {
    sceneElements.push({elem, fn});
  }

  function makeScene(elem) {
    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1, 2);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    const controls = new TrackballControls(camera, elem);
    controls.noZoom = true;
    controls.noPan = true;

    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      /*
      You'll notice we added the camera to the scene and the light to the camera. This makes the light relative to the camera. Since the TrackballControls are moving the camera this is probably what we want. It keeps the light shining on the side of the object we are looking at.
      */
      camera.add(light);
      // scene.add(light);
    }

    return {scene, camera, controls};
  }

  const sceneInitFunctionsByName = {
    'box': (elem) => {
      const {scene, camera, controls} = makeScene(elem);
      const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({color: 'red'});
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return (time, rect) => {
        mesh.rotation.y = time * .1;
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        controls.handleResize();
        controls.update();
        renderer.render(scene, camera);
      };
    },
    'pyramid': (elem) => {
      const {scene, camera, controls} = makeScene(elem);
      const radius = .8;
      const widthSegments = 4;
      const heightSegments = 2;
      const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
      const material = new THREE.MeshPhongMaterial({
        color: 'blue',
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return (time, rect) => {
        mesh.rotation.y = time * .1;
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        controls.handleResize();
        controls.update();
        renderer.render(scene, camera);
      };
    },
  };

  document.querySelectorAll('[data-diagram]').forEach((elem) => {
    const sceneName = elem.dataset.diagram;
    const sceneInitFunction = sceneInitFunctionsByName[sceneName];
    const sceneRenderFunction = sceneInitFunction(elem);
    addScene(elem, sceneRenderFunction);
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

  const clearColor = new THREE.Color('#000');
  function render(time) {
    time *= 0.001;

    resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(false);
    renderer.setClearColor(clearColor, 0);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    const transform = `translateY(${window.scrollY}px)`;
    renderer.domElement.style.transform = transform;

    for (const {elem, fn} of sceneElements) {
      // get the viewport relative position of this element
      const rect = elem.getBoundingClientRect();
      const {left, right, top, bottom, width, height} = rect;

      const isOffscreen =
          bottom < 0 ||
          top > renderer.domElement.clientHeight ||
          right < 0 ||
          left > renderer.domElement.clientWidth;

      if (!isOffscreen) {
        const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);

        fn(time, rect);
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();


var what=document.querySelector('.bcrect').getBoundingClientRect();
console.log(what);

//https://usefulangle.com/post/179/jquery-offset-vanilla-javascript

