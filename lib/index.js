"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// tsc/index.ts
var index_exports = {};
__export(index_exports, {
  parseVdf: () => parseVdf
});
module.exports = __toCommonJS(index_exports);

// tsc/vdf_parser.ts
var parseString = (str) => {
  try {
    const parsed = JSON.parse(`"${str}"`);
    if (typeof parsed === "string") {
      return parsed;
    }
    return void 0;
  } catch (error) {
    return void 0;
  }
};
var parseStringLine = (line) => {
  const strings = [];
  let currentString = void 0;
  let escaped = false;
  for (let currentCharacter = 0; currentCharacter < line.length; currentCharacter++) {
    if (line[currentCharacter] == '"' && !escaped) {
      if (currentString === void 0) {
        currentString = "";
      } else {
        strings.push(currentString);
        currentString = void 0;
      }
    } else {
      if (currentString !== void 0) {
        if (line[currentCharacter] === "\\" && !escaped) {
          escaped = true;
        } else {
          escaped = false;
        }
        currentString += line[currentCharacter];
      }
    }
  }
  if (currentString !== void 0) {
    strings.push(void 0);
  }
  return strings.map((x) => x !== void 0 ? parseString(x) : void 0);
};
var parseVdf = (fileContent) => {
  const result = {};
  const levelStack = [result];
  const lines = fileContent.split("\n");
  let lastKey = void 0;
  for (let currentLine = 0; currentLine < lines.length; currentLine += 1) {
    const line = lines[currentLine];
    if (!line) continue;
    const trimmedLine = line.trim();
    const currentLastObject = levelStack[levelStack.length - 1];
    if (currentLastObject === void 0) {
      return { success: false, error: `Malformed VDF file at line ${currentLine + 1} (A key not associated to any object)` };
    }
    if (trimmedLine === "{") {
      if (lastKey === void 0) {
        return { success: false, error: `Malformed VDF file at line ${currentLine + 1} (new object without a key)` };
      }
      const newObject = {};
      currentLastObject[lastKey] = newObject;
      levelStack.push(newObject);
      lastKey = void 0;
    } else if (trimmedLine === "}") {
      if (levelStack.length <= 1) {
        return { success: false, error: `Malformed VDF file at line ${currentLine + 1} (Object close without an associated open)` };
      }
      levelStack.pop();
    } else {
      const strings = parseStringLine(trimmedLine);
      if (strings.length === 0) {
        continue;
      }
      if (strings.findIndex((x) => x === void 0) !== -1) {
        return { success: false, error: `Malformed VDF file at line ${currentLine + 1} (Couldn't separate the values into strings)` };
      }
      const stringsCoerced = strings;
      if (stringsCoerced.length > 2) {
        return { success: false, error: `Malformed VDF file at line ${currentLine + 1} (Found too many values (${stringsCoerced.length}))` };
      }
      if (stringsCoerced.length === 1) {
        lastKey = stringsCoerced[0];
      } else {
        currentLastObject[stringsCoerced[0]] = stringsCoerced[1];
      }
    }
  }
  return { success: true, content: result };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseVdf
});
