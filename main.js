var players = [];
var game = {};
var board = {};
var units = [];
var sidePanel = {};

initialization();

var $cells = $( '.cell' );
var $units = $( '.unit' );
var $endTurnButton = $( '#end-turn-button' );

$cells.click( onCellClick );
$units.click( onUnitClick );
$endTurnButton.click( onEndTurnClick );