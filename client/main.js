
const SERVER_URL = 'http://localhost:3002';

async function requestGameData() {

	const response = await fetch( SERVER_URL + '/library' );
	const gameData = await response.json();

	// console.log( gameData );
	let actions = Action.createActions( gameData.actions );

	Unit.createUnits( gameData, actions );
}

$( window ).resize( function() {
	Cell.resizeCells();
	Unit.resizeUnits();
} );

requestGameData();

Game.createGame();
Cell.createCells();

console.log( 'window.innerHeight ' + window.innerHeight );
console.log( 'document.body.clientHeight ' + document.body.clientHeight );