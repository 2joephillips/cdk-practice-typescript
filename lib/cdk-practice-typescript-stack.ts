import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { HelloService } from './hello-service';

export class CdkPracticeTypescriptStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const greeting =
      this.node.tryGetContext('greeting') ?? 'Hello from default context';

    const bucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const service = new HelloService(this, 'HelloService', {
      greeting: greeting,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: service.url,
    });
  }
}
