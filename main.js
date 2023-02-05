var players = [];
var game = {};
var board = {};
var units = [];
var sidePanel = {};

initialization();

var $board = $( '#board' );
var $cells = $( '.cell' );
var $units = $( '.unit' );
var $end = $( '#end' );

// $board.click( onBoardClick );
$cells.click( onCellClick );
$units.click( onUnitClick );
$end.click( onEndClick );

// можно ли вначале расположить лишь описание функций?
// вначале статические методы?
// static getUnitById ?
// использование внешних классов (боард) в классе (юнит) - нормальная практика?
// использование внешних переменных (массива юнитов) - нормальная практика?

// к какому объекту можно отнести глобальную переменную var units = []; ? 
// может Unit.units (static units = [];) ?

// isPartlyMoved() - exist? - doesPartlyMovedUnitExist() - is? - isPartlyMovedUnitExist()



class Unit {
    constructor( id, type, name, isCurrent ) {        
        this.id = id;
        this.type = type;
        this.name = name;
        this.name = isCurrent;

        Unit.units.push( this );
        
            // this.showCellsAvailable = function () {
            //     return ('Hi' + ' ' + this.name);
            // };
    }

    static units = [];

    static getUnitById( unitId ) {
        for ( let unit of Unit.units ) {
            if ( unit.id == unitId ) {
                return unit;
            }
        }
    }

    static getUnitByElement( $unit ) {   
        for ( let unit of units ) {
            if ( ( 'hero-' + unit.id ) == $unit.attr( 'id' ) ) {
                return unit;
            }
        }
    }

    showAvailableCells() { // !NOT showCellsAvailable
        this.pathMap = []; // just pathMap !!! ???
    
        for ( let x = 0; x < board.columns; x++ ) {          
            unit.pathMap[ x ] = [];        
            for ( let y = 0; y < board.rows; y++ ) {       
                unit.pathMap[ x ][ y ] = -1;
            }
        }
    }
}

// let unit = Unit.getUnitById( 1 );
// let unit = new Unit(0, 'hero', 'mage', false );
// unit.showAvailableCells();