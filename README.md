# @lunjs/deep-merge

## Installation

```sh
npm install @lunjs/deep-merge
```

## Usage

```js
import { deepMerge } from '@lunjs/deep-merge';

const target = {
  name: 'deep-merge',
  repository: {
    type: 'git'
  },
  keywords: ['deep', 'merge']
};

const source = {
  name: '@lunjs/deep-merge',
  repository: {
    url: 'git+https://github.com/lunjs/deep-merge.git'
  },
  keywords: ['extend', 'clone']
};

const merged = deepMerge(target, source);
console.log(merged);
/*
{
  name: '@lunjs/deep-merge',
  repository: {
    type: 'git',
    url: 'git+https://github.com/lunjs/deep-merge.git'
  },
  keywords: ['deep', 'merge', 'extend', 'clone']
}
*/
```

## Acknowledgements

Fork from [TehShrike/deepmerge](https://github.com/TehShrike/deepmerge/tree/v4.2.2)

## License

[MIT](LICENSE)
