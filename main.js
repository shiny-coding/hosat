var board = {};
var units = [];
// var heroes = []; 
// var summons = [];

var gameDataJson = $('meta[name="game-data-json"]').attr('content');
var gameData = JSON.parse( decodeHtml( gameDataJson ) );

// heroes = getHeroes( gameData );
// summons = getSummons( gameData );
// units = setUnits( heroes );

initBoard();
initHeroes( gameData );

// const NUMBER_OF_HEROES_IN_ROW = 4;
// const NUMBER_OF_HEROES_IN_COLUMN = 3;
// const NUMBER_OF_CELLS_BETWEEN_HEROES = 4;
// const BOARD_SIZE_X = ( NUMBER_OF_HEROES_IN_ROW - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_ROW;
// const BOARD_SIZE_Y = ( NUMBER_OF_HEROES_IN_COLUMN - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_COLUMN;
// const NUMBER_OF_HEROES = NUMBER_OF_HEROES_IN_ROW * NUMBER_OF_HEROES_IN_COLUMN;

// var skillsLibrary = [];
// var unitsLibrary = [];

// var cells = [];

// initSkillsLibrary();
// initUnitsLibrary();
// initUnits();
// // initBoard();
// initTeamChoose();

var $cells = $( '.cell' );
var $units = $( '.hero' );
var choosenCellId = null;
var choosenUnitId = null;
var isSelectionBlocked = false;
var pathMap = [];
var battleFase = false;
var turnCount = 1;

var player1 = {
    name: 'Player 1',
    color: undefined,
    team: undefined,
    current: false
};
var player2 = {
    name: 'Player 2',
    color: undefined,
    team: undefined,
    current: false
};

$cells.click( onCellClick );
$units.click( onUnitClick );
$( '#end-turn' ).click( onEndTurnClick ); 