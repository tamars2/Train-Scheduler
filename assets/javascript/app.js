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

  $('#add-train').on("click", function(event){
    event.preventDefault();
    trainName = $('#train-name').val().trim();
    destination = $('#destination-input').val().trim();
    trainTime = $('#time-input').val().trim();
    frequency = $('#frequency-input').val().trim();
    //store var values to firebase
    database.ref('/trains').push({
      trainName: trainName,
      destination: destination,
      trainTime: trainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });


database.ref('/trains').on("child_added", function(childSnapshot){
  var train = childSnapshot.val().trainName;
  var dest = childSnapshot.val().destination;
  var time = childSnapshot.val().trainTime;
  var freq = childSnapshot.val().frequency;
  var dateAdded = childSnapshot.val().dateAdded;
  var currentTime = moment();
  var timeConversion = moment(time, "hh:mm").subtract(1, "years");
  
  var diffTime = moment().diff(moment(timeConversion), "minutes");
  var remainder = diffTime % freq;
  var minutesRemaining = freq - remainder;
  var nextTrainTime = moment().add(minutesRemaining, "minutes");
  //next arrival = first time + frequency

  $('#trains').append("<tr><td>" + train + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + nextTrainTime + "</td><td>" + minutesRemaining + "</td>");
 
});
});