
var elem0 = document.getElementsByClassName('instructions');
var elem1 = document.getElementsByClassName('how');
var elem2 = document.getElementsByClassName('what');
var elem3 = document.getElementById('play');
var elem4 = document.getElementById('next');


Intro = {
	observingInstructions: true,
	watching: "how"
}

var start = document.getElementsByClassName('')

var showInstructions = function() {
	elem0[0].style.display = "inline";
	Intro.observingInstructions = true;
}

var nextInstructions = function() {
	if (Intro.watching == "how") {
		elem1[0].style.display = "none";
		elem2[0].style.display = "inline"; // inline is default
		Intro.watching = "what";
	} else {
		elem1[0].style.display = "inline";
		elem2[0].style.display = "none"; // inline is default
		Intro.watching = "how";
	}
}

var hideInstructions = function() {
	elem0[0].style.display = "none";
	Intro.observingInstructions = false;
}

elem3.addEventListener('click', hideInstructions, false);
elem4.addEventListener('click', nextInstructions, false);

