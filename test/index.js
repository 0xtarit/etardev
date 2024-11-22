// index.js

const etadev = require('../index')


function test(){
  let tx = etadev.createTx({
    data: {
      function: 'approve',
      parameters: [
        '0xdDF60F109b28D66849e1dFB85657efdb7885D417',
        '100000000000000000000000000000000000000000000000000000000000000000',
      ],
    },
    to: '0xdDF60F109b28D66849e1dFB85657efdb7885D417',
    nonce: 34,
    gasPrice: 45,
    gasLimit: "422323223",
    value: 34,
    from: '0xdDF60F109b28D66849e1dFB85657efdb7885D417',
    maxPriorityFeePerGas: 2342234,
    abi: [
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  });

  console.log(tx);
}

test();