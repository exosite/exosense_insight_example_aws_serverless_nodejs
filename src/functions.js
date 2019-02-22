'use strict'
const math = require('mathjs')
class InsightFunctions {
    // constructor() {}
    
    getFunctions(groupId) {
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
            }, {
                id: "mathEquation",
                name: "Math Equation",
                description: "Use Math.js to apply equation calculation",
                constants: [
                    {
                        name: "equation",
                        type: "string",
                        description: "Ex: sqrt(x)"
                    }
                ],
                inlets: [
                    {
                        data_type: "NUMBER",
                        data_unit: "",
                        name: "x",
                        description: "Will become x variable"
                    }
                ],
                outlets: {
                    data_type: "NUMBER",
                    data_unit: "",
                }
            }
        ]
    }

    addNumbers(body) {
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

    mathEquation(body) {
        let {data, args} = body
        let expr = args.constants.equation
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
}

module.exports = InsightFunctions