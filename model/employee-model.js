const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
    id:String,
    lastName:String,
    firstName:String,
    department:String,
    dateCreated:Date,
    checkIn:Date,
    checkOut:Date,
    comment:String,
    TimeDifferHours:Number,
})
 module.exports=mongoose.model('Employee',employeeSchema);
