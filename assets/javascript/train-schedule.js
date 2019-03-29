 "use strict;"

 // Initialize Firebase
 var config = {
   apiKey: "AIzaSyAm2RSNolPA0-tTI2r6TgdzDjm-WOZzFcg",
   authDomain: "scheduler-b013c.firebaseapp.com",
   databaseURL: "https://scheduler-b013c.firebaseio.com",
   projectId: "scheduler-b013c",
   storageBucket: "scheduler-b013c.appspot.com",
   messagingSenderId: "880747413210"
 };
 firebase.initializeApp(config);

 var database = firebase.database();

 $("#add-train-btn").on("click", function (event) {
   event.preventDefault();

   // Grab user input
   var trainName = $("#train-name-input").val().trim();
   var destination = $("#destination-input").val().trim();
   var firstTrain = $("#first-train-input").val().trim();
   var frequency = $("#frequency-input").val().trim();

   console.log("trainName: " + trainName);
   console.log("destination: " + destination);
   console.log("firstTrain: " + firstTrain);
   console.log("frequency: " + frequency);

   // Creates local "temporary" object for holding train data
   var newTrain = {
     trainName: trainName,
     destination: destination,
     firstTrain: firstTrain,
     frequency: frequency
   };

   // Logs everything to console
   console.log("newTrain.trainName: " + newTrain.trainName);
   console.log("newTrain.destination: " + newTrain.destination);
   console.log("newTrain.firstTrain: " + newTrain.firstTrain);
   console.log("newTrain.frequency: " + newTrain.frequency);

   // Upload train data to the database
   database.ref().push(newTrain);

   alert("Train successfully added");

   // Clears all of the text-boxes
   $("#train-name-input").val("");
   $("#destination-input").val("");
   $("#first-train-input").val("");
   $("#frequency-input").val("");
 });

 // Create Firebase event for adding newTrain to the database and a row in the html when a user adds an entry
 database.ref().on("child_added", function (childSnapshot) {
   console.log(childSnapshot.val());

   // Store everything into a variable.
   var trainName = childSnapshot.val().trainName;
   var destination = childSnapshot.val().destination;
   var firstTrain = childSnapshot.val().firstTrain;
   var frequency = childSnapshot.val().frequency;

   // Employee Info
   console.log(trainName);
   console.log(destination);
   console.log(firstTrain);
   console.log(frequency);

   // calculate next time & minutes away
   var nextTrain = firstTrain;
   var minutesAway = firstTrain;

   // Create the new row

   var newRow = $("<tr>").append(
     $("<td>").text(trainName),
     $("<td>").text(destination),
     $("<td>").text(frequency),
     $("<td>").text(nextTrain),
     $("<td>").text(minutesAway)
   );

   // Append the new row to the table
   $("#train-table > tbody").append(newRow);
 });