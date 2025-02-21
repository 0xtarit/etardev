import { config } from "dotenv";
import { ethers, isAddress } from "ethers";
import { checkPrivatekey } from "../wallet/checkPrivatekey";
import { checkRpcUrl } from "../provider/checkRpcUrl";

config();

type ValidationType = "string" | "number" | "boolean" | "privateKey" | "rpcUrl" | "address";

type ValidationRule = {
  name: string;
  type: ValidationType;
};

type ValidationResult = {
  isValid: boolean;
  value: string | number | boolean | null;
  type: ValidationType;
};

type ValidationResults = Record<string, ValidationResult>;

/**
 * Validate .env variables with expected data types
 * @param {ValidationRule[]} validations - List of validations with { name, type } objects
 * @returns {Promise<ValidationResults>} Validation status and messages
 */

export async function validateEnvVariables(validations: ValidationRule[]): Promise<ValidationResults> {

  if (!Array.isArray(validations)) {
    throw new Error("Invalid validations array: Must be a valid array.");
  }

  const result: ValidationResults = {};

  for (const { name, type } of validations) {
    const value = process.env[name] || null;
    result[name] = await validateValue(value, type);
  }

  return result;
}

/**
 * Check if a value matches the expected data type
 * @param {string | null} value - The environment variable value
 * @param {ValidationType} type - The expected type
 * @returns {Promise<ValidationResult>} Validation result
 */

async function validateValue( value: string | null,type: ValidationType): Promise<ValidationResult> {

  if (!value) {
    return { isValid: false, value: null, type };
  }

  switch (type) {

    case "number":
      return { isValid: !isNaN(Number(value)), value: Number(value), type };

    case "string":
      return { isValid: typeof value === "string", value, type };

    case "boolean":
      return { isValid: value.toLowerCase() === "true" || value.toLowerCase() === "false",value: value.toLowerCase() === "true", type};

    case "privateKey":
      return { isValid: checkPrivatekey(value).status, value, type };

    case "rpcUrl":
      const rpcUrlCheckResult = await checkRpcUrl(value);
      return { isValid: rpcUrlCheckResult.status, value, type };

    case "address":
      return { isValid: isAddress(value), value, type };

    default:
      return { isValid: false, value: value, type };

  }
}

// ***************** Helper functions *****************//