import * as THREE from './__3/three.module.js';
import {OrbitControls} from './__3/OrbitControls.js';
import {GUI} from './__3/dat.gui.module.js';
import {OBJLoader2} from './__three.js-master/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from './__three.js-master/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from './__three.js-master/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';

window.__3=THREE;

class O_xyz {
  constructor(){
    this.canvas=document.querySelector('#thecanvas');
    this.mesh=[];
  }
  init(){
    this.createAcamera();
    this.createControls();
    this.createScene();
    
    this.addMesh();
    this.loadObj();
    this.addLight();
    this.gui();

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
    renderer.shadowMap.enabled=true;

    
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

    this.camera.position.set(5,10,30);
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

    

    //rootObject3D
    let rootObject3D=new THREE.Object3D();
    this.mesh.push(rootObject3D);

    let plane=this.createPlane();
    rootObject3D.add(plane);
    this.mesh.push(plane);

    let cube=this.createCube();
    rootObject3D.add(cube);
    this.mesh.push(cube);

    let sphere=this.createSphere();
    rootObject3D.add(sphere);
    this.mesh.push(sphere);


    //添加辅助axes,grid
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
  //加载材质（.mtl）与OBJ物件（.obj）
  loadObj(){
    var f=this;
    const mtlLoader=new MTLLoader();
    const objLoader=new OBJLoader2();

    /*
    //只能load一次...?
    objLoader.load('./resources/objl_oader2/unsee.obj',function(obj){
      f.mesh[0].add(obj);
      obj.name='__unsee';

      //box the windmill
      var box=new THREE.Box3().setFromObject(obj);
      var boxSize=box.getSize(new THREE.Vector3()).length();
      var boxCenter=box.getCenter(new THREE.Vector3());

      console.log(boxSize,boxCenter.y,obj);

      obj.scale.set(1/200,1/200,1/200);

      f.mesh.push(obj);
    });*/

    mtlLoader.load('./resources/objl_oader2/windmill.mtl',function(mtlParseResult){
      const materials=MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
      materials.Material.side=THREE.DoubleSide;
      objLoader.addMaterials(materials);
      objLoader.load('./resources/objl_oader2/windmill.obj',function(windmillobj){
        f.mesh[0].add(windmillobj);
        windmillobj.name='__windmill';

        windmillobj.position.z=-8;

        f.mesh.push(windmillobj);

      });

      

    });


  }
  //MESH: rotation,position,scale
  operateMeshInRender(timeSec){
    this.mesh.forEach(function(mesh,i){
      // mesh.rotation.y=timeSec/2;
      // console.log(mesh.name);
      if(mesh.name==='__windmill'){//i===4
        mesh.rotation.y=timeSec/2;
      }
    });
  }
  //We also need to go to each mesh in the scene and decide if it should both cast shadows and/or receive shadows.
  createPlane(){
    let width=30;
    let geometry=new THREE.PlaneGeometry(width,width);
    // let geometry=new THREE.WireframeGeometry(box_geometry);


    let loader=new THREE.TextureLoader();
    let texture=loader.load('./resources/images/checker2_2.png');
    // console.log(texture);
    texture.wrapS=THREE.RepeatWrapping;
    texture.wrapT=THREE.RepeatWrapping;
    texture.magFilter=THREE.NearestFilter;
    let repeats=width/2;
    texture.repeat.set(repeats,repeats);
    let material=new THREE.MeshPhongMaterial({
      map:texture,
      side:THREE.DoubleSide
    });

    let mesh=new THREE.Mesh(geometry,material);
    mesh.rotation.x=-Math.PI/2;
    mesh.receiveShadow=true;
    return (mesh);
  }
  createCube(color='floralwhite',scale=1){
    let width=4;
    let geometry=new THREE.BoxGeometry(width,width,width);
    let material=new THREE.MeshPhongMaterial({
      color:color
    });
    let mesh=new THREE.Mesh(geometry,material);
    mesh.name='方体';
    mesh.scale.set(scale,scale,scale);
    mesh.position.set(width+1,width/2,0);
    // mesh.rotation.y=-.4;
    mesh.castShadow=true;
    mesh.receiveShadow=true;
    return (mesh);
  }
  createSphere(color='crimson',scale=1){
    let radius=3;
    let geometry=new THREE.SphereGeometry(radius,50,50);
    let material=new THREE.MeshPhongMaterial({
      // flatShading:true,
      color:color
    });
    let mesh=new THREE.Mesh(geometry,material);
    mesh.scale.set(scale,scale,scale);
    mesh.position.set(-radius-1,radius+2,0);
    mesh.castShadow=true;
    mesh.receiveShadow=true;
    return (mesh);
  }

  //灯光
  addLight(){
    let intensity=.951;
    this.light=new THREE.PointLight(0xffffff,intensity);
    this.light.position.set(1,5,9);
    //Then we also need to tell the light to cast a shadow
    this.light.castShadow=true;
    let lightHelper=new THREE.PointLightHelper(this.light);

    this.scene.add(this.light);
    this.scene.add(lightHelper);
  }

  //gui
  gui(){
    let gui=new GUI();
    gui.add(this.light,'intensity',0,2,0.001);
  }



}


window.obj=new O_xyz();
window.obj.init();
