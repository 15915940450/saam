import * as THREE from './__three.js-master/build/three.module.js';
console.log(THREE);

class Geo {
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



    
    //raf
    var rafCallback=function(time){
      time=time/1000;

      //MESH: rotation,position,scale
      f.mesh.forEach(function(mesh,i){
        mesh.rotation.y=time/2;
        // mesh.rotation.x=time*(i-0.5);
      });

      
      
      //camera aspect
      if(f.resizeRenderer2DisplaySize(renderer)){
        // console.log(f.camera.aspect);
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
    var needResize=true;
    var targetWidth=this.canvas.clientWidth*window.devicePixelRatio | 0;
    var targetHeight=this.canvas.clientHeight*window.devicePixelRatio | 0;

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
    var fov=75;
    var aspect=2; //默认是2
    var near=0.1;
    var far=10;
    //摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。
    this.camera=new THREE.PerspectiveCamera(fov,aspect,near,far);

    this.camera.position.z=5;
  }

  //场景
  createScene(){
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(0x333333);
  }


  //物件
  mesh(){
    var f=this;

    this.mesh=[];

    this.mesh.push(this.createAmesh());

    //最后我们将mesh添加到场景中。
    this.mesh.forEach(function(mesh,i){
      // console.log(mesh);

      var axes=new THREE.AxesHelper(3);
      // axes.material.depthTest=false;
      mesh.add(axes);

      if(i===0){
        var grid=new THREE.GridHelper(3,30);
        mesh.add(grid);
      }

      f.scene.add(mesh);
    });
  }
  createAmesh(color=0xec4783){
    var geometry=new THREE.BoxGeometry(1,1,1);
    var material=new THREE.MeshPhongMaterial({
      color:color
    });
    var mesh=new THREE.Mesh(geometry,material);
    return (mesh);
  }

  //灯光
  createLight(){
    var intensity=2;
    this.light=new THREE.DirectionalLight(0xffffff,intensity);
    this.light.position.set(-1,2,4);

    this.scene.add(this.light);
  }



}


window.obj=new Geo();
window.obj.init();

