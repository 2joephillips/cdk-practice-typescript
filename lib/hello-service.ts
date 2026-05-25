import * as apigateway from 'aws-cdk-lib/aws-apigateway';
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

    const helloFunction = new NodejsFunction(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../lambda/hello.ts'),
      handler: 'handler',
      environment: {
        GREETING: props?.greeting || 'Hello, World!',
      },
    });

    const api = new apigateway.LambdaRestApi(this, 'HelloApi', {
      handler: helloFunction,
    });

    this.url = api.url;
  }
}
