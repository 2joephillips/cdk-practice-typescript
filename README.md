# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Git hooks

This repo includes a shared pre-push hook in `.githooks/pre-push`. The hook runs
`npm run build` and then `npm test` before allowing a push to continue.

After cloning the repo, run:

```sh
npm install
git config core.hooksPath .githooks
```

You only need to configure `core.hooksPath` once per local clone. To confirm it is
set correctly, run:

```sh
git config --get core.hooksPath
```

The output should be `.githooks`.
