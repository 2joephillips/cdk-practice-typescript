import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkPracticeTypescriptStack } from '../lib/cdk-practice-typescript-stack';

test('Creates DynamoDB table', () => {
  const app = new cdk.App({
    context: {
      greeting: 'Hello from test',
    },
  });

  const stack = new CdkPracticeTypescriptStack(app, 'TestStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::DynamoDB::Table', 1);
});

test('Lambda has greeting environment variable', () => {
  const app = new cdk.App({
    context: {
      greeting: 'Hello from test',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    },
  });

  const stack = new CdkPracticeTypescriptStack(app, 'TestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        GREETING: 'Hello from test',
      },
    },
  });
});

test('Matches snapshot', () => {
  const app = new cdk.App({
    context: {
      greeting: 'Hello from test',
    },
  });

  const stack = new CdkPracticeTypescriptStack(app, 'TestStack');
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
