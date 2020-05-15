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
    let f=this;
    let renderer=new THREE.WebGLRenderer({
      canvas:this.canvas
    });



    
    //raf
    let rafCallback=function(time){
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
    let fov=75;
    let aspect=2; //默认是2
    let near=0.1;
    let far=1000;
    //摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。
    this.camera=new THREE.PerspectiveCamera(fov,aspect,near,far);

    this.camera.position.y=50;
    this.camera.up.set(0,0,1);
    this.camera.lookAt(0,0,0);
  }

  //场景
  createScene(){
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(0x333333);
  }


  //物件
  mesh(){
    let f=this;

    this.mesh=[];

    this.mesh.push(this.createSphere(0xeeee00,5));

    //最后我们将mesh添加到场景中。
    this.mesh.forEach(function(mesh,i){
      // console.log(mesh);

      let axes=new THREE.AxesHelper(3);
      // axes.material.depthTest=false;
      mesh.add(axes);

      if(i===0){
        let grid=new THREE.GridHelper(3,30);
        mesh.add(grid);
      }

      f.scene.add(mesh);
    });
  }
  createSphere(color=0xec4783,scale=1){
    let geometry=new THREE.SphereGeometry(1,100,100);
    // let geometry=new THREE.WireframeGeometry(box_geometry);
    let material=new THREE.MeshPhongMaterial({
      emissive:color
    });
    let mesh=new THREE.Mesh(geometry,material);
    mesh.scale.set(scale,scale,scale);
    return (mesh);
  }

  //灯光
  createLight(){
    let intensity=2;
    this.light=new THREE.PointLight(0xffffff,intensity);
    // this.light.position.set(-1,2,400);

    this.scene.add(this.light);
  }



}


window.obj=new Geo();
window.obj.init();

