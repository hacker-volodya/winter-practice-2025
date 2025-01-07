import { toNano } from '@ton/core';
import { SimpleCrackme } from '../wrappers/SimpleCrackme';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const simpleCrackme = provider.open(
        SimpleCrackme.createFromConfig(
            await compile('SimpleCrackme')
        )
    );

    await simpleCrackme.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(simpleCrackme.address);
}
