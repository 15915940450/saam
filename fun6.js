import * as THREE from './__three.js-master/build/three.module.js';


class Fun6 {
  constructor(){
    this.canvas=document.querySelector('#thecanvas');
  }
  init(){
    this.createAcamera();
    this.createScene();
    this.mesh();

    this.render();
    console.log(this);
  }

  //渲染
  render(){
    var renderer=new THREE.WebGLRenderer({
      canvas:this.canvas
    });
    renderer.render(this.scene,this.camera);
    // console.log(renderer);
  }

  //相机
  createAcamera(){
    var fov=75;
    var aspect=2;
    var near=0.1;
    var far=5;
    //摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。
    this.camera=new THREE.PerspectiveCamera(fov,aspect,near,far);

    this.camera.position.z=2;
  }

  //场景
  createScene(){
    this.scene=new THREE.Scene();
  }


  //物体
  mesh(){
    var geometry=new THREE.BoxGeometry(1,1,1);
    var material=new THREE.MeshBasicMaterial({
      color:0xff00ff
    });
    this.mesh=new THREE.Mesh(geometry,material);
    console.log(this.mesh);



    //最后我们将mesh添加到场景中。
    this.scene.add(this.mesh);
  }



}


var obj=new Fun6();
obj.init();

