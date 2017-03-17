$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAgvFDHBzo6t3JqTy6wMKFAjQZ8l-rcSbA",
    authDomain: "train-scheduler-243f2.firebaseapp.com",
    databaseURL: "https://train-scheduler-243f2.firebaseio.com",
    storageBucket: "train-scheduler-243f2.appspot.com",
    messagingSenderId: "202317134324"
  };
  firebase.initializeApp(config);
  //handshake with firebase
  var database = firebase.database();
  //default values for global vars
  var trainName = "";
  var destination = "";
  var trainTime = "";
  var frequency = 0;
  //when the submit button is clicked
  $('#add-train').on("click", function(event){
    event.preventDefault();
    //store form input values as strings to global variables
    trainName = $('#train-name').val().trim();
    destination = $('#destination-input').val().trim();
    trainTime = $('#time-input').val().trim();
    frequency = $('#frequency-input').val().trim();
    //send variable values to firebase
    database.ref('/trains').push({
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

//if a child has been added, write train statistics to the table
database.ref('/trains').on("child_added", function(childSnapshot){
  //local variable to manipulate with moment.js
  var train = childSnapshot.val().trainName;
  var dest = childSnapshot.val().destination;
  var time = childSnapshot.val().trainTime;
  var freq = childSnapshot.val().frequency;
  var currentTime = moment().format("HH:mm");
  //convert time to ensure that the first train time has happened in the past
  var convertedTime = moment(time, "HH:mm").subtract(1, "years");
  //determine difference in time in ms
  var diffTime = moment().diff(moment(convertedTime), "minutes");
  //determine how far apart in time
  var remainder = diffTime % freq;
  //determine how many minutes until the next arrival
  var minutesUntilArrival = freq - remainder;
  var nextTrain = moment().add(minutesUntilArrival, "minutes");
  //determine the arrival time of the next train
  var arrival = moment(nextTrain).format("HH:mm");
  //write all this data to the table
  $('#trains').append("<tr><td>" + train + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + arrival + "</td><td>" + minutesUntilArrival + "</td>");
 
  });
});