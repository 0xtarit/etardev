const { ethers } = require("ethers");

/**
 * Validates whether a given input is a valid EVM address.
 * @param {string} address - The EVM address to validate.
 * @returns {object} An object containing the validation status and message.
 */
function validateAddress(address) {

    if (!address || typeof address !== "string") {
        return {
            isValid: false,
            message: "Invalid input: Address must be a non-empty string.",
        };
    }

    if (!ethers.isAddress(address)) {
        return {
            isValid: false,
            message: "Invalid address: The input is not a valid EVM address.",
        };
    }

    const checksumValid = ethers.getAddress(address) === address;
    if (!checksumValid && address.toLowerCase() !== address) {
        return {
            isValid: false,
            message: "Invalid checksum: The address does not match EIP-55 checksum format.",
        };
    }

    return {
        isValid: true,
        message: "The address is valid.",
    };
}

module.exports = {validateAddress};
