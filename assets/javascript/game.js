// Initialize Firebase
var config = {
	apiKey: "AIzaSyAnP96C4pRrqEGJA-GxmQYr2pJaFb9lYfU",
	authDomain: "alpha-30479.firebaseapp.com",
	databaseURL: "https://alpha-30479.firebaseio.com",
	storageBucket: "alpha-30479.appspot.com",
};

firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database();

//Initial Values
var p1Wins = 0;
var p1Losses = 0;

var Ties = 0;

var p2Wins = 0;
var p2Losses = 0;

var P1 = "";
var P2 = "";

var guessP1 = "";
var guessP2 = "";


//At the initial load, get a snapshot of the current data.
database.ref().on("value", function (snapshot){

	//If Firebase  has both players already set
	if (snapshot.child("Player1/name").exists() && snapshot.child("Player2/name").exists()) {

		// Set the initial variables for Players equal to stored values
		P1 = snapshot.child('Player1/name');
		P2 = snapshot.child('Player2/name');

		// Change HTML to reflect the initial value
		$('#playerName1').html(P1);
		$('#playerName2').html(P2);

		// Print the initial data to the console
		console.log("Player 1 Initial Value = " + P1 + " Player 2 Initial Value" + P2);

	// If Firebase has Player 1 already set
	}else if (snapshot.child("Player1/name").exists()){

		P1 = snapshot.child('Player1/name');
		
		// Changet the HTML to reflect the initial value
		$('#playerName1').html(P1);
		$('#playerName2').html(P2);

		// Print the initial data to console
		console.log("Player 1 Iinitial Value = " + P1 + " Player 2 should be empty");
	
	// No store values, so values should be empty
	}else {
		$('#playerName1').html(P1);
		$('#playerName2').html(P2);

		console.log("Both Players should be empty")
	}
// If any errors are experienced, log them to the console
}, function(errorObject) {

	console.log("The read failed: " + errorObject.code);

}
);

// Whenever the user cliks the Start button
$('#btnName').on("click", function(){

	// If Player1 already exists in database
	if (P1){

		//The name inputed will be added to the system will be added to P2.
		P2 = $('#inputName').val().trim();

	//If no Player1 or Player2 exists 
	}else if(P1 != null){

		//add inputed name to P1
		P1 = $('#inputName').val().trim();
	// is not working!!!!! - talk to TAs
	}

	//else if(P2){
		//$('#btnName').off();

	//}

	//Print the new player names
	console.log('Player1: ' + P1 + ' Player2: ' + P2);

	//Save the new names in Firebase
	database.ref('Player1').child('name').set(P1);
	database.ref('Player2').child('name').set(P2);

	console.log(" Names have been sent to the database. P1: " + P1 + " P2 " + P2);

	return false;
});

database.ref().on("value", function (snapshot){

	if (snapshot.child('Player1/guessP1').exists() && snapshot.child('Player2/guessP2').exists()){
			runRPS();
			console.log("runRPS ran");
		}else{
			console.log("A selection is needed");
		}
}, function(errorObject) {

	console.log("The read failed: " + errorObject.code);

});

$('#p1Block').on('click', 'button', function(){
	guessP1 = $(this).attr('data-selectionP1');
	console.log(guessP1);

	var guessP1imgURL = $(this).attr('data-imgURL');		
	console.log(guessP1imgURL);

	database.ref('Player1').child('guessP1').set(guessP1);

	$('#p1Block').hide();
	$('#p1BlockSelection').html('<button class="btn btn-secondary btn-selection" data-selectionP1="p" id="paperP2"><img src="' + guessP1imgURL + '" class="img-thumbnail" alt="paper"></button>');	
	
	

});

$('#p2Block').on('click', 'button', function(){
		guessP2 = $(this).attr('data-selectionP2');
		console.log(guessP2);

		var guessP2imgURL = $(this).attr('data-imgURL');
		console.log(guessP2imgURL);

		database.ref('Player2').child('guessP2').set(guessP2);



		$('#p2Block').hide();
		$('#p2BlockSelection').html('<button class="btn btn-secondary btn-selection"><img src="' + guessP2imgURL + '" class="img-thumbnail" alt="paper"></button>');
	
	});


function runRPS(){
	console.log('Running RPS guessP1: ' + guessP1 + ' guessP2: ' + guessP2);

	if (guessP1 && guessP2){

		if ((guessP1 == 'r') && (guessP2 == 's')){
			p1Wins++;
			p2Losses++;

		}else if ((guessP1 == 'r') && (guessP2 == 'p')){
			p1Losses++;
			p2Wins++;
			P2Wins();
		}else if ((guessP1 == 's') && (guessP2 == 'r')){
			p1Losses++;
			p2Wins++;
			P2Wins();
		}else if ((guessP1 == 's') && (guessP2 == 'p')){
			p1Wins++;
			p2Losses++;
			P1Wins();
		}else if((guessP1 == 'p') && (guessP2 == 'r')){
			p1Wins++;
			p2Losses++;
			P1Wins();
		}else if((guessP1 == 'p') && (guessP2 == 's')){
			p1Losses++;
			p2Wins++;
			P2Wins();
		}else if(guessP1 == guessP2){
			Ties++;
			YouTie();
		}

		console.log("P1Wins: " + p1Wins + " P1Losses: " + p1Losses + " Ties: " + Ties + " P2Wins: " + p2Wins + " P2Losses: " + p2Losses);

		database.ref().child('Player1').set({
			Player1Wins: p1Wins,
			Player1Losses: p1Losses
		});

		database.ref().child('Player2').set({
			Player2Wins: p2Wins,
			Player2Losses: p2Losses

		});



		setTimeout(function() {
			$('#p1Block').show();
			$('#p1BlockSelection').empty();

			$('#p2Block').show();
			$('#p2BlockSelection').empty();

			$('#ScoreboardAnnouncer').empty();
			console.log("Divs should be back to normal");

			database.ref().child('Player1/guessP1').set(null);
			database.ref().child('Player2/guessP2').set(null);

		}, 3000);

	}else{
		console.log("Something went wrong and RPS is not running");
	}
}

function P1Wins(){
	$('<div>').html('<h4 class="card-title">' + P1 + ' WINS!!!!</h4><img class="img-thumbnail" src="assets/images/social_01.jpg" alt="trophy">').appendTo('#ScoreboardAnnouncer');
}

function P2Wins(){
	$('<div>').html('<h4 class="card-title">' + P2 + ' WINS!!!!</h3><img class="img-thumbnail" src="assets/images/social_01.jpg" alt="trophy">').appendTo('#ScoreboardAnnouncer');
}

function YouTie(){
	$('<div>').html('<h4 class="card-title">You Tie!</h3><img class="img-thumbnail" src="assets/images/Blue_Stripe_Tie.jpg" alt="trophy">').appendTo('#ScoreboardAnnouncer');
}


// we still need guessP1 and guessP2

//player 1 picks button, this becomes his selection in database
//player 2 picks button, this becomes his select in database
//we retrive selection and run logic on it
// wins, losses, ties are added
// this then are pushed back into database
// from database are added to html