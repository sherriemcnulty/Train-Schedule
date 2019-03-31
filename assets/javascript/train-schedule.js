 "use strict;"

 // Global variable used to refresh display every 60 sec
 var intervalID = -1;

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

 // CLICK EVENT: Grab input & store in database

 $("#add-train-btn").on("click", function (event) {
   event.preventDefault();

   // Grab user input
   var trainName = $("#train-name-input").val().trim();
   var destination = $("#destination-input").val().trim();
   var firstTime = $("#first-input").val().trim();
   var frequency = $("#frequency-input").val().trim();

   // Create local "temporary" object for holding train data
   var newTrain = {
     trainName: trainName,
     destination: destination,
     firstTime: firstTime,
     frequency: frequency
   };

   // Upload train data to the database
   database.ref().push(newTrain);

   alert("Train successfully added");

   // Clear all of the input text-boxes
   $("#train-name-input").val("");
   $("#destination-input").val("");
   $("#first-input").val("");
   $("#frequency-input").val("");
 });

 // FIREBASE EVENT: When new train info is submitted, 
 // get a snapshot and add it to the table

 database.ref().on("child_added", function (childSnapshot) {

   // Store everything into a variable.
   var tTrain = childSnapshot.val().trainName;
   var tFirstTime = childSnapshot.val().firstTime;
   var tDestination = childSnapshot.val().destination;
   var tFrequency = childSnapshot.val().frequency;

   // Get current time
   var currentTime = moment();


   // Push first time back 1 year to make sure it comes before current time
   var firstTimeConverted = moment(tFirstTime, "HH:mm").subtract(1, "years");

   // Difference between the times
   var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

   // Time apart
   var tRemainder = diffTime % tFrequency;

   // Minute(s) until the next train
   var tMinutesTillTrain = tFrequency - tRemainder;

   // Next Train
   var nextTrain = moment().add(tMinutesTillTrain, "minutes");

   // Create the new row
   var newRow = $("<tr>").append(
     $('<td scope="col">').text(tTrain),
     $('<td scope="col">').text(tDestination),
     $('<td scope="col">').text(tFrequency),
     $('<td scope="col">').text(moment(nextTrain).format("LT")),
     $('<td scope="col">').text(tMinutesTillTrain)
   );

   // Append the new row to the table
   $("#train-table > tbody").append(newRow);

   // refresh the screen every minute
   intervalID = setInterval(refresh, 60000);
 });

 // Function to refresh the display
 function refresh() {

   clearInterval(intervalID);
   location.reload();
 }