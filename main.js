// var game = new Game();


var gameDataJson = $('meta[name="game-data-json"]').attr('content');
var gameData = JSON.parse( decodeHtml( gameDataJson ) );

// перенести $units.click( onUnitClick ) в класс!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// перенести initialization() в класс!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
        this.actionsIds = [];
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
        // if ( Unit.units === undefined ) {
        //     Unit.units = [this];
        // } else {
        //     Unit.units.push( this );
        // }
    }

    // static units = undefined;
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
            done: function() {
            // done: () => {
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
            }.bind( this )
            // }
        } ); 
    }

    // markPossibleTargets() {
    //     for ( let unit of Unit.units ) {
    //         let dx = Math.abs( unit.indexes.x - this.indexes.x );
    //         let dy = Math.abs( unit.indexes.y - this.indexes.y );
    //         let distance = dx + dy;
    //         if ( this. >= distance ) {
    //             hero.$element.addClass( 'attackable' );
    //         }
    //     }
    // }
}

// name
// type: buff, debuff, damage, control, taunt, ...
// target: ally, enemy, all
// hit range
// range
// radius / area
// duration
// effect ( damage + 2)
// ap ( 0 if simple attack )

// priest (white mage): 1. Heal. 2. Damage+ ( "Bless weapon" ). 3. Armor (HP+) ( "Bless armor" ). 4.Shield (no damage) ( "Holy shield" ). 5.Purification 6.Resurrection. 
// astral: 1. Teleport. 2. 
// air : 1.Haste. 2. wind blow
// spells: magic mirror, 
// earth: slow, rock armor

// Stats Enhancement
// Stats Weakening

// Displacement смещение

class Action {
    constructor( ap, area, attribute, damage, duration, effect, id, imageFileName, name, distance, sign, target, type, unitId, value ) {
        this.ap = ap;
        this.area = area;
        this.attribute = attribute;
        this.damage = damage;
        this.duration = duration;
        this.effect = effect;
        this.id = id;        
        this.imageFileName = imageFileName;
        this.isSelected = false;
        this.name = name;
        this.distance = distance;
        this.sign = sign;
        this.target = target;
        this.type = type;  
        this.unitId = unitId; 
        this.value = value; 
        this.$element = undefined;
        Action.actions.push( this );
    }

    static actions = [];

    static getActionById( actionId ) {
        for ( let action of Action.actions ) {
            if ( action.id == actionId ) {
                return action;
            }
        }
    }

    static getActionByElement( $action ) {
        for ( let action of Action.actions ) {
            if ( ( 'action-' + action.id ) == $action.attr( 'id' ) ) {
                return action;
            }
        }
    }

    // static createActionElement() {
    //     let $element = $( `<div class="action" id="action-${this.id}">${this.name}</div>`);
    //     $( '#unit-actions' ).append( $element ); 

    //     // for ( let actionId of unit.actionsIds ) {
    //     //     let action = Action.getActionById( actionId );
    //     //     let $element = $( `<div class="action" id="action-${action.id}">${action.name}</div>`);
    //     //     $( '#unit-actions' ).append( $element ); 
    //     //     unit.$element = $element;
    //     // }
    // }
}

for ( let item of gameData.actions ) {
    let action = new Action( 
        item.ap,
        item.area, 
        item.attribute,
        item.damage, 
        item.duration, 
        item.effect, 
        item.id, 
        item.imageFileName,
        item.name, 
        item.distance,
        item.sign,
        item.target,
        item.type,
        item.unitId, 
        item.value 
    );
}

for ( let item of gameData.units ) {
    if ( item.type == 'hero' ) {
        let unit = new Unit(             
            item.apCurrent, 
            item.apDefault, 
            item.damageCurrent, 
            item.damageDefault,
            item.hpCurrent, 
            item.hpDefault, 
            item.id, 
            item.imageFileName,
            item.name, 
            item.type
        );
    }
}

for ( let action of Action.actions ) {
    if ( action.unitId ) {
        for ( let unit of Unit.units ) {
            if ( unit.id == action.unitId ) {
                unit.actionsIds.push( action.id );
            }
        }
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
// $actions.click( onActionClick );
// $( 'body' ).on( 'click', '.action', onActionClick );
$end.click( onEndClick );


for ( let action of Action.actions ) {
        // let $element = $( `<div class="action" id="action-${this.id}">${this.name}</div>`);
        let $element = $( `<div class="action" id="action-${action.id}">${action.name}</div>`);
        $( '#unit-actions' ).append( $element ); 
        action.$element = $element;
        // action.$element.hide();
}

var $actions = $( '.action' );
$actions.click( onActionClick );
// $( 'body' ).on( 'click', '.action', onActionClick );


    //     let $element = $( `<div class="action" id="action-${this.id}">${this.name}</div>`);
    //     $( '#unit-actions' ).append( $element ); 

    //     // for ( let actionId of unit.actionsIds ) {
    //     //     let action = Action.getActionById( actionId );
    //     //     let $element = $( `<div class="action" id="action-${action.id}">${action.name}</div>`);
    //     //     $( '#unit-actions' ).append( $element ); 
    //     //     unit.$element = $element;
    //     // }


// как убрать из контекстного меню юнита лишние свойства???

// remove hit_range_current !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!