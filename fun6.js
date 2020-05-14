import * as THREE from './__three.js-master/build/three.module.js';


class Fun6 {
  constructor(){
    this.canvas=document.querySelector('#thecanvas');
  }
  init(){
    this.createAcamera();
    this.createScene();
    this.mesh();
    this.createLight();

    this.render();
    // console.log(this);
  }

  //===渲染
  render(){
    var f=this;
    var renderer=new THREE.WebGLRenderer({
      canvas:this.canvas
    });
    
    var rafCallback=function(time){
      time=time/1000;

      f.mesh.rotation.y=time*2;
      f.mesh.rotation.x=time/2;

      renderer.render(f.scene,f.camera);
      window.requestAnimationFrame(rafCallback);
    };
    window.requestAnimationFrame(rafCallback);
  }

  //相机
  createAcamera(){
    var fov=75;
    var aspect=9/8; //canvas width / height
    var near=0.1;
    var far=5;
    //摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。
    this.camera=new THREE.PerspectiveCamera(fov,aspect,near,far);

    this.camera.position.z=3;
  }

  //场景
  createScene(){
    this.scene=new THREE.Scene();
  }


  //物体
  mesh(){
    var geometry=new THREE.BoxGeometry(1,1,1);
    var material=new THREE.MeshPhongMaterial({
      color:0xec4783
    });
    this.mesh=new THREE.Mesh(geometry,material);
    // console.log(this.mesh);



    //最后我们将mesh添加到场景中。
    this.scene.add(this.mesh);
  }

  //灯光
  createLight(){
    var intensity=2;
    this.light=new THREE.DirectionalLight(0xffffff,intensity);
    this.light.position.set(-1,2,4);

    this.scene.add(this.light);
  }



}


window.obj=new Fun6();
window.obj.init();

