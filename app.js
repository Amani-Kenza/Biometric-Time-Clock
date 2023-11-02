var createError = require('http-errors');
var express = require('express');
var path = require('path');
//we use it to log information about incoming HTTP requests, like method used(GET,POST,..), status code, URL
var logger = require('morgan');
//we use it to interact with a mongoDB database
const mongoose = require('mongoose');


//Get Employee Model schema for the database
var Employee=require('./model/employee-model');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Middleware for logging HTTP requests
app.use(logger('dev'));
//We use it to makes data available on req.body
app.use(express.json());
//Help to include static files from public
app.use(express.static(path.join(__dirname, 'public')));

//Connection with Employee Database (MongoDB) (The model of the database is defined in /model/employee-model.js)
mongoose.connect('mongodb://127.0.0.1:27017/Employee',
{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("connection success"))
.catch(()=>console.log("connection failed"));
 
//Endpoint to create a new employee using POST and save it in the database
app.post('/create',async(req,res)=>{
  try{
   const { id, lastName, firstName, department } = req.body;
   const dateCreated = new Date();
   //create new employee
   const employee=new Employee({ id, lastName, firstName, department, dateCreated });
   //save employee in DB
   await employee.save();
   res.status(201).json(employee);
  }catch (error) {
    res.status(500).json({ error: 'Error in created the employee'});
  }
});

//Endpoint  to get list of employees 
app.get('/employees',(req,res)=>{
   //search for employees in the database using find()
    Employee.find()
     .then((employees)=>{
      res.status(200).json(employees);
      //res.render('index', { employees: employees }); if we want to use a view
     })
     .catch(err=>{
      res.status(500).json({error: 'No employee found'});
  
})
})

//Endpoint  to get employee with filter
app.get('/employeesBydate',(req,res)=>{
  //create date filter
  const dateToSearch = new Date("2021-01-05");
  //search for employee with the date 
  Employee.find({dateCreated:dateToSearch})
   .then((employees)=>{
    res.status(200).json(employees);
   })
   .catch(err=>{
    res.status(500).json({err: 'No employee found'});

})
})

//Endpoint Check-in endpoint with parameters employeeId and comment
app.post('/check-in/:employeeId/comment',async(req,res)=>{
  try{
  //get te employeeID and comment from parameters of the URL
  const employeeId = req.params.employeeId;
  const comment = req.body.comment;
  //set the check-in date into the current date
  const checkInDate =new Date();
  //search for the employee in DB
  const employee = await Employee.findById(employeeId);
  if (!employee) {
  res.status(404).json({ error: 'Employee not Found' });
  }
  //if we find it we update checkIn and comment of the employee
  employee.checkIn = checkInDate;
  employee.comment = comment;
  await employee.save()
  res.status(201).json(employee);
  }catch(error){
    res.status(500).json({ error: 'Check-in failed'});
  }
})

//Endpoint Check-out endpoint with parameters employeeId and comment same thing as check-in but we will add timeDiffer
app.post('/check-out/:employeeId/comment',async(req,res)=>{
  try{
  const employeeId = req.params.employeeId;
  const comment = req.body.comment;

  const employee = await Employee.findById(employeeId);
  if (!employee) {
  return res.status(404).json({ error: 'Employee not Found' });
  }
  if (!employee.checkIn) {
  res.status(404).json({ error: 'Employee does not checkIn already' });
  }
  // set checkOut date to the current date
  const checkOutDate =new Date();
  // get checkIn date
  const checkIn=employee.checkIn;
 // calculate time between checkIn and checkOut
  const TimeDiffer=checkOutDate-checkIn;

  //add checkout and comment of the employee in the database
  employee.checkOut=checkOutDate;
  employee.comment=comment
  //add the time to database
  employee.TimeDiffer=TimeDiffer;
  // Convert time difference to hours
  const timeDifferHours = TimeDiffer / (1000 * 60 * 60);
  // save changes in database
  await employee.save()
  res.status(201).json(employee);
  }catch(error){
    res.status(500).json({ error: 'Check-out failed'});
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
