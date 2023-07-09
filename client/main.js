
const SERVER_URL = 'http://localhost:3002';

async function requestGameData() {

	const response = await fetch( SERVER_URL + '/library' );
	const gameData = await response.json();

	// console.log( gameData );
	let actions = Action.createActions( gameData.actions );

	Unit.createUnits( gameData, actions );
}

requestGameData();

Game.createGame();
Cell.createCells();

