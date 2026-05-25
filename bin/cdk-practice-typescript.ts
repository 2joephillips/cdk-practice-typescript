#!/usr/bin/env node
import { Aspects } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib/core';
import { AwsSolutionsChecks } from 'cdk-nag';
import { CdkPracticeTypescriptStack } from '../lib/cdk-practice-typescript-stack';
import { MonitoringStack } from '../lib/monitoring-stack';

const app = new cdk.App();

const devStack = new CdkPracticeTypescriptStack(app, 'main-dev-stack', {
  stackName: 'main-dev-stack',
  description: 'Dev CDK practice stack',
  greeting: 'Hello from dev',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  tags: {
    environment: 'dev',
  },
});

const prodStack = new CdkPracticeTypescriptStack(app, 'main-prod-stack', {
  stackName: 'main-prod-stack',
  description: 'Prod CDK practice stack',
  greeting: 'Hello from prod',
  removalPolicy: cdk.RemovalPolicy.RETAIN,
  tags: {
    environment: 'prod',
  },
});

new MonitoringStack(app, 'main-dev-monitoring', {
  stackName: 'main-dev-monitoring',
  description: 'Dev monitoring stack',
  apiUrl: devStack.apiUrl,
  tags: {
    environment: 'dev',
  },
});

new MonitoringStack(app, 'main-prod-monitoring', {
  stackName: 'main-prod-monitoring',
  description: 'Prod monitoring stack',
  apiUrl: prodStack.apiUrl,
  tags: {
    environment: 'prod',
  },
});

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
