var gameDataJson = $('meta[name="game-data-json"]').attr('content');
var gameData = JSON.parse( decodeHtml( gameDataJson ) );



var players = [];
var game = {};
var board = {};
// var units = [];
var sidePanel = {};

/*
initialization();

var $board = $( '#board' );
var $cells = $( '.cell' );
var $units = $( '.unit' );
var $end = $( '#end' );
*/

// $board.click( onBoardClick );

/*
$cells.click( onCellClick );
$units.click( onUnitClick );
$end.click( onEndClick );
*/

// isPartlyMoved() - ? - isPartlyMovedUnitExist()

class Unit {
    constructor( apCurrent, apDefault, damageCurrent, damageDefault, hpCurrent, hpDefault, id, imageFileName, name, type ) {  
        this.apCurrent = apCurrent;   
        this.apDefault = apDefault;    
        this.damageCurrent = damageCurrent;   
        this.damageDefault = damageDefault; 
        this.hpCurrent = hpCurrent;  
        this.hpDefault = hpDefault;  
        this.id = id;
        this.imageFileName = imageFileName;
        this.indexes = {};
        this.isCurrent = false;
        this.isLastSelected = false; //TODO ???
        this.isMoved = false;
        this.isPartlyMoved = false;
        this.movePath = undefined;
        this.name = name;
        this.pathMap = [];
        this.team = undefined;
        this.type = type;
        this.$element = undefined;
        Unit.units.push( this );
    }

    static units = [];

    // static getUnitById( unitId ) {
    //     for ( let unit of Unit.units ) {
    //         if ( unit.id == unitId ) {
    //             return unit;
    //         }
    //     }
    // }

    static getUnitByElement( $unit ) {   
        for ( let unit of Unit.units ) {
            if ( ( 'hero-' + unit.id ) == $unit.attr( 'id' ) ) {
                return unit;
            }
        }
    }

    showAvailableCells() {        
        for ( let x = 0; x < board.columns; x++ ) {          
            this.pathMap[ x ] = [];        
            for ( let y = 0; y < board.rows; y++ ) {       
                this.pathMap[ x ][ y ] = -1;
            }
        }
    
        for ( let iteratedUnit of Unit.units ) {
            this.pathMap[ iteratedUnit.indexes.x ][ iteratedUnit.indexes.y ] = -2; 
        }
    
        this.pathMap[ this.indexes.x ][ this.indexes.y ] = 0;
    
        for ( let i = 1; i <= this.apCurrent; i++ ) {
            for ( let x = 0; x < board.columns; x++ ) {
                for ( let y = 0; y < board.rows; y++ ) {
    
                    if ( this.pathMap[ x ][ y ] == i - 1 ) {
                        for ( let x2 = x-1; x2 <= x+1; x2++ ) {   
                            for ( let y2 = y-1; y2 <= y+1; y2++ ) {
    
                                if (    x2 >= 0 && x2 < board.columns &&
                                        y2 >= 0 && y2 < board.rows &&                                 
                                        Math.abs( x - x2 ) + Math.abs( y - y2 ) <= 1 &&
                                        this.pathMap[ x2 ][ y2 ] == -1   ) {    
                                    
                                    this.pathMap[ x2 ][ y2 ] = i;                               
                                }
                            }
                        }
                    }
                }
            }
        }
    
        for ( let row = 0; row < board.rows; row++ ) {        
            for ( let column = 0; column < board.columns; column++ ) {
                if ( this.pathMap[ board.cells[ column ][ row ].indexes.x ][ board.cells[ column ][ row ].indexes.y ] > 0 ) {
                    board.cells[ column ][ row ].isAvailable = true; 
                    board.cells[ column ][ row ].$element.addClass( 'available-cell' );            
                }
            }
        }
    }

    drawMovePath( $cell ) {
        let cellIindexes = getCellByElement( $cell ).indexes;
        let unitIndexes = this.indexes;
        let preferHorizontalMovement = Math.abs( cellIindexes.x - unitIndexes.x ) < Math.abs( cellIindexes.y - unitIndexes.y );
        let current = cellIindexes; //TODO remove current ???
        let distance = this.pathMap[ cellIindexes.x ][ cellIindexes.y ];    
        let currentDistance = distance; //TODO ???
        let movePath = [];
    
        while ( current.x != unitIndexes.x || current.y != unitIndexes.y ) {    
            let stopSearch = false;
            let bestCandidate = null;
    
            for ( let x = current.x - 1; x <= current.x + 1; x++ ) {   
                for ( let y = current.y - 1; y <= current.y + 1; y++ ) {
                    if ( y < 0 || y > board.rows - 1 || x < 0 || x > board.columns - 1 ) continue;
    
                    if ( this.pathMap[ x ][ y ] == currentDistance - 1 ) {
                        let isHorizontalMovement = Math.abs( x - current.x ) != 0 && Math.abs( y - current.y ) == 0;                    
                        bestCandidate = { x, y };
    
                        if ( preferHorizontalMovement == isHorizontalMovement ) {
                            stopSearch = true;
                            break;
                        } 
                    }
                }
    
                if ( stopSearch ) break;
            }
    
            current = bestCandidate;
            movePath.push( bestCandidate );
            currentDistance--;
    
            if ( currentDistance < 0 ) break;
        }
        
        movePath.reverse();
        movePath.shift();
        movePath.push( cellIindexes );      
        this.movePath = movePath;
    
        for ( let row = 0; row < board.rows; row++ ) {        
            for ( let column = 0; column < board.columns; column++ ) {
                for ( let step of movePath ) {
                    if ( column == step.x && row == step.y ) {
                        board.cells[ column ][ row ].isPathCell = true;
                        board.cells[ column ][ row ].$element.addClass( 'path-cell' ); 
                    }  
                }
            }
        }
    }

    animateMoveByPath() {
        let nextCellIndexes = this.movePath.shift();
        let $cell = $( `#cell-${nextCellIndexes.x}-${nextCellIndexes.y}` );
        let cellOffset = $cell.offset();  
        this.apCurrent--; 
        $end.removeClass( 'end-red' );
        $end.removeClass( 'end-green' );
        $end.addClass( 'end-yellow' );
        game.isSelectionBlocked = true;
    
        this.$element.animate( {
            left: cellOffset.left,
            top: cellOffset.top
        }, {
            duration: 500,
            easing: "linear",
            // done: function() {
            done: () => {
                this.indexes = nextCellIndexes;
                $cells.removeClass( 'available-cell' ); 
                this.showAvailableCells(); 
                updateSidebar( this );               
                $cell.removeClass( 'path-cell' ); 
    
                if ( this.movePath.length > 0 ) {                    
                    this.animateMoveByPath();  
                } else {
                    game.isSelectionBlocked = false;
                    if ( this.apCurrent == 0 ) {
                        this.isMoved = true;
                        this.$element.addClass( 'moved' );
                        $end.removeClass( 'end-red' );
                        $end.removeClass( 'end-yellow' );
                        $end.addClass( 'end-green' );
                    }
                }   
            }
        } ); 
    }
}

for ( let item of gameData ) {
    if ( item.type == 'hero' ) {
        let unit = new Unit( 
            item.apCurrent, 
            item.apDefault, 
            item.damageCurrent, 
            item.damageDefault, // TODO unit ???
            item.hpCurrent, 
            item.hpDefault, 
            item.id, 
            item.imageFileName,
            item.name, 
            item.type 
        );
    }
}

initialization();

var $board = $( '#board' );
var $cells = $( '.cell' );
var $units = $( '.unit' );
var $end = $( '#end' );

$end.addClass( 'end-red' ); //TODO

// $board.click( onBoardClick );
$cells.click( onCellClick );
$units.click( onUnitClick );
$end.click( onEndClick );