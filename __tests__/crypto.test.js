import { expect } from 'parser';
import { describe } from 'yargs';
import getLatestValuePerTokenInUSD from '../src/crypto.js';

describe ('getLatestValuePerTokenInUSD', () => {
    test('returns the latest portfolio value per token in USD', () => {
        const result = getLatestValuePerTokenInUSD();
        expect(result).toEqual([{}]);
    });
})

