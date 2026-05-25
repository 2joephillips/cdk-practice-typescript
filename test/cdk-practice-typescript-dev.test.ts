import * as cdk from 'aws-cdk-lib';
import { synthTemplate } from './utils';

test('Dev stack destroys the DynamoDB table with the stack', () => {
  const template = synthTemplate('Hello from dev', cdk.RemovalPolicy.DESTROY);

  template.hasResource('AWS::DynamoDB::Table', {
    DeletionPolicy: 'Delete',
    UpdateReplacePolicy: 'Delete',
  });
});

test('Dev stack passes the dev greeting to Lambda', () => {
  const template = synthTemplate('Hello from dev', cdk.RemovalPolicy.DESTROY);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        GREETING: 'Hello from dev',
      },
    },
  });
});
