# vdf-parser

### Lightweight plain text VDF Parser


### Installation
```bash
npm install @lexogrine/vdf-parser
```

### Usage
```typescript
import { parseVdf } from '@lexogrine/vdf-parser';
import * as fs from 'fs';

const file = fs.readFileSync('appmanifest_730.acf', 'utf-8');

const result = parseVdf(file);
if (result.success) {
    console.log('Parsed VDF Object:', result.content);
} else {
    console.error('Error parsing VDF:', result.error);
}
```

### API
- `parseVdf(vdfContent: string): { success: true, content: VDFObject } | { success: false, error: string }` - Parses VDF content and returns a JavaScript object representation or an error.
- `VDFObject` - Type representing the structure of the parsed VDF data.

### License
This project is licensed under the MIT License.

### Maintainers
This project is used by [steam-path-finder](https://www.npmjs.com/package/@lexogrine/steam-path-finder) and is maintained by [Lexogrine](https://lexogrine.com) ([LHM.gg](https://lhm.gg)).