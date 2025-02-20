const { ethers } = require("ethers");

export function isValidEtherValue(value: any): boolean {
  try {
    const ethValue = ethers.parseEther(value.toString());
    if(ethValue > 0n){
      return true;
    }else{
      return false;
    }
  } catch (error) {
    return false;
  }
}
