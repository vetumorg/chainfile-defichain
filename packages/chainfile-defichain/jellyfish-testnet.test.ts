import { ChainfileContainer, ChainfileTestcontainers } from '@chainfile/testcontainers';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import testnet from './jellyfish-testnet.json';

const testcontainers = new ChainfileTestcontainers(testnet);

beforeAll(async () => {
  await testcontainers.start();
});

afterAll(async () => {
  await testcontainers.stop();
});

describe('defid + whale', () => {
  let defid: ChainfileContainer;
  let whale: ChainfileContainer;

  beforeAll(() => {
    defid = testcontainers.get('defid');
    whale = testcontainers.get('whale');
  });

  it('should defid.rpc(getblockchaininfo)', async () => {
    const response = await defid.rpc({
      method: 'getblockchaininfo',
    });

    expect(response.status).toStrictEqual(200);
    expect(await response.json()).toMatchObject({
      result: {
        chain: 'test',
      },
    });
  });

  it('should whale.api(/v0/testnet/tokens)', async () => {
    const response = await whale.fetch({
      path: '/v0/testnet/tokens',
      method: 'GET',
      endpoint: 'api',
    });

    expect(response.status).toStrictEqual(200);
    expect(await response.json()).toMatchObject({
      data: expect.arrayContaining([
        expect.objectContaining({
          id: '0',
          symbol: 'DFI',
        }),
      ]),
    });
  });
});
