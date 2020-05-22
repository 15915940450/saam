import * as THREE from './__three.js-master/build/three.module.js';
import {OrbitControls} from './__three.js-master/examples/jsm/controls/OrbitControls.js';
import {GUI} from './__three.js-master/examples/jsm/libs/dat.gui.module.js';

class Light {
  constructor(){
    this.canvas=document.querySelector('#thecanvas');
  }
  init(){
    this.createAcamera();
    this.createControls();
    this.createScene();
    this.addMesh();
    this.addLight();

    this.render();
    // console.log(this);
  }

  //===渲染
  render(){
    let f=this;
    let renderer=new THREE.WebGLRenderer({
      canvas:this.canvas
    });



    
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

    this.camera.position.set(0,10,20);
    // this.camera.up.set(0,0,1);
    // this.camera.lookAt(0,0,0);
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


  //物件
  addMesh(){
    let f=this;

    this.mesh=[];

    //rootObject3D
    let rootObject3D=new THREE.Object3D();
    this.mesh.push(rootObject3D);

    let sun=this.createSphere(0xeeee00);
    rootObject3D.add(sun);
    this.mesh.push(sun);

    
    this.mesh.forEach(function(mesh,i){
      // console.log(mesh);
      if(mesh.type==='Mesh'){
        //Mesh,Object3D
        let axes=new THREE.AxesHelper(3);
        // axes.material.depthTest=false;
        mesh.add(axes);
      }else{
        let grid=new THREE.GridHelper(10,10);
        mesh.add(grid);
      }

      

    });
    //最后我们将root添加到场景中。
    f.scene.add(f.mesh[0]);
  }
  //MESH: rotation,position,scale
  operateMeshInRender(timeSec){
    this.mesh.forEach(function(mesh,i){
      mesh.rotation.y=timeSec/2;
    });
  }
  createSphere(color=0xec4783,scale=1){
    let geometry=new THREE.SphereGeometry(1,50,50);
    // let geometry=new THREE.WireframeGeometry(box_geometry);
    let material=new THREE.MeshPhongMaterial({
      emissive:color
    });
    let mesh=new THREE.Mesh(geometry,material);
    mesh.scale.set(scale,scale,scale);
    return (mesh);
  }

  //灯光
  addLight(){
    let intensity=0.6;
    this.light=new THREE.PointLight(0xffffff,intensity);
    this.light.position.set(-1,2,400);

    this.scene.add(this.light);
  }



}


window.obj=new Light();
window.obj.init();

