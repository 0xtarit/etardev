let etardev = require('../index');

async function test(){
    let result = etardev.validateAddress(
      '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    );

    console.log(result);
}

test();