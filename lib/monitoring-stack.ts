import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface MonitoringStackProps extends cdk.StackProps {
  apiUrl: string;
}

export class MonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    new cdk.CfnOutput(this, 'MonitoredApiUrl', {
      value: props.apiUrl,
    });
  }
}
