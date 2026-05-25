#!/usr/bin/env node
import { Aspects } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib/core';
import { AwsSolutionsChecks } from 'cdk-nag';
import { CdkPracticeTypescriptStack } from '../lib/cdk-practice-typescript-stack';

const app = new cdk.App();
new CdkPracticeTypescriptStack(app, 'CdkPracticeTypescriptStack', {});
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
