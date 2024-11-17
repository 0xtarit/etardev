let etardev = require('../index');

async function test(){
    let provider  = await etardev.createProvider('https://arb1.arbitrum.io/rpc');
    let check = await etardev.isProviderConnected(provider);
    console.log(check);
}

test();