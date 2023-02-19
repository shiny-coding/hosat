let gameDataJson = $( 'meta[name="game-data-json"]' ).attr( 'content' );
let gameData = JSON.parse( decodeHtml( gameDataJson ) );
var game = new Game( gameData );