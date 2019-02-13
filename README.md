# ExoSense™ Insight with AWS serverless How-To Guide

This guide provide an ExoSense Insight with AWS serverless infracture. 

We are using Node.js and Express.js to build our API.
And run in AWS API Gateway and Lambda by leverage Caludia.js which help us deploy and do the configuration.

The example code also implement ExoSense Insight interface and can generate swagger file that Murano Service needed.

## Run express.js server locally for development

```
npm run start
```

## Deploy to AWS 

## Generate YAML spec document for Murano Service

```
npm run gen-api-spec
```

The result file will be `swagger.yaml`.