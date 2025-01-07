import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, Cell, toNano } from '@ton/core';
import { SimpleCrackme } from '../wrappers/SimpleCrackme';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SimpleCrackme', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SimpleCrackme');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let simpleCrackme: SandboxContract<SimpleCrackme>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        simpleCrackme = blockchain.openContract(
            SimpleCrackme.createFromConfig(
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await simpleCrackme.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleCrackme.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and simpleCrackme are ready to use
    });

    it('should reject invalid comment', async () => {
        const wallet = await blockchain.treasury('wallet');
        const crackmeResult = await simpleCrackme.sendTextComment(wallet.getSender(), {
            comment: "asldjhfjskafad",
            value: toNano('0.05'),
        });
        expect(crackmeResult.transactions).toHaveTransaction({
            from: wallet.address,
            to: simpleCrackme.address,
            exitCode: 35,
        });
    });

    it('should accept valid comment', async () => {
        const wallet = await blockchain.treasury("wallet");
        console.log(wallet.address.toRawString());
        const crackmeResult = await simpleCrackme.sendTextComment(wallet.getSender(), {
            comment: 'aa]ZYea]',
            value: toNano('0.05'),
        });
        expect(crackmeResult.transactions).toHaveTransaction({
            from: simpleCrackme.address,
            to: wallet.address,
            body: beginCell().storeUint(0, 32).storeStringTail("congrats!").endCell(),
        });
    });
});
