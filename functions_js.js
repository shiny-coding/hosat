//TODO make functions - as methods of objects!!!?
function getCell( $cell ) { //TODO in alphabetic
    for ( let cell of cells ) {
        if ( cell.$element.is( $cell ) ) {
            return cell;
        }
    }
}

function getCellElementByIndexes( cellIindexes ) {
    for ( let cell of cells ) {
        if ( cell.indexes.x == cellIindexes.x && cell.indexes.y == cellIindexes.y ) {
            return cell.$element;
        }
    }
}

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

// function getCurrentCell() {
//     for ( let unit of units ) {
//         if ( unit.isCurrent == true) {
//             return unit;
//         }
//     }

//     return false;
// }

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
    // let cell = getCell( $cell );
    // if ( cell.isCellAvailable ) return true;

    if ( getCell( $cell ).isCellAvailable ) return true; //TODO Q need return false branch?
}

function isCellOfPath( $cell ) {
    //
}

function setCellsAvailable( unit ) {
    unit.pathMap = []; //TODO unit do not need pathMap?? cell.available!!
    
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

    for ( let cell of board.cells ) {
        if ( unit.pathMap[ cell.indexes.x ][ cell.indexes.y ] > 0 ) {
            cell.isCellAvailable = true; 
            cell.$element.addClass( 'available-cell' );            
        }
    }
}

function calculateMovePath( $cell, unit ) {
    let cellIindexes = getCell( $cell ).indexes;
    let unitIndexes = unit.indexes;
    let preferHorizontalMovement = Math.abs( cellIindexes.x - unitIndexes.x ) < Math.abs( cellIindexes.y - unitIndexes.y );
    let current = cellIindexes; //TODO remove current ???
    let distance = unit.pathMap[ cellIindexes.x ][ cellIindexes.y ];    
    let currentDistance = distance; //TODO ???
    let path = [];

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
        path.push( bestCandidate );
        currentDistance--;

        if ( currentDistance < 0 ) break;
    }
    
    path.reverse();
    path.shift();
    path.push( cellIindexes );    

    return path;
}

// function calculateMovePath( choosenCellIndexes, choosenUnitIndexes ) {
//     let path = [];
//     let preferHorizontalMovement = Math.abs( choosenCellIndexes.x - choosenUnitIndexes.x ) < Math.abs( choosenCellIndexes.y - choosenUnitIndexes.y );
//     let current = choosenCellIndexes;
//     let distance = pathMap[ choosenCellIndexes.x ][ choosenCellIndexes.y ];    
//     let currentDistance = distance;

//     while ( current.x != choosenUnitIndexes.x || current.y != choosenUnitIndexes.y ) {    
//         let stopSearch = false;
//         let bestCandidate = null;

//         for ( let x = current.x - 1; x <= current.x + 1; x++ ) {   
//             for ( let y = current.y - 1; y <= current.y + 1; y++ ) {
//                 if ( y < 0 || y > board.rows - 1 || x < 0 || x > board.columns - 1 ) continue;

//                 if ( pathMap[ x ][ y ] == currentDistance - 1 ) {
//                     let isHorizontalMovement = Math.abs( x - current.x ) != 0 && Math.abs( y - current.y ) == 0;                    
//                     bestCandidate = { x, y };

//                     if ( preferHorizontalMovement == isHorizontalMovement ) {
//                         stopSearch = true;
//                         break;
//                     } 
//                 }
//             }

//             if ( stopSearch ) break;
//         }

//         current = bestCandidate;
//         path.push( bestCandidate );
//         currentDistance--;

//         if ( currentDistance < 0 ) break;
//     }
    
//     path.reverse();
//     path.shift();
//     path.push( choosenCellIndexes );    

//     return path;
// }

function drawMovePath( $cell, unit ) {
    let path = calculateMovePath( $cell, unit );

    for ( let indexes of path ) {
        getCellElementByIndexes( indexes ).addClass( 'path-cell' ); 
    }
}

function animateMoveByPath( path ) {
    let choosenUnit = getUnitById( choosenUnitId ); 
    let nextCellIndexes = path.shift();
    let $cell = $( `#cell-${nextCellIndexes.x}-${nextCellIndexes.y}` );
    let cellOffset = $cell.offset();  
    choosenUnit.apCurrent--;

    choosenUnit.$element.animate( {
        left: cellOffset.left,
        top: cellOffset.top
    }, {
        duration: 500,
        easing: "linear",
        done: function() {
            choosenUnit.indexes = nextCellIndexes;
            $cells.removeClass( 'available-cell' ); 
            setCellsAvailable( unit ); 
            describeUnit( choosenUnit.id );               
            $cell.removeClass( 'path-cell' ); 

            if ( path.length > 0 ) {                    
                animateMoveByPath( path );                    
            } else {
                isSelectionBlocked = false;
            }                  
        }
    } ); 
}

function describeUnit( unit ) {
    $( '#unitbar' ).html( `
        ${unit.name}<br>
        Health Points: ${unit.hpCurrent} / ${unit.hpDefault}<br>
        Action Points: ${unit.apCurrent} / ${unit.apDefault}<br>        
        Damage: ${unit.damageCurrent} / ${unit.damageDefault}<br>   
        Attack Distance: ${unit.hitRangeCurrent} / ${unit.hitRangeDefault}
    ` );   
}

function updateTurnInfoPanel() {
    let $globalTurnCount = $( '#global-turn-count' );
    $globalTurnCount.text( 'TURN ' + 1 );

    let $currentPlayerName = $( '#current-player-name' );

    if ( player1.current == true ) {
        $currentPlayerName.text( player1.name + '(' + player1.color + ') Move' );
    } else {
        $currentPlayerName.text( player2.name + '(' + player2.color + ') Move' );
    }
}

function updateSidebar( unit ) {
    $( '#round' ).text( 'Round ' + game.roundCount );
    $( '#turn' ).text( 'Turn ' + game.turnCount );
    $( '#current-player' ).text( getPlayerNameById( game.currentPlayerId ) + ' ( ' + getPlayerTeamById( game.currentPlayerId ) + ' )' );
    describeUnit( unit );
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