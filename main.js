const NUMBER_OF_HEROES_IN_ROW = 4;
const NUMBER_OF_HEROES_IN_COLUMN = 3;
const NUMBER_OF_CELLS_BETWEEN_HEROES = 5;
const BOARD_SIZE_X = ( NUMBER_OF_HEROES_IN_ROW - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_ROW;
const BOARD_SIZE_Y = ( NUMBER_OF_HEROES_IN_COLUMN - 1 ) * NUMBER_OF_CELLS_BETWEEN_HEROES + NUMBER_OF_HEROES_IN_COLUMN;

var skillsLibrary = [];
var unitsLibrary = [];
var units = [];
var cells = [];

initSkillsLibrary();
initUnitsLibrary();
initUnits();
initBoard();

var $cells = $( '.cell' );
var $units = $( '.hero' );
var choosenCellId = null;
var choosenUnitId = null;
var isSelectionBlocked = false;
var pathMap = [];

$cells.click( onCellClick );
$units.click( onUnitClick );

// initEvents();
// $hero.mouseenter( onHeroMouseenter );
// $hero.mouseleave( onHeroMouseleave );
// $( '.cell' ).click( onCellClick );
// $( '#end-turn' ).click( onEndTurnClick ); 
// $( window ).resize( onWindowResize );