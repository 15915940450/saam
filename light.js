/*
功能1：计算多个矩阵乘积
功能2：求n阶行列式
*/

class Matrix {
  /*
  矩阵 matrix Amn m*n m行n列
  当矩阵A的列数（column）等于矩阵B的行数（row）时，A与B可以相乘。
  */
  constructor(){
    this.Amn=[[1,0,2],[-1,3,1]];
    this.Bnp=[[3,1],[2,1],[1,0]];
    this.Cpq=[[1,2,3,4,5],[5,6,7,8,1]];
  }

  init(){
    let result=this.multiply(this.Amn,this.Bnp,this.Cpq);  //ˈmʌltɪplaɪ
    console.log(JSON.stringify(result));
    /*
    [
      [10,16,22,28,26],
      [14,20,26,32,22]
    ]
    */
  }

  multiplyAB(Amn,Bnp){
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
  }
  multiply(...param){
    var result=[];
    for(var i=0;i<param.length-1;i++){
      result=this.multiplyAB(param[i],param[i+1]);
      param[i+1]=result;
    }
    
    return result;
  }
} //class Matrix

var matrix=new Matrix();
matrix.init();


class DETerminant{
  constructor(){
    this.D=[
      [3,2,-1,4],
      [1,-3/2,5/2,1/2],
      [1,0,-2,3],
      [5,4,1,2]
    ];
    this.FullPermutation=[];
    this.result=0;  //等于所有取自不同行不同列的n个元素的乘积的代数和 (-37)
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

    console.log(this.result);
  }
  DET(){
    //所有n级排列求和
    for(var i=0;i<this.FullPermutation.length;i++){
      this.result+=this.FullPermutation[i].hong;
    }
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

var det=new DETerminant();
det.init();
// https://www.jianshu.com/p/33cffa1ce613 简书 [图解] 归并排序

// console.log('逆序数',det.InversePairs([5,4,7,9,3,8,2,1]));


//https://www.bilibili.com/video/BV1Ax411U7Xx?from=search&seid=9095028233196157434

var MERGE=function(arrSortedLeft,arrSortedRight){
  var arrSorted=[],tau=0;
  var h=0,f=0,g=0;
  
  while(f<arrSortedLeft.length && g<arrSortedRight.length){
    if(arrSortedLeft[f]>arrSortedRight[g]){
      //逆序
      tau+=arrSortedLeft.length-f;
      arrSorted[h]=arrSortedRight[g];
      h++;
      g++;
    }else{
      arrSorted[h]=arrSortedLeft[f];
      h++;
      f++;
    }
  }

  while(f<arrSortedLeft.length){
    arrSorted[h]=arrSortedLeft[f];
    h++;
    f++;
  }

  while(g<arrSortedRight.length){
    arrSorted[h]=arrSortedRight[g];
    h++;
    g++;
  }

  return {
    arrSorted:arrSorted,
    tau:tau
  };
};
var arrNeedToSort=[5,4,7,9,3,8,2];
console.log('逆序数',det.InversePairs(arrNeedToSort));

var MERGE_SORT=function(arrNeedToSort){
  var arrLeft,arrRight,arrSorted;
  if(arrNeedToSort.length===1){
    return (arrNeedToSort);
  }


  var Mr=arrNeedToSort.length/2;
  arrLeft=arrNeedToSort.slice(0,Mr);
  arrRight=arrNeedToSort.slice(Mr);


  var arrSortedLeft=MERGE_SORT(arrLeft);
  var arrSortedRight=MERGE_SORT(arrRight);
  var obj=MERGE(arrSortedLeft,arrSortedRight);
  console.log(obj);
  arrSorted=obj.arrSorted;
  return arrSorted;
};
var arrSorted=MERGE_SORT(arrNeedToSort);
console.log(arrSorted);

