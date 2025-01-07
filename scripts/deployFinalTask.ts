import { toNano } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { FinalTask } from '../wrappers/FinalTask';

export async function run(provider: NetworkProvider) {
    const finalTask = provider.open(
        FinalTask.createFromConfig(
            await compile('FinalTask')
        )
    );

    await finalTask.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(finalTask.address);
}
