import { ethers, Interface, ParamType, isHexString } from "ethers";
import { responseType } from "../import/responseType";
import { checkABI } from "./checkAbi";

function decodeTxInputData(abi: any, data: string): responseType {

  let abivalidate = checkABI(abi);

  if (!abivalidate.status) {
    return abivalidate;
  }

  if (!data || typeof data !== "string" || !isHexString(data)) {
    return { status: false, message: `Invalid data: Must be a hexadecimal string`,};
  }

  try {
    const iface = new Interface(abi);
    const parsedTx = iface.parseTransaction({ data });

    if (!parsedTx) {
      return { status: false, message: "No matching function found in ABI" };
    }

    const { fragment, args } = parsedTx;
    const decodedData: { Name: string; Type: string; Value: any }[] = [];

    fragment.inputs.forEach((input: ParamType, index: number) => {
      decodedData.push({
        Name: input.name,
        Type: input.type,
        Value: formatValue(input, args[index]),
      });
    });

    return {status: true, message: {functionName: fragment.name, signature: fragment.format(), data: decodedData}};

  } catch (error) {
    return { status: false,message: "Unknown error occurred during decoding", };
  }
}

function formatValue(param: ParamType, value: any): any {

  if (param.type === "address") {
    return ethers.getAddress(value.toLowerCase());
  }

  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    return value.toString();
  }

  if (param.type === "tuple" && param.components) {
    return param.components.reduce(
      (acc: Record<string, any>, component, index) => {
        acc[component.name] = formatValue(component, value[index]);
        return acc;
      },
      {}
    );
  }

  return value;
  
}

export { decodeTxInputData } 