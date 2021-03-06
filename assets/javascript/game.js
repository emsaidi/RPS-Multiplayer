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
var p2Wins = 0;
var Ties = 0;

var P1;
var P2;

var guessP1;
var guessP2;

var P1chatInput;
var P2chatInput;

var PlayerNum = 0;
var PlayerNum = 0;


//At the initial load, get a snapshot of the current data.
database.ref().on("value", function (snapshot){

	// If Firebase has Player 1 already set
	if (snapshot.child('Player1/name').exists()){

		P1 = snapshot.val().Player1.name;
		
		// Changet the HTML to reflect the initial value
		$('#playerName1').html(P1);
		$('#p1ScorecardName').html(P1);

		// Print the initial data to console
		console.log("Player 1 set: " + P1);

		

	}
	
	// No store values, so values should be empty
	if (snapshot.child("Player2/name").exists()) {
		P2 = snapshot.val().Player2.name;

		$('#playerName2').html(P2);
		$('#p2ScorecardName').html(P2);

		console.log("Player 2 set: " + P2)

		

	}
// If any errors are experienced, log them to the console
}, function(errorObject) {

	console.log("The read failed: " + errorObject.code);

}
);

// Whenever the user cliks the Start button
$('#btnName').on("click", function (){

	//If no Player1 or Player2 exists 
	if(typeof P1 === "undefined"){

		//add inputed name to P1
		P1 = $('#inputName').val().trim();
	    database.ref('Player1').child('name').set(P1);
	    database.ref().child('Player1').onDisconnect().remove();

	    PlayerNum = 1;

	    $('#inputName').val("");



	}else if (typeof P2 === "undefined"){

		//The name inputed will be added to the system will be added to P2.
		P2 = $('#inputName').val().trim();
		database.ref('Player2').child('name').set(P2);
		database.ref().child('Player2').onDisconnect().remove();

		PlayerNum = 2;

		$('#inputName').val("");

	}else if(P2){
		$('#btnName').off();

	}

	return false;
});

$("#inputName").keypress(function(event) {
    if (event.which == 13) {
    	if(typeof P1 === "undefined"){

			//add inputed name to P1
			P1 = $('#inputName').val().trim();
	   		database.ref('Player1').child('name').set(P1);
	    	database.ref().child('Player1').onDisconnect().remove();

	   		PlayerNum = 1;



		}else if (typeof P2 === "undefined"){

			//The name inputed will be added to the system will be added to P2.
			P2 = $('#inputName').val().trim();
			database.ref('Player2').child('name').set(P2);
			database.ref().child('Player2').onDisconnect().remove();
			
			PlayerNum = 2;

		}else if(P2){

			$('#btnName').off();

		}

		return false;
    }
});


database.ref().on("value", function (snapshot){
	if (snapshot.child('Player1').exists()){
	guessP1 = snapshot.val().Player1.guessP1;
	}
	 

	if (snapshot.child('Player2').exists()){
	 guessP2 = snapshot.val().Player2.guessP2;
	}

	runRPS();
	console.log("runRPS ran inside of the on value");

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
	$('#p1BlockSelection').html('<button class="btn btn-secondary btn-selection" data-selectionP1="p" id="paperP2"><img src="' + guessP1imgURL + '" class="img-fluid img-rounded" alt="paper"></button>');	
	
	

});

$('#p2Block').on('click', 'button', function(){
		guessP2 = $(this).attr('data-selectionP2');
		console.log(guessP2);

		var guessP2imgURL = $(this).attr('data-imgURL');
		console.log(guessP2imgURL);

		database.ref('Player2').child('guessP2').set(guessP2);

		$('#p2Block').hide();
		$('#p2BlockSelection').html('<button class="btn btn-secondary btn-selection"><img src="' + guessP2imgURL + '" class="img-fluid img-rounded" alt="paper"></button>');
	
	});


function runRPS(){
	console.log('Running RPS guessP1: ' + guessP1 + ' guessP2: ' + guessP2);

	if (guessP1 && guessP2){

		if ((guessP1 == 'r') && (guessP2 == 's')){
			p1Wins++;
			P1Wins();
		}else if ((guessP1 == 'r') && (guessP2 == 'p')){
			p2Wins++;
			P2Wins();
		}else if ((guessP1 == 's') && (guessP2 == 'r')){
			p2Wins++;
			P2Wins();
		}else if ((guessP1 == 's') && (guessP2 == 'p')){
			p1Wins++;
			P1Wins();
		}else if((guessP1 == 'p') && (guessP2 == 'r')){
			p1Wins++;
			P1Wins();
		}else if((guessP1 == 'p') && (guessP2 == 's')){
			p2Wins++;
			P2Wins();
		}else if(guessP1 == guessP2){
			Ties++;
			YouTie();
		}

		$('#p1WinsScorecard').html(p1Wins);

		$('#p2WinsScorecard').html(p2Wins);

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
	$('<div>').html('<h4 class="card-title">' + P1 + ' WINS!!!!</h4><img class="img-thumbnail" src="assets/images/trophy.png" alt="trophy">').appendTo('#ScoreboardAnnouncer');
}

function P2Wins(){
	$('<div>').html('<h4 class="card-title">' + P2 + ' WINS!!!!</h3><img class="img-thumbnail" src="assets/images/trophy.png" alt="trophy">').appendTo('#ScoreboardAnnouncer');
}

function YouTie(){
	$('<div>').html('<h4 class="card-title">You Tie!</h3><img class="img-thumbnail" src="assets/images/Tie.png" alt="trophy">').appendTo('#ScoreboardAnnouncer');
}

$('#chatBtn').on('click', function (){
	console.log("Chat button was pushed");

	if (PlayerNum === 1){
		P1chatInput = $('#chatInput').val();
		var chatLine = {line: P1chatInput};
		database.ref().child('Player1/chat').push(chatLine);
		
		console.log("Player 1 typed and said: " + chatLine);

		$('#chatInput').val("");

	}else if (PlayerNum ===2){
		P2chatInput = $('#chatInput').val();
		var chatLine = {line: P2chatInput};
		database.ref().child('Player2/chat').push(chatLine);
		$('#chatInput').val("");
		console.log("Player 2 typed and said: " + chatLine);

	}

	return false;

});

$("#chatInput").keypress(function(event) {
    if (event.which == 13) {

    	if (PlayerNum === 1){
			P1chatInput = $('#chatInput').val();
			var chatLine = {line: P1chatInput};
			database.ref().child('Player1/chat').push(chatLine);
		
			console.log("Player 1 typed and said: " + chatLine);

			$('#chatInput').val("");

		}else if (PlayerNum ===2){
			P2chatInput = $('#chatInput').val();
			var chatLine = {line: P2chatInput};
			database.ref().child('Player2/chat').push(chatLine);
			$('#chatInput').val("");
			console.log("Player 2 typed and said: " + chatLine);

		}

		return false;

    }
});

database.ref("Player1").child("chat").on("child_added", function (childSnapshot){
 	
 	var chatObject = childSnapshot.val().line;

 	console.log("this is chat object from db: " + chatObject)
	
	$('#chatText').append('<p class="card-text">' + P1 + ": " + chatObject + '</p>');

	
});

database.ref('Player2').child("chat").on("child_added", function (childSnapshot){
 
	var chatObject = childSnapshot.val().line;

 	console.log("this is chat object from db: " + chatObject)
	
	$('#chatText').append('<p class="card-text">' + P2 + ": " + chatObject + '</p>');
});

// $('<p>').html(P2chatInput).appendTo('#chatText');
