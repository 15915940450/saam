//矩阵 matrix Amn m*n m行n列
/*
当矩阵A的列数（column）等于矩阵B的行数（row）时，A与B可以相乘。
*/
/*
let Amn=[];
let Bnp=[];
let Cpq=[];
*/

let Amn=[[1,0,2],[-1,3,1]];
let Bnp=[[3,1],[2,1],[1,0]];
let Cpq=[[1,2,3,4,5],[5,6,7,8,1]];

let multiplyAB=function(Amn,Bnp){
  let AmnBnp=[],i,j,k;
  // 求出m,n,p
  const m=Amn.length;
  const n=Amn[0].length;
  const n2=Bnp.length;
  const p=Bnp[0].length;

  //可乘性
  if(n!==n2){
    var msg='警告：两个矩阵不可相乘';
    // console.error(msg);
    return msg;
  }

  let formula=function(i,j){
    let Cij=0;
    for(k=0;k<n;k++){
      Cij+=Amn[i][k]*Bnp[k][j];
    }
    return Cij;
  };

  for(i=0;i<m;i++){
    AmnBnp.push([]);
    for(j=0;j<p;j++){
      //确定值(公式)
      AmnBnp[i][j]=formula(i,j);
    }
  }

  return (AmnBnp);
};
let multiply=function(...param){
  var result=[];
  for(var i=0;i<param.length-1;i++){
    result=multiplyAB(param[i],param[i+1]);
    param[i+1]=result;
  }
  
  return result;
};
let result=multiply(Amn,Bnp,Cpq);  //ˈmʌltɪplaɪ
console.log(result);

