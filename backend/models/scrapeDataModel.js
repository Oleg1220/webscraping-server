const mongoose = require('mongoose')

const scrapeSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a text value']
    }
},{
    timestamps: true,
}

)

module.exports = mongoose.model('dataScrape', scrapeSchema)