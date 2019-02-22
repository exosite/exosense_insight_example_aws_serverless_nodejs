'use strict'

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
}

module.exports = InsightFunctions