import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
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
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const helloFunction = new NodejsFunction(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../lambda/hello.ts'),
      handler: 'handler',
      environment: {
        GREETING: props?.greeting || 'Hello, World!',
        TABLE_NAME: table.tableName,
      },
    });

    const api = new apigateway.LambdaRestApi(this, 'HelloApi', {
      handler: helloFunction,
    });

    table.grantWriteData(helloFunction);

    this.url = api.url;
  }
}
