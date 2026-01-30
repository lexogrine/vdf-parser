import { parseVdf } from '../tsc/vdf_parser';

describe('parseVdf', () => {
    it('parses a simple key-value VDF', () => {
        const vdf = `
            "key" "value"
        `;
        const result = parseVdf(vdf);
        expect(result).toEqual({
            success: true,
            content: { key: "value" }
        });
    });

    it('parses a nested VDF object', () => {
        const vdf = `
            "outer"
            {
                "inner" "value"
            }
        `;
        const result = parseVdf(vdf);
        expect(result).toEqual({
            success: true,
            content: {
                outer: {
                    inner: "value"
                }
            }
        });
    });

    it('parses multiple keys at root', () => {
        const vdf = `
            "key1" "value1"
            "key2" "value2"
        `;
        const result = parseVdf(vdf);
        expect(result).toEqual({
            success: true,
            content: {
                key1: "value1",
                key2: "value2"
            }
        });
    });

    it('parses multiple nested objects', () => {
        const vdf = `
            "root"
            {
                "child1" "value1"
                "child2"
                {
                    "grandchild" "value2"
                }
            }
        `;
        const result = parseVdf(vdf);
        expect(result).toEqual({
            success: true,
            content: {
                root: {
                    child1: "value1",
                    child2: {
                        grandchild: "value2"
                    }
                }
            }
        });
    });

    it('returns error for missing opening brace', () => {
        const vdf = `
            "key"
            "value"
            }
        `;
        const result = parseVdf(vdf);
        expect(result.success).toBe(false);
        expect((result as any).error).toMatch(/Object close without an associated open/);
    });

    it('returns error for object without key', () => {
        const vdf = `
            {
                "key" "value"
            }
        `;
        const result = parseVdf(vdf);
        expect(result.success).toBe(false);
        expect((result as any).error).toMatch(/new object without a key/);
    });

    it('returns error for too many values on a line', () => {
        const vdf = `
            "key1" "value1" "extra"
        `;
        const result = parseVdf(vdf);
        expect(result.success).toBe(false);
        expect((result as any).error).toMatch(/Found too many values/);
    });

    it('handles empty lines and whitespace', () => {
        const vdf = `

            "key"    "value"

        `;
        const result = parseVdf(vdf);
        expect(result).toEqual({
            success: true,
            content: { key: "value" }
        });
    });

    it('handles escaped quotes in values', () => {
        const vdf = `
            "key" "va\\"lue"
        `;
        const result = parseVdf(vdf);
        expect(result).toEqual({
            success: true,
            content: { key: 'va"lue' }
        });
    });

    it('returns error for malformed string line', () => {
        const vdf = `
            "key value
        `;
        const result = parseVdf(vdf);
        expect(result.success).toBe(false);
        expect((result as any).error).toMatch(/Couldn't separate the values into strings/);
    });
});