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

### About
**Lexogrine** is a [**Node.js development company**](https://lexogrine.com/technologies/nodejs-development) and AI agent development house, delivering high-end AI, web, and mobile design services to a global clientele. In addition to bespoke development, Lexogrine provides a suite of innovative applications, such as [LHM.gg](https://lhm.gg), designed to transform professional collaboration and streamline industry-specific workflows.

We specialize in advanced AI development, supported by robust web, mobile, and cloud engineering. Our core technology stack relies on TypeScript, Python, LLMs, React, React Native, Node.js, Prisma, Medusa, PyTorch, AWS, and Google Cloud Platform.

Backed by over 5 years of experience, Lexogrine has delivered hundreds of successful projects, empowering global enterprises with scalable, future-ready technology.



### Maintainers
This project is used by [steam-path-finder](https://www.npmjs.com/package/@lexogrine/steam-path-finder) and is maintained by [Lexogrine](https://lexogrine.com) ([LHM.gg](https://lhm.gg)).