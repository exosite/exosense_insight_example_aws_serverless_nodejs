'use strict'
const math = require('mathjs')
const rp = require('request-promise')

class InsightFunctions {
    constructor() {
        this._insightsInfos = {
            "mathFormulaOne": {
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
            }, 
            "mathFormulaTwo": {
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
                history: {
                    limit: { value: 1 },
                //     relative_start: {value: '-1d'},
                }
            }, 
            "httpPost": {
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
            "addNumbers": {
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
        }
    }
    
    getFunctions(groupId) {
        let keys = Object.keys(this._insightsInfos)
        return keys.map((key) => {
            return this._insightsInfos[key]
        })
    }

    getFunctionInfo(functionId) {
        return this._insightsInfos[functionId]
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
        let {data, args, history} = body
        let expr = args.constants.formula
        const code = math.compile(expr)

        let hisValue = {
            inlet: [],
            outlet: [],
        }

        // transform history data
        for(let signalId in history) {
            let obj = history[signalId][0]

            if(obj.tags && obj.tags.inlet) {
                hisValue.inlet[obj.tags.inlet] = obj
            }

            if(obj.tags && obj.tags.outlet) {
                hisValue.outlet[obj.tags.outlet] = obj
            }
        }

        // data is a list of datapoints
        let out = data.map(dp => {
            // clone values
            let inlets = [
                hisValue.inlet[0].value,
                hisValue.inlet[1].value
            ]

            // replase with current dp value
            inlets[dp.tags.inlet] = dp.value

            dp.value = code.eval({x: inlets[0], y: inlets[1]})

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