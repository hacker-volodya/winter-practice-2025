import { Address, toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { Solver } from '../wrappers/Solver';

export async function run(provider: NetworkProvider) {
    let lotteryContract = Address.parse("EQCJZTRepG7F4Xf-LnYtPjgLEFwoXQ6U-qmZoWu9Spcdu8rd");
    let data = 0;
    let contract = Solver.createFromConfig(await compile('solver'), data);
    while ((contract.address.hash.at(0)! & 0xc0) != (lotteryContract.hash.at(0)! & 0xc0)) {
        data++;
        contract = Solver.createFromConfig(await compile('solver'), data);
    }
    const finalTask = provider.open(contract);

    await finalTask.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(finalTask.address);
}
