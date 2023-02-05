//TODO in alphabetic
//TODO make functions - as methods of objects!!!?

function getCellByElement( $cell ) { 
    for ( let row = 0; row < board.rows; row++ ) {        
        for ( let column = 0; column < board.columns; column++ ) {
            if ( board.cells[ column ][ row ].$element.is( $cell ) ) 
                return board.cells[ column ][ row ];   
        }
    }

// function getCellByElement( $cell ) { 
    // for ( let cell of cells ) {
    //     if ( cell.$element.is( $cell ) ) {
    //         return cell;
    //     }
    // }
}

// function removeCurrentStateFromUnits() {
//     for ( let unit of units ) {
//         unit.isCurrent = false;
//     }
// }

// function disableNonCurrentTeamUnits( unit ) {
//     let currentTeam = undefined;

//     for ( let unit of units ) {
//         if ( unit.isCurrent ) {
//             currentTeam = unit.team;
//             break;
//         }
//     }
    
//     for ( let unit of units ) {
//         if ( unit.team != currentTeam ) {
//             unit.teamTurn = false;
//             // unit.$element.addClass( 'disabled' );
//         }
//     }
// }

// function getCellElementByIndexes( cellIindexes ) {
//     for ( let cell of cells ) {
//         if ( cell.indexes.x == cellIindexes.x && cell.indexes.y == cellIindexes.y ) {
//             return cell.$element;
//         }
//     }
// }

function getUnitById( unitId ) {   
    for ( let unit of units ) {
        if ( unit.id == unitId ) {
            return unit;
        }
    }
}

function getUnitByElement( $unit ) {   
    for ( let unit of units ) {
        if ( ( 'hero-' + unit.id ) == $unit.attr( 'id' ) ) {
            return unit;
        }
    }
}

function getCurrentUnit() {
    for ( let unit of units ) {
        if ( unit.isCurrent == true) {
            return unit;
        }
    }

    return false;
}

function isPartlyMoved() {
    for ( let unit of units ) {
        if ( unit.apCurrent < unit.apDefault ) {
            return unit;
        }
    }

    return false;
}

function isCellOfPath( cell ) {
    for ( let cell of board.cells ) {
        if ( cell.indexes.x == cellIindexes.x && cell.indexes.y == cellIindexes.y ) {
            return cell.$element;
        }
    }
}

function getUnitClone( unitId ) {
    for ( let unit of units ) {
        if ( unit.id == unitId ) {
            return cloneObject( unit );
        }
    }
}

function setCellOrHeroElementSize( $cellOrHero ) {
    let size = vmin2px( 100 / board.rows ); 
    $cellOrHero.css( 'width', size + 'px' );
    $cellOrHero.css( 'height', size + 'px' );
}

function setHeroElementPosition( heroIndexes, heroId ) {    
    let cellOffset = $( `#cell-${heroIndexes.x}-${heroIndexes.y}` ).offset();
    $( '#' + heroId ).offset( { top: cellOffset.top, left: cellOffset.left } );
}

function setHeroBackground( id ) {    
    for ( let unit of units ) {
        if ( unit.type == 'hero' && id == unit.id ) {
            let imagePath = 'url(/images/heroes/' + unit.imageFileName + '.jpg)';
            $( '#hero-' + id ).css( 'background-image', imagePath );
        }
    }
}

// function isCellAvailable( $cell ) {
//     if ( $cell.hasClass( 'available-cell' ) ) {
//         return true;
//     }
// }

function isCellAvailable( $cell ) {
    // let cell = getCellByElement( $cell );
    // if ( cell.isCellAvailable ) return true;

    if ( getCellByElement( $cell ).isCellAvailable ) return true; //TODO Q need return false branch?
}

function isCellOfPath( $cell ) {
    //
}

// function showCellsAvailable( unit ) {
function showCellsAvailable( unit ) {
    // if ( !unit.isCurrent ) return;

    unit.pathMap = []; // ??? just pathMap without unit !!!
    
    for ( let x = 0; x < board.columns; x++ ) {          
        unit.pathMap[ x ] = [];        
        for ( let y = 0; y < board.rows; y++ ) {       
            unit.pathMap[ x ][ y ] = -1;
        }
    }

    for ( let iteratedUnit of units ) {
        unit.pathMap[ iteratedUnit.indexes.x ][ iteratedUnit.indexes.y ] = -2; 
    }

    unit.pathMap[ unit.indexes.x ][ unit.indexes.y ] = 0;

    for ( let i = 1; i <= unit.apCurrent; i++ ) {
        for ( let x = 0; x < board.columns; x++ ) {
            for ( let y = 0; y < board.rows; y++ ) {

                if ( unit.pathMap[ x ][ y ] == i - 1 ) {
                    for ( let x2 = x-1; x2 <= x+1; x2++ ) {   
                        for ( let y2 = y-1; y2 <= y+1; y2++ ) {

                            if (    x2 >= 0 && x2 < board.columns &&
                                    y2 >= 0 && y2 < board.rows &&                                 
                                    Math.abs( x - x2 ) + Math.abs( y - y2 ) <= 1 &&
                                    unit.pathMap[ x2 ][ y2 ] == -1   ) {    
                                
                                unit.pathMap[ x2 ][ y2 ] = i;                               
                            }
                        }
                    }
                }
            }
        }
    }

    for ( let row = 0; row < board.rows; row++ ) {        
        for ( let column = 0; column < board.columns; column++ ) {
            if ( unit.pathMap[ board.cells[ column ][ row ].indexes.x ][ board.cells[ column ][ row ].indexes.y ] > 0 ) {
                board.cells[ column ][ row ].isAvailable = true; 
                board.cells[ column ][ row ].$element.addClass( 'available-cell' );            
            }
        }
    }

    // let a=5;

    // for ( let cell of board.cells ) {
    //     if ( unit.pathMap[ cell.indexes.x ][ cell.indexes.y ] > 0 ) {
    //         cell.isCellAvailable = true; 
    //         cell.$element.addClass( 'available-cell' );            
    //     }
    // }
}

// function calculateMovePath( $cell, unit ) {
function drawMovePath( $cell, unit ) {
    let cellIindexes = getCellByElement( $cell ).indexes;
    let unitIndexes = unit.indexes;
    let preferHorizontalMovement = Math.abs( cellIindexes.x - unitIndexes.x ) < Math.abs( cellIindexes.y - unitIndexes.y );
    let current = cellIindexes; //TODO remove current ???
    let distance = unit.pathMap[ cellIindexes.x ][ cellIindexes.y ];    
    let currentDistance = distance; //TODO ???
    let movePath = [];

    while ( current.x != unitIndexes.x || current.y != unitIndexes.y ) {    
        let stopSearch = false;
        let bestCandidate = null;

        for ( let x = current.x - 1; x <= current.x + 1; x++ ) {   
            for ( let y = current.y - 1; y <= current.y + 1; y++ ) {
                if ( y < 0 || y > board.rows - 1 || x < 0 || x > board.columns - 1 ) continue;

                if ( unit.pathMap[ x ][ y ] == currentDistance - 1 ) {
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
    unit.movePath = movePath;

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

function animateMoveByPath( unit ) {
    let nextCellIndexes = unit.movePath.shift();
    let $cell = $( `#cell-${nextCellIndexes.x}-${nextCellIndexes.y}` );
    let cellOffset = $cell.offset();  
    unit.apCurrent--;

    // if ( unit.apCurrent <= 0 ) {
    //     unit.isCurrent = false;
    //     $cells.removeClass( 'path-cell' ); 
    // } else {
    //     unit.isCurrent = true;
    // }

    // if ( unit.apCurrent < unit.apDefault && unit.apCurrent >= 0 ) {
    //     // unit.isCurrent = true;
    //     unit.isPartlyMooved = true;
    // } else {
    //     // unit.isCurrent = false;
    //     unit.isPartlyMooved = false;
    //     // $cells.removeClass( 'path-cell' ); 
    // }

    // unit.isCurrent = true;  
    game.isSelectionBlocked = true;

    unit.$element.animate( {
        left: cellOffset.left,
        top: cellOffset.top
    }, {
        duration: 500,
        easing: "linear",
        done: function() {
            unit.indexes = nextCellIndexes;
            $cells.removeClass( 'available-cell' ); 
            showCellsAvailable( unit ); 
            updateSidebar( unit );               
            $cell.removeClass( 'path-cell' ); 

            if ( unit.movePath.length > 0 ) {                    
                animateMoveByPath( unit );  
            } else {
                game.isSelectionBlocked = false;

                if ( unit.apCurrent == 0 ) {
                    unit.isMooved = true;
                    unit.$element.addClass( 'moved' );
                }
                // unit.partlyMooved = false;
            }   
        }
    } ); 
}

function updateSidebar( unit ) {
    $( '#round' ).text( 'Round ' + game.roundCount );
    $( '#turn' ).text( 'Turn ' + game.turnCount );
    $( '#current-player' ).text( getPlayerNameById( game.currentPlayerId ) + ' ( ' + getPlayerTeamById( game.currentPlayerId ) + ' )' );
    
    if ( unit ) {
        $( '#unitbar' ).html( `
            ${unit.name}<br>
            Health Points: ${unit.hpCurrent} / ${unit.hpDefault}<br>
            Action Points: ${unit.apCurrent} / ${unit.apDefault}<br>        
            Damage: ${unit.damageCurrent} / ${unit.damageDefault}<br>   
            Attack Distance: ${unit.hitRangeCurrent} / ${unit.hitRangeDefault} ` 
        ); 
    }
}

function getPlayerNameById( playerId ) {
    for ( let player of players ) {
        if ( player.id == playerId ) {
            return player.name;
        }
    }
}

function getPlayerTeamById( playerId ) {
    for ( let player of players ) {
        if ( player.id == playerId ) {
            return player.team;
        }
    }
}

function setTeamUnitsUnselectable( unitTeam ) {
    for ( let unit of units ) {
        if ( unit.team == unitTeam ) {
            unit.$element.addClass( 'unselectable-unit' );
        }
    }
}

function unsetTeamUnitsUnselectable( unitTeam ) {
    for ( let unit of units ) {
        if ( unit.team == unitTeam ) {
            unit.$element.removeClass( 'unselectable-unit' );
        }
    }
}

function getHeroes( gameData ) {
    let heroes = [];
    for ( let item of gameData ) {
        if ( item.unitType == 'hero' ) {
            heroes.push( item );
        }
    }
    return heroes;
}

function getSummons( gameData ) {
    let heroes = [];
    for ( let item of gameData ) {
        if ( item.unitType == 'summon' ) {
            heroes.push( item );
        }
    }
    return heroes;
}

function setUnits( heroes ) {
    let units = [];
    for ( let hero of heroes ) {
        units.push( cloneObject( hero ) );
    }
    return units;
}