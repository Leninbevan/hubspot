import mongoose from 'mongoose'

const BoardItems = new mongoose.Schema({
    eventId: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    propertyName: {
        type: String,
        required: true
    },
    objectId: {
        type: String,
        required: true
    },
    objectType: {
        type: String,
        required: true
    },
    propertyValue: {
        type: String,
        required: true
    },
    dealName: {
        type: String,
        required: true
    },
    dealAmount:{
        type : String,
        required : true
    },
    contactEmail:{
        type : String,
        required : true
    },
})
const boardItemModal = mongoose.model('BoardItems',BoardItems)

export default boardItemModal;