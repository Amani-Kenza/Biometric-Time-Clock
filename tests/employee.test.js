//This library allows to test HTTP endpoints
const request = require('supertest');
//Used to write assertions in tests we can used it with mocha,jest...
const chai = require('chai');
//This is a plugin for chai
const chaiHttp = require('chai-http');
//Set up expect function from chai
const assert = require('assert');
const expect = chai.expect;
const app = require('../app'); 
const Employee=require('../model/employee-model');
chai.use(chaiHttp);

                  /******* Unit tests ***********/

//Define a mocha test suit for create employee endpoint
describe('Create Employee ', function () {
  //define mocha test case with a callback done called when it finishes
  it('Must create an employee', function (done) {
    //send an HTTP request to the application using superset
    request(app)
      .post('/create')
      .send({
        id: '14566',
        lastName: 'Kenza',
        firstName: 'Aamani',
        department: 'SE'
      })
      //callabc called when the request is completed it takes two arguments err and response
      .end(function (err, res) {
        //check if the status code is equal to 201
        expect(res.statusCode).to.equal(201);
        //check if the id is equal to 15466
        expect(res.body.id).to.equal('14566');
        done();
      });
  });

});

                 /******* Integration tests ***********/

 //Define a mocha test suit for get lists employees endpoint
describe('Get Employee', function () {
    //define mocha test case with a callback done called when it finishes
    it('Must return lists of employees', function (done) {
      //send an HTTP request to the application using superset
      request(app)
        .get('/employees')
        .end(function (err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
         
        });
    });
  
    // Ajoutez d'autres tests ici
  });
//Define a mocha test suit for filter employee endpoint
describe('Filter Employee', function () {
    it('Must return lists of employees filter by date', function (done) {
      request(app)
        .get('/employees?dateToSearch=${dateToSearch}`')
        .end(function (err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
         
        });
    });
  
    // Ajoutez d'autres tests ici
  }); 
//Define a mocha test suit for check-in endpoint
describe('Check-in Endpoint', function () {
    //first mocha test case
    it('should successfully check in an employee', function (done) {
      //set exist employeeId to test
      const employeeId = '6542a8e1fe05f78ad816be11';
      //set a comment
      const comment = 'This is a test check-in comment';
  
      request(app)
        .post(`/check-in/${employeeId}`)
        .send({ comment })
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
  
          // Check that the response contains the updated employee data
          //get the employee data
          const employee = res.body;
          //To be sure that the employee check-in in not null or undefined
          assert(employee.checkIn);
          //Verifies that the comment in the response matches the comment I sent in the request.
          assert.strictEqual(employee.comment, comment);
          //Indicate that the test is completed
          done();
        });
    });
    //second mocha test case
    it('should return a 404 error for a non-existing employee', function (done) {
      //set an employeeId that doesn't exist
      const nonExistingEmployeeId = '6542a8e1fe05f78ad816be12';
  
      request(app)
        .post(`/check-in/${nonExistingEmployeeId}`)
        .send({ comment: 'Test comment' })
        //return 404
        .expect(404, done);
    });
    //Third mocha test case returned when an error occur
    it('should return a 500 error if an error occurs during check-in', function (done) {
      request(app)
        .post('/check-in/some_invalid_id')
        .send({ comment: 'Test comment' })
        .expect(500, done);
    });
  });
//Define a mocha test suit for check-out endpoint
describe('Check-out Endpoint', function () {
  //first mocha test case
    it('should successfully check out an employee', function (done) {
      //set exist employeeId to test
      const employeeId = '6542a8e1fe05f78ad816be11';
      //set comment 
      const comment = 'This is a test check-out comment';
  
      request(app)
        .post(`/check-out/${employeeId}`)
        .send({ comment })
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          // Check that the response contains the updated employee data
          //get the employee checkOutDate
          const checkOutDate = res.body;
          //make sure that it isn't NULL or Undefined...
          assert(checkOutDate);
  
          done();
        });
    });
     //Second mocha test case
    it('should return a 404 error for a non-existing employee', function (done) {
      //set an employeeId that doesn't exist
      const nonExistingEmployeeId = '6542a9d21db56d2fc898b10f';
  
      request(app)
        .post(`/check-out/${nonExistingEmployeeId}`)
        .send({ comment: 'Test comment' })
        .expect(404, done);
    });
    //Third mocha test case
    it('should return a 404 error if the employee has not checked in', function (done) {
      //Set an employeeId who didn't check yet
      const employeeIdWithoutCheckIn = '6542a9d21db56d2fc898b10d';
  
      request(app)
        .post(`/check-out/${employeeIdWithoutCheckIn}`)
        .send({ comment: 'Test comment' })
        .expect(404, done);
    });
    //forth mocha test case
    it('should return a 500 error if an error occurs during check-out', function (done) {
      
    //return 500 if it is good
      request(app)
        .post('/check-out/some_invalid_id')
        .send({ comment: 'Test comment' })
        .expect(500, done);
    });
  });
  
  
  
 
  