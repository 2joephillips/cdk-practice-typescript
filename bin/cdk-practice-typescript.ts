#!/usr/bin/env node
import { Aspects } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib/core';
import { AwsSolutionsChecks } from 'cdk-nag';
import { CdkPracticeTypescriptStack } from '../lib/cdk-practice-typescript-stack';
import { MonitoringStack } from '../lib/monitoring-stack';

const app = new cdk.App();

const devStack = new CdkPracticeTypescriptStack(
  app,
  'CdkPracticeTypescriptDevStack',
  {
    stackName: 'cdk-practice-typescript-dev',
    description: 'Dev CDK practice stack',
    greeting: 'Hello from dev',
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    tags: {
      environment: 'dev',
    },
  },
);

const prodStack = new CdkPracticeTypescriptStack(
  app,
  'CdkPracticeTypescriptProdStack',
  {
    stackName: 'cdk-practice-typescript-prod',
    description: 'Prod CDK practice stack',
    greeting: 'Hello from prod',
    removalPolicy: cdk.RemovalPolicy.RETAIN,
    tags: {
      environment: 'prod',
    },
  },
);

new MonitoringStack(app, 'CdkPracticeTypescriptDevMonitoringStack', {
  stackName: 'cdk-practice-typescript-dev-monitoring',
  description: 'Dev monitoring stack',
  apiUrl: devStack.apiUrl,
  tags: {
    environment: 'dev',
  },
});

new MonitoringStack(app, 'CdkPracticeTypescriptProdMonitoringStack', {
  stackName: 'cdk-practice-typescript-prod-monitoring',
  description: 'Prod monitoring stack',
  apiUrl: prodStack.apiUrl,
  tags: {
    environment: 'prod',
  },
});

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
