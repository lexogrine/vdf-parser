export type VDFObject = { [key: string]: string | VDFObject };

const parseString = (str: string): string | undefined => {
    try {
        const parsed = JSON.parse(`"${str}"`);
        if (typeof parsed === "string") {
            return parsed;
        }

        return undefined;
    } catch (error) {
        return undefined;
    }
}

const parseStringLine = (line: string): (string | undefined)[] => {
    const strings = [];
    let currentString = undefined;
    let escaped = false;
    for (let currentCharacter = 0; currentCharacter < line.length; currentCharacter++) {
        if (line[currentCharacter] == '"' && !escaped) {
            if (currentString === undefined) {
                currentString = "";
            } else {
                strings.push(currentString);
                currentString = undefined;
            }
        } else {
            if (currentString !== undefined) {
                if (line[currentCharacter] === '\\' && !escaped) {
                    escaped = true;
                } else {
                    escaped = false;
                }
                currentString += line[currentCharacter];
            }
        }
    }

    if (currentString !== undefined) {
        strings.push(undefined);
    }

    return strings.map(x => x !== undefined ? parseString(x) : undefined);
}

export const parseVdf = (fileContent: string): { success: true, content: VDFObject } | { success: false, error: string } => {
    const result: VDFObject = {};
    const levelStack = [result];
    const lines = fileContent.split('\n');

    let lastKey: string | undefined = undefined;
    for (let currentLine = 0; currentLine < lines.length; currentLine += 1) {
        const line = lines[currentLine];

        if (!line) continue;
        const trimmedLine = line.trim();

        const currentLastObject = levelStack[levelStack.length - 1];
        if (currentLastObject === undefined) {
            return { success: false as const, error: `Malformed VDF file at line ${currentLine + 1} (A key not associated to any object)` };
        }

        if (trimmedLine === "{") {
            if (lastKey === undefined) {
                return { success: false as const, error: `Malformed VDF file at line ${currentLine + 1} (new object without a key)` };
            }
            const newObject = {};
            currentLastObject[lastKey] = newObject;
            levelStack.push(newObject);
            lastKey = undefined;
        } else if (trimmedLine === "}") {
            if (levelStack.length <= 1) {
                return { success: false as const, error: `Malformed VDF file at line ${currentLine + 1} (Object close without an associated open)` };
            }
            levelStack.pop();
        } else {
            const strings = parseStringLine(trimmedLine);

            if (strings.length === 0) {
                continue;
            }

            if (strings.findIndex(x => x === undefined) !== -1) {
                return { success: false as const, error: `Malformed VDF file at line ${currentLine + 1} (Couldn't separate the values into strings)` };
            }
            const stringsCoerced = strings as string[];

            if (stringsCoerced.length > 2) {
                return { success: false as const, error: `Malformed VDF file at line ${currentLine + 1} (Found too many values (${stringsCoerced.length}))` };
            }

            if (stringsCoerced.length === 1) {
                lastKey = stringsCoerced[0];
            } else {
                currentLastObject[stringsCoerced[0] as string] = stringsCoerced[1] as string;
            }
        }
    }

    return { success: true, content: result };
}