# Baby React

# Requirements
* node >= 4
* npm >= 3

# Usage

1. Install: `npm i baby-react --save`
2. Install peer dependencies
3. Add to `package.json`:
```
"scripts": {
  "baby": "baby"
}
```
3. App entrypoint is expected at `./src/app/index.jsx`

## Create base files
`npm run baby-init`

## Start dev server
`npm run baby-dev`

## Build for production
`npm run baby-build` -- Outputs to `./dist` directory

## Run tests
`npm run baby-test`

## Copy the configs into project
`npm run unbaby`

https://github.com/shelljs/shelljs
http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm
https://github.com/gulpjs/gulp/issues/770
