import { toNano } from '@ton/core';
import { Playground } from '../wrappers/Playground';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const playground = provider.open(await Playground.fromInit());

    await playground.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(playground.address);

    // run methods on `playground`
}
