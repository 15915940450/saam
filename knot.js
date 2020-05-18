import * as THREE from './__three.js-master/build/three.module.js';
console.log(THREE);

class Pang {
  constructor(){
    this.canvas=document.querySelector('#thecanvas');
  }
  init(){
    this.createAcamera();
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

      //MESH: rotation,position,scale
      f.mesh.forEach(function(mesh,i){
        mesh.rotation.y=time/4;
      });

      
      
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
    let fov=75;
    let aspect=2; //默认是2
    let near=0.1;
    let far=1000;
    //摄像机默认指向Z轴负方向，上方向朝向Y轴正方向。
    this.camera=new THREE.PerspectiveCamera(fov,aspect,near,far);

    this.camera.position.set(0,40,100);
    // this.camera.up.set(0,0,1);
    this.camera.lookAt(0,0,0);
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

    //root
    let root=new THREE.Object3D();
    this.mesh.push(root);

    let knot=this.createSphere(0xeeee00,5);
    root.add(knot);
    this.mesh.push(knot);

    
    this.mesh.forEach(function(mesh,i){
      // console.log(mesh);
      if(mesh.type==='Mesh'){
        //Mesh,Object3D
        let axes=new THREE.AxesHelper(30);
        // axes.material.depthTest=false;
        mesh.add(axes);
      }else{
        let grid=new THREE.GridHelper(100,100);
        mesh.add(grid);
      }

      

    });
    //最后我们将root添加到场景中。
    f.scene.add(f.mesh[0]);
  }
  createSphere(color=0xec4783,scale=1){
    const radius=6;
    const tubeRadius=1.4;
    const radialSegments=50;
    const tubularSegments=50;
    const p=2;
    const q=3;
    const geometry=new THREE.TorusKnotBufferGeometry(radius,tubeRadius,tubularSegments,radialSegments,p,q);
    // let geometry=new THREE.EdgesGeometry(knot_geometry);
    let material=new THREE.MeshPhongMaterial({
      color:color
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


window.obj=new Pang();
window.obj.init();

