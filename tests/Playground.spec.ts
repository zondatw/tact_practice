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
        console.log(res);
        expect(res).toBe("sample");
    });

    it('emits', async () => {
        const res = await playground.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            'player',
        );

        // console.log(res);
        // We'll need only the body of the observed message:
        const firstMsgBody = res.externals[0].body;
        
        // Now, let's parse it, knowing that it's a text message.
        // NOTE: In a real-world scenario,
        //       you'd want to check that first or wrap this in a try...catch
        const firstMsgText = firstMsgBody.asSlice().loadStringTail().replace(/\u0000/g, '');
        // for (let i = 0; i < firstMsgText.length; i++) {
        //     console.log(`Character at position ${i}: '${firstMsgText[i]}' - Unicode: U+${firstMsgText.charCodeAt(i).toString(16).toUpperCase()}`);
        // }
        
        // "But to the Supes? Absolutely diabolical."
        console.log(firstMsgText);
        // console.log('Expected:', firstMsgText, 'Length:', firstMsgText.length);
        // console.log('Expected:', firstMsgText, 'Length:', "\nTime to play.".length);
        expect(firstMsgText).toBe("Time to play.");
    });

    it('send player', async () => {
        const res = await playground.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            {
                $$type: "Player",
                id: 1n,
                name: "tester",
            },
        );

        // console.log(res);
        // We'll need only the body of the observed message:
        const firstMsgBody = res.externals[0].body;
        
        // Now, let's parse it, knowing that it's a text message.
        // NOTE: In a real-world scenario,
        //       you'd want to check that first or wrap this in a try...catch
        const firstMsgText = firstMsgBody.asSlice().loadStringTail().replace(/\u0000/g, '');
        
        // "But to the Supes? Absolutely diabolical."
        console.log(firstMsgText);
        expect(firstMsgText).toBe(`Player ID: 1 Name: tester`);
    });
});
