import * as THREE from './__3/three.module.js';
import {OrbitControls} from './__3/OrbitControls.js';
import {GLTFLoader} from './__three.js-master/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from './__3/dat.gui.module.js';

window.__3=THREE;

class GPUPickHelper {
  constructor(){
    this.pickingTexture=new THREE.WebGLRenderTarget(1,1);
    this.pixelBuffer=new Uint8Array(4);
    this.pickedObject=null;
    this.pickedObjectSavedColor=0;
  }

  pick(time,renderer,obj){
    var {pickingTexture,pixelBuffer}=this;
      

    if(this.pickedObject){
      this.pickedObject.material.color.setHex(this.pickedObjectSavedColor);
      this.pickedObject=undefined;
    }

    /*
    https://sanonz.github.io/2018/offscreen-render-target-with-three-js/
    */
    var pixelRatio=renderer.getPixelRatio();
    var fullWidth=renderer.getContext().drawingBufferWidth;
    var fullTop=renderer.getContext().drawingBufferHeight;
    var x=obj.pickPosition.x*pixelRatio | 0;
    var y=obj.pickPosition.y*pixelRatio | 0;
    obj.camera.setViewOffset(fullWidth,fullTop,x,y,1,1);

    renderer.setRenderTarget(pickingTexture);
    renderer.render(obj.pickingScene,obj.camera);
    renderer.setRenderTarget(null);


    obj.camera.clearViewOffset();

    renderer.readRenderTargetPixels(pickingTexture,0,0,1,1,pixelBuffer);

    var id=(pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2])
    // console.log(pixelBuffer); __rgba__ Uint8Array(4) [0, 0, 37, 255]
    var intersectedObject=obj.idToObject[id];
    if(intersectedObject){
      // console.log(intersectedObject);
      this.pickedObject=intersectedObject;
      this.pickedObjectSavedColor=this.pickedObject.material.color.getHex();
      this.pickedObject.material.color.setHex((time*1) % 2 > 1 ? 0xFF0000 : 0x0000FF);
    }
  }
}

class O_xyz {
  constructor(){
    this.canvas=document.querySelector('#c');
    this.pickPosition={
      x:0,
      y:0
    };
    this.idToObject={};
  }
  init(){
    this.createScene();
    this.createAcamera();
    this.createControls();
    this.createRT();
    this.addMesh();
    this.addLight();
    this.gui();

    this.addPickEvent();

    this.render();
    // console.log(this);
  }

  //===渲染
  render(){
    let f=this;
    let renderer=new THREE.WebGLRenderer({
      canvas:this.canvas
    });

    //The first thing we need to do is turn on shadows in the renderer.
    // renderer.shadowMap.enabled=true;
    // renderer.autoClearColor = false;

    
    //raf
    let rafCallback=function(time){
      time=time/1000;

      //操作物件得以渲染出变化(运动)
      f.operateMeshInRender(time);
      
      
      //camera aspect
      if(f.resizeRenderer2DisplaySize(renderer)){
        f.camera.aspect=f.canvas.clientWidth/f.canvas.clientHeight;
        f.camera.updateProjectionMatrix();
      }

      pickHelper.pick(time,renderer,f);
      renderer.render(f.scene,f.camera);

      window.requestAnimationFrame(rafCallback);
    };
    window.requestAnimationFrame(rafCallback);
  }

  //set canvas drawingbuffer
  resizeRenderer2DisplaySize(renderer){
    let needResize=true;
    let targetWidth=this.canvas.clientWidth*window.devicePixelRatio | 0;
    let targetHeight=this.canvas.clientHeight*window.devicePixelRatio | 0;

    if(targetWidth===this.canvas.width && targetHeight===this.canvas.height){
      needResize=false;
    }

    if(needResize){
      renderer.setSize(targetWidth,targetHeight,false);
    }

    return (needResize);
  }

  //相机
  createAcamera(){
    let fov=45;
    let aspect=2; //默认是2
    let near=0.1;
    let far=100;
    //摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。
    this.camera=new THREE.PerspectiveCamera(fov,aspect,near,far);

    this.camera.position.set(5,10,30);
    // this.camera.up.set(0,0,1);
    // this.camera.lookAt(0,0,0);
    this.cameraPole=new THREE.Object3D();
    this.cameraPole.name='cameraPole';
    this.cameraPole.add(this.camera);
    this.scene.add(this.cameraPole);
  }
  //环绕控制
  createControls(){
    this.controls=new OrbitControls(this.camera,this.canvas);
    this.controls.target.set(0,4,0);
    this.controls.update();
  }

  //场景
  createScene(){
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(0x333333);
  }

  //render target
  createRT(){
    var f=this;
    this.pickingScene=new THREE.Scene();
    this.pickingScene.background=new THREE.Color(0);
    return f;
  }


  //物件
  addMesh(){
    this.loadgltf();
  }
  loadgltf(){
    var f=this;
    var loader=new GLTFLoader();
    //转储物件结构
    function dumpObject(obj, lines = [], isLast = true, prefix = '') {
      const localPrefix = isLast ? '└─' : '├─';
      lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
      const newPrefix = prefix + (isLast ? '  ' : '│ ');
      const lastNdx = obj.children.length - 1;
      obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
      });
      return lines;
    }

    loader.load('./resources/gltfl_oader/pack1/scene_lut.gltf',function(gltf){
      var root=gltf.scene;
      f.scene.add(root);

      
      var dump=dumpObject(root).join('\n');
      console.log(dump);


      var id=0;
      root.traverse(function(mesh){
        if(mesh.type==='Mesh'){
          id++;


          mesh.material.depthWrite = true;
          mesh.material.depthTest = true;

          var scale=1/10;
          mesh.scale.set(scale,scale,scale);

          //重新定义材质
          /*mesh.material=new THREE.MeshPhongMaterial({
            color:new THREE.Color(1,1,0),
            side:THREE.DoubleSide
          });*/

          // console.log(mesh);
          f.idToObject[id]=mesh;



          let pickingMaterial=new THREE.MeshPhongMaterial({
            color:new THREE.Color(0,0,0),
            emissive:new THREE.Color(id),
            side:THREE.DoubleSide,
            specular:new THREE.Color(0,0,0),
          });


          var pickingMesh=new THREE.Mesh(mesh.geometry,pickingMaterial);

          pickingMesh.scale.copy(mesh.scale);
          pickingMesh.rotation.copy(mesh.rotation);
          pickingMesh.position.copy(mesh.position);

          f.pickingScene.add(pickingMesh);
        }
      });



      /*// http://www.yanhuangxueyuan.com/doc/three.js/vector3.html
      var vector_3=new THREE.Vector3(1,59,0);
      console.log(vector_3);

      // http://www.yanhuangxueyuan.com/doc/three.js/bxo3.html
      var box_3=new THREE.Box3();
      console.log(box_3);*/


      /*const box = new THREE.Box3().setFromObject(root);
      console.log(box);*/
    });
    return f;
  }
  //MESH: rotation,position,scale
  operateMeshInRender(timeSec){
    this.cameraPole.rotation.y=-timeSec/8;
  }
  //We also need to go to each mesh in the scene and decide if it should both cast shadows and/or receive shadows.
  

  //灯光
  addLight(){
    let intensity=1.951;
    this.light=new THREE.PointLight(0xffffff,intensity);
    this.light.position.set(1,5,9);
    //Then we also need to tell the light to cast a shadow
    this.light.castShadow=true;
    let lightHelper=new THREE.PointLightHelper(this.light);

    this.camera.add(this.light);
    // this.scene.add(lightHelper);
  }

  //gui
  gui(){
    let gui=new GUI();
    gui.add(this.light,'intensity',0,2,0.001);
  }

  addPickEvent(){
    var f=this;
    function getCanvasRelativePosition(event) {
      const rect = f.canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * f.canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * f.canvas.height / rect.height,
      };
    }

    function setPickPosition(event) {
      const pos = getCanvasRelativePosition(event);
      f.pickPosition.x = pos.x;
      f.pickPosition.y = pos.y;
      // console.log(f.pickPosition);
    }

    function clearPickPosition() {
      // unlike the mouse which always has a position
      // if the user stops touching the screen we want
      // to stop picking. For now we just pick a value
      // unlikely to pick something
      f.pickPosition.x = -100000;
      f.pickPosition.y = -100000;
    }

    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
      // prevent the window from scrolling
      event.preventDefault();
      setPickPosition(event.touches[0]);
    }, {passive: false});

    window.addEventListener('touchmove', (event) => {
      setPickPosition(event.touches[0]);
    });

    window.addEventListener('touchend', clearPickPosition);


    return f;
  }


}



window.pickHelper = new GPUPickHelper();
window.obj=new O_xyz();


window.obj.init();
