import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkPracticeTypescriptStack } from '../lib/cdk-practice-typescript-stack';

export const synthTemplate = (
  greeting: string,
  removalPolicy: cdk.RemovalPolicy,
) => {
  const app = new cdk.App();

  const stack = new CdkPracticeTypescriptStack(app, 'TestStack', {
    greeting,
    removalPolicy,
  });

  return Template.fromStack(stack);
};
