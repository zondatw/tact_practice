import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Playground } from '../wrappers/Playground';
import '@ton/test-utils';

describe('Playground', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let playground: SandboxContract<Playground>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        playground = blockchain.openContract(await Playground.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await playground.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: playground.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and playground are ready to use
    });

    it('get Sample', async () => {
        const res = await playground.getGetSample();

        console.log("Address of our contract: " + playground.address);
        console.log(res); // ← here one would see results of emit() calls
        expect(res).toBe("sample");
    });
});
