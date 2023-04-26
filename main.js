let gameDataJson = $( 'meta[name="game-data-json"]' ).attr( 'content' );
let gameData = JSON.parse( decodeHtml( gameDataJson ) );

Game.createGame();
Cell.createCells();
Unit.createUnits( gameData );