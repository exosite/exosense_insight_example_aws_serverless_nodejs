# ExoSense™ Insight with AWS serverless How-To Guide

This guide provide an ExoSense Insight with AWS serverless infracture. 

We are using Node.js and Express.js to build our API.
And run in AWS API Gateway and Lambda by leverage Caludia.js which help us deploy and do the configuration.

The example code also implement ExoSense Insight interface and can generate swagger file that Murano Service needed.

## Tool used

1. aws-cli
2. Claudia.js to deploy and configure AWS API Gateway and Lambda
3. swagger-jsdoc to generate swagger.json
4. jq to modify swagger.json
5. json2yaml to transform swagger.json to swagger.yaml

## Deploy to AWS 

### 1. Preqrequire

* install aws-cli
* prepare aws credential (API key): edit `~/.aws/config` and `~/.aws/credential`; or use aws-cli

```
$ aws configure
AWS Access Key ID [****************PKZQ]:
AWS Secret Access Key [****************Dk0w]:
Default region name [ap-southeast-1]:
Default output format [None]:
```

### 2. First deploy

run 

```
claudia create --handler lambda.handler --deploy-proxy-api --region ap-southeast-1
```

or

```
npm run create
```

Will output file `claudia.json`

```
{
  "lambda": {
    "role": "demo_exosense_insight_claudia-executor",
    "name": "demo_exosense_insight_claudia",
    "region": "ap-southeast-1"
  },
  "api": {
    "id": "uw9mp3g45m",
    "url": "https://uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com/latest"
  }
}
```

That output api `https://uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com/latest` is your API Gateway base endpoint. It append `/latest` for version control in the API Gateway way.

Note that the Url is not wrtten to the `claudia.json`, you can add to the file manually for later reference.

### 3. Test api with curl

Claudia.js already set up API Gateway and created AWS Lambda with your code. Now we can test it.

```
$ curl --request POST   --url https://uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com/latest/insights   --header 'content-type: application/json'   --data '{
    "function_id": "addNumbers",
    "constants": {
        "adder": 1
    },
    "data": [
        {
            "value": 1
        },
        {
            "value": 2
        },
        {
            "value": 3
        }
    ]
}' | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   538  100   306  100   232    811    614 --:--:-- --:--:-- --:--:--   809
{
  "count": 1,
  "total": 1,
  "insights": [
    {
      "id": "addNumbers",
      "name": "Add Numbers",
      "description": "Sum one data point and a user-defined value",
      "constants": [
        {
          "name": "adder",
          "type": "number"
        }
      ],
      "inlets": [
        {
          "data_type": "NUMBER",
          "data_unit": "",
          "description": "One number"
        }
      ],
      "outlets": {
        "data_type": "NUMBER",
        "data_unit": ""
      }
    }
  ]
}
```

## Configure Murano Element

### 1. Generate YAML spec document for Murano Service

```
HOST="uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com" BASEPATH="/latest" PORT=443 npm run gen-api-spec
```

The result file will be `swagger.yaml`.

More avaiable environment variables or generate logic please reference to the file `swagger/swaggerDef.js`

### 2. Upload swagger.yaml by deploy again

Run

```
claudia update
```

or

```
npm run update
```

### 3. Test swagger.yaml is avaiable 

Result Swagger YAML now can get from API. You can use this rul when creating Murano Element service `Configuration File URL (YAML) *` field. The url is 

```
https://uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com/latest/swagger.yaml
```

We can test with curl

```
curl https://uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com/latest/swagger.yaml
```

### 4. Create Murano Element service 

Use the url `https://uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com/latest/swagger.yaml`

~Note that the service name must start with `insight` according to ExoSense's implement.~

Add insight tag to the swagger file instead.

### 5. Enable the service in the application

### 6. Now you should can use the insight function in the ExoSense data pipeline transform editor.

## Run express.js server locally for development

```
$ npm run start

> demo_exosense_insight_claudia@1.0.0 start /Users/hialan/Work/demo_exosense_insight_claudia
> node server.js

Example app listening on port 3000!
```

Now you can test your API locally on port 3000 with HTTP protocol.

Note that the base path will be `/`, no need to append `/latest` like in API Gateway.

```
curl --request POST   --url http://localhost:3000/insights   --header 'content-type: application/json' --data '{}'
```

## Example request

### POST http://localhost:3000/process

Body 

```
{
    "id": "d5c52153-e883-4d0f-b8ef-b11d7e3b0eca",
    "data": [
        {
            "value": -53,
            "ttl": 0,
            "ts": 1550831402262690,
            "tags": {
                "resource": "data_in",
                "primitive_type": "NUMERIC",
                "pid": "j3pib1jhzgxu00000",
                "metric": "Temperature with celsius",
                "inlet": "0",
                "identity": "AA006",
                "data_unit": "DEG_CELSIUS",
                "data_type": "TEMPERATURE"
            },
            "origin": "j3pib1jhzgxu00000.AA006.data_in.Temperature with celsius",
            "gts": 1550831402000000,
            "generated": "316dc43c-cd16-457f-aec8-f3bba6597305"
        }
    ],
    "args": {
        "type": "transform",
        "name": "Demo Insight Claudia",
        "insight_id": "insightlambdaclaudiatest01",
        "function_id": "addNumbers",
        "constants": {
            "adder": 5
        }
    }
}
```

Resoponse

```
[
  [
    {
      "value": -48,
      "ttl": 0,
      "ts": 1550831402262690,
      "tags": {
        "resource": "data_in",
        "primitive_type": "NUMERIC",
        "pid": "j3pib1jhzgxu00000",
        "metric": "Temperature with celsius",
        "inlet": "0",
        "identity": "AA006",
        "data_unit": "DEG_CELSIUS",
        "data_type": "TEMPERATURE"
      },
      "origin": "j3pib1jhzgxu00000.AA006.data_in.Temperature with celsius",
      "gts": 1550831402000000,
      "generated": "316dc43c-cd16-457f-aec8-f3bba6597305"
    }
  ]
]
```

## Reference

* [Lua Example Code](https://github.com/exosite/exosense_insight_example_murano_lua)
* [Channel Data Types and Units](https://exosense.readme.io/docs/channel-configuration#section-channel-data-types-and-units)