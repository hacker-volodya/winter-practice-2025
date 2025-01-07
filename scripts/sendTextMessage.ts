import { Address, toNano } from '@ton/core';
import { SimpleCrackme } from '../wrappers/SimpleCrackme';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('SimpleCrackme address'));
    const comment = args.length > 1 ? args[1] : await ui.input('SimpleCrackme comment');

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const simpleCrackme = provider.open(SimpleCrackme.createFromAddress(address));

    await simpleCrackme.sendTextComment(provider.sender(), {
        comment,
        value: toNano('0.05'),
    });

    ui.clearActionPrompt();
    ui.write('Done!');
}
