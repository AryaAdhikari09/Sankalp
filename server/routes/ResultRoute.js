const express = require("express")
const router = express.Router()

const { createResult,getAllResult } = require("../controllers/ResultController")

router.get('/', getAllResult) // gets all results
router.post('/create', createResult) // creates a result

module.exports = router