import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import * as path from 'path';

export interface HelloServiceProps {
  greeting: string;
}

export class HelloService extends Construct {
  public readonly url: string;

  constructor(scope: Construct, id: string, props?: HelloServiceProps) {
    super(scope, id);

    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const helloFunction = new NodejsFunction(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, '../lambda/hello.ts'),
      handler: 'handler',
      environment: {
        GREETING: props?.greeting || 'Hello, World!',
        TABLE_NAME: table.tableName,
      },
    });

    const accessLogGroup = new logs.LogGroup(this, 'HelloApiAccessLogs', {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const api = new apigateway.LambdaRestApi(this, 'HelloApi', {
      handler: helloFunction,
      cloudWatchRole: true,
      cloudWatchRoleRemovalPolicy: cdk.RemovalPolicy.DESTROY,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(accessLogGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        metricsEnabled: true,
      },
    });

    table.grantWriteData(helloFunction);

    NagSuppressions.addResourceSuppressions(
      helloFunction,
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'This learning Lambda uses the CDK default AWSLambdaBasicExecutionRole managed policy for CloudWatch Logs.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        },
        {
          id: 'AwsSolutions-L1',
          reason: 'The function uses CDK Runtime.NODEJS_LATEST; this rule still flags the synthesized runtime in this CDK version.',
        },
      ],
      true,
    );

    NagSuppressions.addResourceSuppressions(
      api,
      [
        {
          id: 'AwsSolutions-APIG2',
          reason: 'This demo API has no request body or query contract yet; validation will be added when explicit inputs are introduced.',
        },
        {
          id: 'AwsSolutions-APIG3',
          reason: 'This learning stack intentionally omits WAF to keep the demo inexpensive and focused on CDK fundamentals.',
        },
        {
          id: 'AwsSolutions-APIG4',
          reason: 'This learning endpoint is intentionally public while practicing API Gateway and Lambda integration.',
        },
        {
          id: 'AwsSolutions-COG4',
          reason: 'This learning endpoint is intentionally public and does not use Cognito authentication.',
        },
        {
          id: 'AwsSolutions-IAM4',
          reason: 'API Gateway access logging uses the CDK-created CloudWatch role with the AWS managed logging policy.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs',
          ],
        },
      ],
      true,
    );

    this.url = api.url;
  }
}
