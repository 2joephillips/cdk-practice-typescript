import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { HelloService } from './hello-service';

export class CdkPracticeTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const greeting =
      this.node.tryGetContext('greeting') ?? 'Hello from default context';

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
        reason: 'This bucket stores S3 server access logs for the demo bucket. Logging the log bucket to itself is intentionally avoided.',
      },
    ]);

    const service = new HelloService(this, 'HelloService', {
      greeting: greeting,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: service.url,
    });
  }
}
