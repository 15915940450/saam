//矩阵 matrix Amn m*n m行n列
/*
当矩阵A的列数（column）等于矩阵B的行数（row）时，A与B可以相乘。
*/
/*
let Amn=[];
let Bnp=[];
*/

let Amn=['-14,-10,6','-1,-5,-14'];
let Bnp=['15','0','-14'];

let multiply=function(Amn,Bnp){
  let AmnBnp=[],i,j,k;
  Amn=Amn.map(function(v){
    return (v.split(','));
  });
  Bnp=Bnp.map(function(v){
    return (v.split(','));
  });
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
//AmnBnp===Cmp
let AmnBnp=multiply(Amn,Bnp);  //ˈmʌltɪplaɪ
console.log(AmnBnp);
