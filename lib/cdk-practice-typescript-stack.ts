import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { HelloService } from './hello-service';

export interface CdkPracticeTypescriptStackProps extends cdk.StackProps {
  greeting: string;
  removalPolicy?: cdk.RemovalPolicy;
}

export class CdkPracticeTypescriptStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: CdkPracticeTypescriptStackProps,
  ) {
    super(scope, id, props);

    const greeting =
      props?.greeting ??
      this.node.tryGetContext('greeting') ??
      'Hello, CDK with TypeScript!';
    const removalPolicy =
      props?.removalPolicy ??
      this.node.tryGetContext('removalPolicy') ??
      cdk.RemovalPolicy.DESTROY;

    const accessLogsBucket = new s3.Bucket(this, 'AccessLogsBucket', {
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      enforceSSL: true,
      serverAccessLogsBucket: accessLogsBucket,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    NagSuppressions.addResourceSuppressions(accessLogsBucket, [
      {
        id: 'AwsSolutions-S1',
        reason:
          'This bucket stores S3 server access logs for the demo bucket. Logging the log bucket to itself is intentionally avoided.',
      },
    ]);

    const service = new HelloService(this, 'HelloService', {
      greeting,
      removalPolicy,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: service.url,
    });
  }
}
