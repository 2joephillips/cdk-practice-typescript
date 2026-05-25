import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkPracticeTypescriptStack } from '../lib/cdk-practice-typescript-stack';
import { MonitoringStack } from '../lib/monitoring-stack';

test('Monitoring stack outputs the API URL from another stack', () => {
  const app = new cdk.App();

  const appStack = new CdkPracticeTypescriptStack(app, 'AppStack', {
    greeting: 'Hello from test',
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });

  const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
    apiUrl: appStack.apiUrl,
  });

  const template = Template.fromStack(monitoringStack);

  template.hasOutput('MonitoredApiUrl', {});
});

test('Matches snapshot', () => {
  const app = new cdk.App({
    context: {
      greeting: 'Hello from test',
    },
  });

  const stack = new MonitoringStack(app, 'TestStack', {
    apiUrl: 'https://example.com/api',
  });
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
