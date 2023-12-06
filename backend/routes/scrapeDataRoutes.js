const express = require('express')
const router = express.Router()
const {getData}=require('../controllers/scrapeDataModel')


// @desc API for Fetch and Post
router.route('/').get(getData)
// Route Ready for next process
// .post(setData)

// @desc API for Update and Delete
// Route Ready for next process
// router.route('/:id').put(updateData).delete(deleteData)




module.exports = router