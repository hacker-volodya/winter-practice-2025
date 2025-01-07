import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export class SimpleCrackme implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SimpleCrackme(address);
    }

    static createFromConfig(code: Cell, workchain = 0) {
        const init = { code, data: beginCell().endCell() };
        return new SimpleCrackme(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendTextComment(
        provider: ContractProvider,
        via: Sender,
        opts: {
            comment: string;
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0, 32) // op == 0
                .storeStringTail(opts.comment)
                .endCell(),
        });
    }
}
