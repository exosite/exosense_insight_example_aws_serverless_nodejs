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
        let {data, constants} = body

        // data is a list of datapoints
        let out = data.map(dp => {
            dp.value += constants.adder
            return dp
        })
        
        return out
    }
}

module.exports = InsightFunctions