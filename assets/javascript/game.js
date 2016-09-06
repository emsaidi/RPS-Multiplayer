  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAnP96C4pRrqEGJA-GxmQYr2pJaFb9lYfU",
    authDomain: "alpha-30479.firebaseapp.com",
    databaseURL: "https://alpha-30479.firebaseio.com",
    storageBucket: "alpha-30479.appspot.com",
  };
  firebase.initializeApp(config);

// Variable to reference the database
var database = firebase.database().ref('rpsGame');

//Initial Values
var p1Wins = 0;
var p1Losses = 0;

var Ties = 0;

var p2Wins = 0;
var p2Losses = 0;

var P1 = "";
var P2 = "";

var guessP1;
var guessP2;

//At the initial load, get a snapshot of the current data.
database.on("value", function(snapshot){

	//If Firebase  has both players already set
	if (snapshot.child("Player1").exists() && snapshot.child("Player2").exists()) {

		// Set the initial variables for Players equal to stored values
		P1 = snapshot.val().Player1;
		P2 = snapshot.val().Player2;

		// Change HTML to reflect the initial value
		$('#playerName1').html(P1);
		$('#playerName2').html(P2);

		// Print the initial data to the console
		console.log("Player 1 Initial Value = " + P1 + " Player 2 Initial Value" + P2);

	// If Firebase has Player 1 already set
	}else if (snapshot.child("Player1").exists()){

		//Set the initial value of Player 1 equal to the store value
		P1 = snapshot.val().Player1;

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
	}else if(P2){
		$('#btnName').off();

	}

	//Print the new player names
	console.log("Player1: " + P1 + " Player2: " + P2);

	//Save the new names in Firebase
	database.set({
		Player1: P1,
		Player2: P2
	});

	console.log("P1: " + P1 + " P2 " + P2);

	return false;
});

$("#rockP1").on('click', function(){
	guessP1 = $(this).attr('data-selectionP1');
	console.log(guessP1);
	$('#p1Block').hide();
	$('#p1BlockSelection').html('<button class="btn btn-secondary btn-selection" data-selectionP1="r" id="rockP1"><img src="assets/images/rock.png" class="img-thumbnail" alt="rock"></button>');
});

$("#paperP1").on('click', function(){
	guessP1 = $(this).attr('data-selectionP1');
	console.log(guessP1);
	$('#p1Block').hide();
	$('#p1BlockSelection').html('<button class="btn btn-secondary btn-selection" data-selectionP1="p" id="paperP1"><img src="assets/images/paper.png" class="img-thumbnail" alt="paper"></button>');
	
});

$("#scissorsP1").on('click', function(){
	guessP1 = $(this).attr('data-selectionP1');
	console.log(guessP1);
	$('#p1Block').hide();
	$('#p1BlockSelection').html('<button class="btn btn-secondary btn-selection" data-selectionP1="s" id="scissorsP1"><img src="assets/images/scissors.png" class="img-thumbnail" alt="rock"></button>');

});

$("#rockP2").on('click', function(){
	guessP2 = $(this).attr('data-selectionP2');
	console.log(guessP2);
	$('#p2Block').hide();
	$('#p2BlockSelection').html('<button class="btn btn-secondary btn-selection" data-selectionP2="r" id="rockP2"><img src="assets/images/rock.png" class="img-thumbnail" alt="rock"></button>');
	runRPS();
});

$("#paperP2").on('click', function(){
	guessP2 = $(this).attr('data-selectionP2');
	console.log(guessP2);
	$('#p2Block').hide();
	$('#p2BlockSelection').html('<button class="btn btn-secondary btn-selection" data-selectionP2="p" id="paperP2"><img src="assets/images/paper.png" class="img-thumbnail" alt="paper"></button>');
	runRPS();
});

$("#scissorsP2").on('click', function(){
	guessP2 = $(this).attr('data-selectionP2');
	console.log(guessP1);
	$('#p2Block').hide();
	$('#p2BlockSelection').html('<button class="btn btn-secondary btn-selection" data-selectionP2="s" id="scissorsP2"><img src="assets/images/scissors.png" class="img-thumbnail" alt="rock"></button>');
	runRPS();
});

function runRPS(){
	if (((guessP1 == 'r') || (guessP1 == 'p') || (guessP1 == 's')) && ((guessP2 == 'r') || (guessP2 == 'p') || (guessP2 == 's'))){

		if ((guessP1 == 'r') && (guessP2 == 's')){
			p1Wins++;
			p2Losses++;

		}else if ((guessP1 == 'r') && (guessP2 == 'p')){
			p1Losses++;
			p2Wins++;
		}else if ((guessP1 == 's') && (guessP2 == 'r')){
			p1Losses++;
			p2Wins++;
		}else if ((guessP1 == 's') && (guessP2 == 'p')){
			p1Wins++;
			p2Losses++;
		}else if((guessP1 == 'p') && (guessP2 == 'r')){
			p1Wins++;
			p2Losses++;
		}else if((guessP1 == 'p') && (guessP2 == 's')){
			p1Losses++;
			p2Wins++;
		}else if(guessP1 == guessP2){
			Ties++;
		}

		console.log("P1Wins: " + p1Wins + " P1Losses: " + p1Losses + " Ties: " + Ties + " P2Wins: " + p2Wins + " P2Losses: " + p2Losses);

		database.set({
			Player1Wins: p1Wins,
			Player1Losses: p1Losses,
			Ties: Ties,
			Player2Wins: p2Wins,
			Player2Losses: p2Losses,
		});

		$('#p1Block').show();
		$('#p1BlockSelection').empty();

		$('#p2Block').show();
		$('#p2BlockSelection').empty();

		

	}
}




// we still need guessP1 and guessP2

//player 1 picks button, this becomes his selection in database
//player 2 picks button, this becomes his select in database
//we retrive selection and run logic on it
// wins, losses, ties are added
// this then are pushed back into database
// from database are added to html