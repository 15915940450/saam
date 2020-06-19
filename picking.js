import * as THREE from './__3/three.module.js';
import {OrbitControls} from './__3/OrbitControls.js';
import {GUI} from './__3/dat.gui.module.js';

window.__3=THREE;

class PickHelper {
  constructor(){
    this.raycaster=new THREE.Raycaster();
    this.pickedObject=null;
    this.pickedObjectSavedColor=0;
  }
  pick(normalizedPosition,scene,camera,time){
    //设定上一次pick的物件
    if(this.pickedObject){
      this.pickedObject.material.color.setHex(this.pickedObjectSavedColor);
      this.pickedObject=undefined;
    }

    this.raycaster.setFromCamera(normalizedPosition,camera);
    var objects=scene.children;
    var intersectedObjects=this.raycaster.intersectObjects(objects);
    // console.log(objects,intersectedObjects);

    if(intersectedObjects.length){
      this.pickedObject=intersectedObjects[0].object;
      this.pickedObjectSavedColor=this.pickedObject.material.color.getHex();
      this.pickedObject.material.color.setHex((time*5)%2>1?0xFFFFFF:0x000000);
    }
  }
}

class O_xyz {
  constructor(){
    this.canvas=document.querySelector('#c');
    this.cubeNums=1e2;
    this.pickPosition={
      x:0,
      y:0
    };
  }
  init(){
    this.createAcamera();
    this.createControls();
    this.createScene();
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

      pickHelper.pick(f.pickPosition,f.scene,f.camera,time);

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
    let far=1000;
    //摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。
    this.camera=new THREE.PerspectiveCamera(fov,aspect,near,far);

    this.camera.position.set(5,10,30);
    // this.camera.up.set(0,0,1);
    // this.camera.lookAt(0,0,0);
    this.cameraPole=new THREE.Object3D();
    this.cameraPole.add(this.camera);
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

    this.scene.add(this.cameraPole);
  }


  //物件
  addMesh(){
    this.createCubes();
  }
  //MESH: rotation,position,scale
  operateMeshInRender(timeSec){
    /*this.mesh.forEach(function(mesh,i){
      // mesh.rotation.y=timeSec/2;
    });*/
    this.cameraPole.rotation.y=timeSec/40;
  }
  //We also need to go to each mesh in the scene and decide if it should both cast shadows and/or receive shadows.

  createCubes(){
    let width=1;
    let geometry=new THREE.BoxGeometry(width,width,width);
    
    var arrCubes=[];

    for(var i=0;i<this.cubeNums;i++){
      let material=new THREE.MeshPhongMaterial({
        color:this.randHSL()
      });
      let mesh=new THREE.Mesh(geometry,material);

      this.scene.add(mesh);
      mesh.scale.set(this.rand(3,6),this.rand(3,6),this.rand(3,6));
      mesh.position.set(this.rand(-30,30),this.rand(-30,30),this.rand(-30,30));
      mesh.rotation.set(this.rand(Math.PI),this.rand(Math.PI),0);
      mesh.castShadow=true;
      mesh.receiveShadow=true;
    }
    
    
  }

  //灯光
  addLight(){
    let intensity=.951;
    this.light=new THREE.PointLight(0xffffff,intensity);
    this.light.position.set(1,5,9);
    //Then we also need to tell the light to cast a shadow
    this.light.castShadow=true;
    // let lightHelper=new THREE.PointLightHelper(this.light);

    this.camera.add(this.light);
    // this.camera.add(lightHelper);
  }

  //gui
  gui(){
    let gui=new GUI();
    gui.add(this.light,'intensity',0,2,0.001);
  }
  rand(min,max){
    if(max===undefined){
      max=min;
      min=0;
    }
    return (min+(max-min)*Math.random());
  }

  randHSL(){
    return (`hsl(${this.rand(360) | 0},${this.rand(50,100) | 0}%,50%)`);
  }


  addPickEvent(){
    var f=this;
    window.addEventListener('mousemove',function(ev){
      var pos={
        x:ev.clientX,
        y:ev.clientY
      };

      var w=f.canvas.width;
      var h=f.canvas.height;
      f.pickPosition={
        x:2*pos.x/w-1,
        y:-(2*pos.y/h-1)
      };
    });

    var clearPickPosition=function(){
      f.pickPosition={
        x:-1e6,
        y:-1e6
      };
    };


    clearPickPosition();

    window.addEventListener('mouseout',function(){
      clearPickPosition();
    });
    window.addEventListener('mouseleave',function(){
      clearPickPosition();
    });
  }



}

window.pickHelper=new PickHelper();


window.obj=new O_xyz();
window.obj.init();
