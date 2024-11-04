// deno-lint-ignore no-explicit-any
export function splitArray(arr: Array<any>, subArrSize: any): any {
    const newArr: number[][] = [];
  
    for (let i = 0; i < arr.length; i += subArrSize) {
      const subArr = arr.slice(i, i + subArrSize);
      newArr.push(subArr);
    }
  
    return newArr;
  }