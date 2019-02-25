'use strict'
const math = require('mathjs')
const rp = require('request-promise')

class InsightFunctions {
    // constructor() {}
    
    getFunctions(groupId) {
        if(typeof groupId === 'string' && groupId.toLowerCase() === 'sigfoxhackday') {
            return [
                {
                    id: "mathFormulaOne",
                    name: "One Variable Formula",
                    description: "Use Math.js to apply equation calculation. http://mathjs.org/docs/expressions/syntax.html",
                    constants: [
                        {
                            name: "formula",
                            type: "string",
                            description: "Ex: log(sqrt(x*10))"
                        }
                    ],
                    inlets: [
                        {
                            data_type: "NUMBER",
                            data_unit: "",
                            name: "x",
                            description: "x variable"
                        }
                    ],
                    outlets: {
                        data_type: "NUMBER",
                        data_unit: "",
                    }
                }, {
                    id: "mathFormulaTwo",
                    name: "Two Variables Formula",
                    description: "Use Math.js to apply equation calculation. http://mathjs.org/docs/expressions/syntax.html",
                    constants: [
                        {
                            name: "formula",
                            type: "string",
                            description: "Ex: log(sqrt(x*10)) + y"
                        }
                    ],
                    inlets: [
                        {
                            data_type: "NUMBER",
                            data_unit: "",
                            name: "x",
                            description: "x variable"
                        }, {
                            data_type: "NUMBER",
                            data_unit: "",
                            name: "y",
                            description: "y variable"
                        }
                    ],
                    outlets: {
                        data_type: "NUMBER",
                        data_unit: "",
                    },
                    // history: {
                    //     limit: { value: 1 },
                    //     relative_start: {value: '-1d'},
                    // }
                }, {
                    id: "httpPost",
                    name: "HTTP Post",
                    description: "bypassing to external service",
                    constants: [
                        {
                            name: "url",
                            type: "string",
                            description: "Endpoint url"
                        }, {
                            name: "add_payload",
                            type: "string",
                            description: "Your additional payload"
                        }
                    ],
                    inlets: [
                        {
                            data_type: "NUMBER",
                            data_unit: "",
                            name: "x",
                            description: "x variable"
                        }
                    ],
                    outlets: {
                        data_type: "string",
                        data_unit: "",
                    },
                }, 
            ];
        } else {
            return [
                {
                    id: "addNumbers",
                    name: "Add Numbers",
                    description: "Sum one data point and a user-defined value",
                    constants: [
                        {
                            name: "adder",
                            type: "number"
                        }
                    ],
                    inlets: [
                        {
                            data_type: "NUMBER",
                            data_unit: "",
                            description: "One number"
                        }
                    ],
                    outlets: {
                        data_type: "NUMBER",
                        data_unit: "",
                    }
                }    
            ];
        }
    }

    async addNumbers(body) {
        let {data, args} = body

        // data is a list of datapoints
        let out = data.map(dp => {
            // Each signal value in dataOUT should keep the incoming metadata
            dp.value += args.constants.adder
            return dp
        })
        
        // since ExoSense insight support multiple output signals, so it return Array of Array.
        return [out]
    }

    async mathFormulaOne(body) {
        let {data, args} = body
        let expr = args.constants.formula
        const code = math.compile(expr)

        // data is a list of datapoints
        let out = data.map(dp => {
            // Each signal value in dataOUT should keep the incoming metadata
            dp.value = code.eval({x: dp.value})
            // not a number
            if(isNaN(dp.value)) {
                dp.value = null;
            }
            return dp
        })
        
        // since ExoSense insight support multiple output signals, so it return Array of Array.
        return [out]
    }

    async mathFormulaTwo(body) {
        let {data, args} = body
        let expr = args.constants.formula
        const code = math.compile(expr)

        // data is a list of datapoints
        let out = data.map(dp => {
            // Each signal value in dataOUT should keep the incoming metadata

            // TODO: I can get `x` or `y` at one time ... need a storage to cache last value.
            dp.value = code.eval({x: dp.value})

            // not a number
            if(isNaN(dp.value)) {
                dp.value = null;
            }
            return dp
        })
        
        // since ExoSense insight support multiple output signals, so it return Array of Array.
        return [out]
    }

    async httpPost(body) {
        let {args} = body
        let url = args.constants.url
        let result = rp({
            method: 'POST',
            url: url,
            body: JSON.stringify(body),
            headers: {
                'content-type' : 'application/json'
            }
        })
        return [result]
    }
}

module.exports = InsightFunctions