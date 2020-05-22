import * as THREE from './__three.js-master/build/three.module.js';
console.log(THREE);

class Ten {
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
        if(mesh.type==='Object3D'){
          mesh.rotation.y=time/4;
        }
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

    this.camera.position.set(0,9,15);
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

    let knot=this.createSphere();
    root.add(knot);
    this.mesh.push(knot);

    
    this.mesh.forEach(function(mesh,i){
      // console.log(mesh);
      if(mesh.type==='Mesh'){
        //Mesh,Object3D
        let axes=new THREE.AxesHelper(8);
        // axes.material.depthTest=false;
        mesh.add(axes);

        let grid=new THREE.GridHelper(10,10);
        mesh.add(grid);

      }else{
        /*let grid=new THREE.GridHelper(10,10);
        mesh.add(grid);*/
      }

      

    });
    //最后我们将root添加到场景中。
    f.scene.add(f.mesh[0]);
  }
  createSphere(color='antiquewhite',scale=1){
    let loader=new THREE.TextureLoader();
    const geometry=new THREE.BoxGeometry(8,8,8);

    let materials=[];
    for(let i=0;i<6;i++){
      var texture=loader.load(`./resources/images/flower-${i+1}.jpg`);
      // console.log(texture);
      // texture.offset.set(0.2,.2);
      texture.wrapS=THREE.RepeatWrapping;
      texture.wrapT=THREE.RepeatWrapping;
      // texture.center.set(.5,.5);
      // texture.rotation=Math.PI/4;
      texture.repeat.set(3,2);
      console.log(THREE.MathUtils);
      // texture.rotation=THREE.MathUtils.degToRad(45);
      let material=new THREE.MeshPhongMaterial({
        map:texture
      });
      materials.push(material);
    }


    let mesh=new THREE.Mesh(geometry,materials);
    mesh.scale.set(scale,scale,scale);
    return (mesh);
  }

  //灯光
  addLight(){
    let intensity=1.4;
    this.light=new THREE.PointLight(0xffffff,intensity);
    this.light.position.set(-5,15,15);

    this.scene.add(this.light);
  }



}


window.obj=new Ten();
window.obj.init();





