# ExoSense™ Insight with AWS serverless How-To Guide

This guide provide an ExoSense Insight with AWS serverless infracture. 

We are using Node.js and Express.js to build our API.
And run in AWS API Gateway and Lambda by leverage Caludia.js which help us deploy and do the configuration.

The example code also implement ExoSense Insight interface and can generate swagger file that Murano Service needed.

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

### 3. Test api with curl

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

### 

## Configure Murano Element

### 1. Generate YAML spec document for Murano Service

```
HOST="uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com" BASEPATH="/latest" PORT=443 npm run gen-api-spec
```

The result file will be `swagger.yaml`.

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

Result Swagger YAML now can get from API. The url is 

```
https://uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com/latest/swagger.yaml
```

We can test with curl

```
curl https://uw9mp3g45m.execute-api.ap-southeast-1.amazonaws.com/latest/swagger.yaml
```

## Run express.js server locally for development

```
npm run start
```
