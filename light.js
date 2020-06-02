/*
功能1：计算多个矩阵乘积
功能2：求n阶行列式
*/
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


//关键字：全排列, 字典序,lexicographical order
/*
[3,2,-1,4],
[1,-3/2,5/2,1/2],
[1,0,-2,3],
[5,4,1,2]
-37
*/
class DETerminant{
  constructor(){
    this.D=[
      [3,2,-1,4],
      [1,-3/2,5/2,1/2],
      [1,0,-2,3],
      [5,4,1,2]
    ];
    this.FullPermutation=[];
    this.result=0;  //等于所有取自不同行不同列的n个元素的乘积的代数和
  }
  init(){
    var f=this,i;
    var n=this.D.length;
    // n阶行列式是由n! 项组成的。
    //算出下标J的全排列
    var arr=[];
    for(i=0;i<n;i++){
      arr.push(i);
    }
    this.FullPermutation=this.permute(arr).map(function(v){
      return ({
        tau:f.InversePairs(v),  //逆序数
        permutation:v   //是0,1,2，...，n-1的一个排列
      });
    }).map(function(v){
      var sign=1;
      /*
      是偶排列时带有正号,是奇排列时带有负号
      */
      // x & 1 === 0为偶数。
      if(v.tau & 1){
        //奇数
        sign=-1;
      }

      var product=1;  //取自不同行不同列的n个元素的乘积
      for(i=0;i<n;i++){
        //j下标来自排列
        var j=v.permutation[i];
        //i依次为0,1,2...
        product*=f.D[i][j];
      }
      //公项
      v.hong=sign*product;
      return (v);
    });
    this.DET();
  }
  DET(){
    //所有n级排列求和
    for(var i=0;i<this.FullPermutation.length;i++){
      this.result+=this.FullPermutation[i].hong;
    }
      
    console.log(this.result);
  }
  //求一个数组的逆序数
  InversePairs(arr = []) {
    //避免无意间修改了arr参数
    let data=arr.slice();
    // write code here
    let len = data.length
    if (len === 0) return 0
    const copy = data.concat([])
    let count = InversePairsHelp(data, copy, 0, len - 1)
    return count
    function InversePairsHelp(data, copy, start, end) {
      if (start === end) {
        copy[start] = data[start]
        return 0
      }
      let mid = Math.floor((end - start) / 2)
      let left = InversePairsHelp(copy, data, start, start + mid)
      let right = InversePairsHelp(copy, data, start + mid + 1, end)
      let i = start + mid
      let j = end
      let count = 0
      let indexCopy = end
      while (i >= start && j >= start + mid + 1) {
        if (data[i] > data[j]) {
          copy[indexCopy--] = data[i--]
          count = count + j - start - mid
        } else {
          copy[indexCopy--] = data[j--]
        }
      }
      for (; i >= start; i--)
        copy[indexCopy--] = data[i]
      for (; j >= start + mid + 1; j--)
        copy[indexCopy--] = data[j]
      return left + right + count
    }
  }
  // 阶乘
  factorial(n){
    if(n===1){
      return 1;
    }
    return (n*this.factorial(n-1));
  }
  //数组的全排列
  permute(arr){
    var result=[];
    var usedChars=[];
    var main=function(arr){
      var i,ch;
      for(i=0;i<arr.length;i++){
        ch=arr.splice(i,1)[0];
        usedChars.push(ch);
        if(!arr.length){
          result.push(usedChars.slice());
        }
        main(arr);
        arr.splice(i,0,ch);
        usedChars.pop();
      }
      return result;
    };
    result=main(arr);

    return result;
  }
}   //class

var obj=new DETerminant();
obj.init();
console.log(obj);