import type { IRange } from '@univerjs/core';
import { describe, expect, it } from 'vitest';

import { getRepeatRange } from '../utils';

describe('test getRepeatRange', () => {
    it('repeat row 2 times', () => {
        const originRange: IRange = { startRow: 3, endRow: 4, startColumn: 1, endColumn: 1 };
        const targetRange: IRange = { startRow: 6, endRow: 9, startColumn: 1, endColumn: 1 };
        const result = getRepeatRange(originRange, targetRange);
        expect(result).toEqual([
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 1, endColumn: 1 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 0 },
            },
            {
                startRange: { startRow: 8, endRow: 8, startColumn: 1, endColumn: 1 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 0 },
            },
        ]);
    });

    it('repeat col 2 times', () => {
        const originRange: IRange = { startRow: 1, endRow: 1, startColumn: 3, endColumn: 4 };
        const targetRange: IRange = { startRow: 1, endRow: 1, startColumn: 6, endColumn: 9 };
        const result = getRepeatRange(originRange, targetRange);
        expect(result).toEqual([
            {
                startRange: { startRow: 1, endRow: 1, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 0, startColumn: 0, endColumn: 1 },
            },
            {
                startRange: { startRow: 1, endRow: 1, startColumn: 8, endColumn: 8 },
                repeatRelativeRange: { startRow: 0, endRow: 0, startColumn: 0, endColumn: 1 },
            },
        ]);
    });

    it('repeat col 2 times and repeat row 2 times', () => {
        const originRange: IRange = { startRow: 3, endRow: 4, startColumn: 3, endColumn: 4 };
        const targetRange: IRange = { startRow: 6, endRow: 9, startColumn: 6, endColumn: 9 };
        const result = getRepeatRange(originRange, targetRange);
        expect(result).toEqual([
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 8, endColumn: 8 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
            {
                startRange: { startRow: 8, endRow: 8, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
            {
                startRange: { startRow: 8, endRow: 8, startColumn: 8, endColumn: 8 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
        ]);
    });

    it('the target row mod origin row is not 0', () => {
        const originRange: IRange = { startRow: 3, endRow: 4, startColumn: 3, endColumn: 4 };
        const targetRange: IRange = { startRow: 6, endRow: 10, startColumn: 6, endColumn: 9 };
        const result = getRepeatRange(originRange, targetRange);
        expect(result).toEqual([
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 8, endColumn: 8 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
        ]);
        const result2 = getRepeatRange(originRange, targetRange, true);
        expect(result2).toEqual([
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
        ]);
    });

    it('the target col mod origin col is not 0', () => {
        const originRange: IRange = { startRow: 3, endRow: 4, startColumn: 3, endColumn: 4 };
        const targetRange: IRange = { startRow: 6, endRow: 9, startColumn: 6, endColumn: 10 };
        const result = getRepeatRange(originRange, targetRange);
        expect(result).toEqual([
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
            {
                startRange: { startRow: 8, endRow: 8, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
        ]);
        const result2 = getRepeatRange(originRange, targetRange, true);
        expect(result2).toEqual([
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
        ]);
    });

    it('the target range is cell', () => {
        const originRange: IRange = { startRow: 3, endRow: 4, startColumn: 3, endColumn: 4 };
        const targetRange: IRange = { startRow: 6, endRow: 6, startColumn: 6, endColumn: 6 };
        const result = getRepeatRange(originRange, targetRange);
        expect(result).toEqual([
            {
                startRange: { startRow: 6, endRow: 6, startColumn: 6, endColumn: 6 },
                repeatRelativeRange: { startRow: 0, endRow: 1, startColumn: 0, endColumn: 1 },
            },
        ]);
    });
});