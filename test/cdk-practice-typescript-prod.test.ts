import * as cdk from 'aws-cdk-lib';
import { synthTemplate } from './utils';

test('Prod stack retains the DynamoDB table when the stack is destroyed', () => {
  const template = synthTemplate('Hello from prod', cdk.RemovalPolicy.RETAIN);

  template.hasResource('AWS::DynamoDB::Table', {
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  });
});

test('Prod stack passes the prod greeting to Lambda', () => {
  const template = synthTemplate('Hello from prod', cdk.RemovalPolicy.RETAIN);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        GREETING: 'Hello from prod',
      },
    },
  });
});
