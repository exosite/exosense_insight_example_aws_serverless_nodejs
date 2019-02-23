'use strict'
const fs = require('fs')
const router = require('express').Router()
const InsightFunctions = require('./functions.js')
const funcs = new InsightFunctions()

router.get('/', (req, res) => {
    res.json({
        msg: "Hello World!"
    })
})

router.get('/swagger.yaml', (req, res) => {
    fs.readFile(__dirname + '/../swagger.yaml', (err, data) => {
        if(err) {
            return res.status(404).send('File Not Found')
        }

        return res.type('text/yaml').send(data.toString())
    })
})

/**
 * @swagger
 * /info:
 *   get:
 *     operationId: info
 *     description: Get some info about this Insight
 *     responses:
 *       "200":
 *          description: Insight Functions successfully listed
 *          schema:
 *            $ref: "#/definitions/InsightInfoResults"
 *       default:
 *         description: Errors
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.get('/info', (req, res) => {
    res.json({
        name: "My Demo Insight Claudia",
        description: "This is a demo ExoSense Insight",
        group_id_required: true
    })
})

/**
 * @swagger
 * /insight/{function_id}:
 *   get:
 *     operationId: infoInsight
 *     description: Get info about one Insight Function
 *     responses:
 *       "200":
 *          description: Insight Functions successfully listed
 *          schema:
 *            $ref: "#/definitions/InsightInfo"
 *       default:
 *         description: Errors
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.get('/insight/:function_id', (req, res) => {
    // not implement yet
})

/**
 * @swagger
 * /insights:
 *   post:
 *     operationId: listInsights
 *     description: Get a list of availible Insight Functions and info about them
 *     parameters:
 *     - name: body
 *       in: body
 *       description: Get a list of availible insight functions
 *       required: true
 *       schema:
 *         $ref: '#/definitions/InsightsFilterParams'
 *     responses:
 *       "200":
 *         description: Insight Functions successfully listed
 *         schema:
 *           $ref: "#/definitions/InsightListResults"
 *       default:
 *         description: Errors
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.post('/insights', (req, res) => {
    let groupId = req.body.group_id
    let result = funcs.getFunctions(groupId)
    res.json({
        count: result.length,
        total: result.length,
        insights: result
    })
})

/**
 * @swagger
 * /process: # The acutal path can be anything.
 *   post:
 *     operationId: process
 *     description: |
 *       Your function to process a bunch of Signal Data.
 *       It is good form to copy all the fields of a source SignalData into the new SignalData,
 *       then update the properties according to your function.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Data to process and arguments on how to process it
 *         required: true
 *         schema:
 *           $ref: "#/definitions/SignalDataObjectArray"
 *     responses:
 *       "200":
 *         description: Data successfully
 *         schema:
 *           $ref: "#/definitions/SignalDataArrayArray"
 *       default:
 *         description: Error that stops the pipeline.
 *           Non-fatal errors should produce new signals on a seperate outlet.
 *         schema:
 *           $ref: '#/definitions/ErrorResponse'
 */
router.post('/process', (req, res) => {
    let body = req.body
    let {args} = body
    let result = {}
    let fns = funcs.getFunctions().map(obj => obj.id)

    if(fns.includes(args.function_id)) {
        result = funcs[args.function_id](req.body)
    }

    res.json(result)
})

module.exports = router;