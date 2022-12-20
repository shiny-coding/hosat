function getCell( $cell ) {
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
        if ( ( 'hero-' + unit.id ) == $unit.attr( 'id' ) ) { //TODO
            return unit;
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
    let size = vmin2px( 100 / BOARD_SIZE_Y ); 
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
            $( '#hero-' + id ).css( 'background-image', 'url(' + unit.imagePath + ')' );
        }
    }
}

function describeUnit( unitId ) {
    let hero = getUnitById( unitId );
    let heroParameters = `
        ${hero.name}<br>
        Health Points: ${hero.currentHP} / ${hero.baseHP}<br>
        Action Points: ${hero.currentAP} / ${hero.baseAP}<br>        
        Damage: ${hero.currentDamage} / ${hero.baseDamage}<br>   
        Attack Distance: ${hero.currentAttackDistance} / ${hero.baseAttackDistance}
    `;

    $( '#hero-parameters' ).html( heroParameters );   
}

function calculatePathMap( unitId ) {
    for ( let x = 0; x < BOARD_SIZE_X; x++ ) {
        pathMap[ x ] = [];        
        for ( let y = 0; y < BOARD_SIZE_Y; y++ ) {       
            pathMap[ x ][ y ] = -1;
        }
    }

    for ( let unit of units ) {
        if ( unit.indexes ) {
            pathMap[ unit.indexes.x ][ unit.indexes.y ] = -2; 
        }
    }

    let unit = getUnitById( unitId );
    pathMap[ unit.indexes.x ][ unit.indexes.y ] = 0;

    for ( let i = 1; i <= unit.currentAP; i++ ) {
        for ( let x = 0; x < BOARD_SIZE_X; x++ ) {
            for ( let y = 0; y < BOARD_SIZE_Y; y++ ) {

                if ( pathMap[ x ][ y ] == i - 1 ) {
                    for ( let x2 = x-1; x2 <= x+1; x2++ ) {   
                        for ( let y2 = y-1; y2 <= y+1; y2++ ) {

                            if (    x2 >= 0 && x2 < BOARD_SIZE_X &&
                                    y2 >= 0 && y2 < BOARD_SIZE_Y &&                                 
                                    Math.abs( x - x2 ) + Math.abs( y - y2 ) <= 1 &&
                                    pathMap[ x2 ][ y2 ] == -1   ) {    
                                
                                pathMap[ x2 ][ y2 ] = i;                               
                            }
                        }
                    }
                }
            }
        }
    }
}

function drawPathMap( unitId ) {    
    calculatePathMap( unitId );

    for ( let cell of cells ) {
        if ( pathMap[ cell.indexes.x ][ cell.indexes.y ] > 0 ) {
            cell.$element.addClass( 'available-cell' );            
        }
    }
}

function isCellAvailable( $cell ) {
    if ( $cell.hasClass( 'available-cell' ) ) {
        return true;
    }
}

function calculateMovePath( choosenCellIndexes, choosenUnitIndexes ) {
    let resultPath = [];
    let preferHorizontalMovement = Math.abs( choosenCellIndexes.x - choosenUnitIndexes.x ) < Math.abs( choosenCellIndexes.y - choosenUnitIndexes.y );
    let current = choosenCellIndexes;
    let distance = pathMap[ choosenCellIndexes.x ][ choosenCellIndexes.y ];    
    let currentDistance = distance;

    while ( current.x != choosenUnitIndexes.x || current.y != choosenUnitIndexes.y ) {    
        let stopSearch = false;
        let bestCandidate = null;

        for ( let x = current.x - 1; x <= current.x + 1; x++ ) {   
            for ( let y = current.y - 1; y <= current.y + 1; y++ ) {
                if ( y < 0 || y > BOARD_SIZE_Y - 1 || x < 0 || x > BOARD_SIZE_X - 1 ) continue;

                if ( pathMap[ x ][ y ] == currentDistance - 1 ) {
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
        resultPath.push( bestCandidate );
        currentDistance--;

        if ( currentDistance < 0 ) break;
    }
    
    resultPath.reverse();
    resultPath.shift();
    resultPath.push( choosenCellIndexes );    

    return resultPath;
}

function drawMovePath( choosenCellIndexes, choosenUnitIndexes ) {
    let resultPath = calculateMovePath( choosenCellIndexes, choosenUnitIndexes );

    for ( let indexes of resultPath ) {
        getCellElementByIndexes( indexes ).addClass( 'path-cell' ); 
    }
}

function animateMoveByPath( path, step ) {
    if ( step == path.length ) {
        isSelectionBlocked = false;
        return;
    }

    // let choosenUnit = 
    let nextCellIndexes = path[ step ];   
    
    if ( step == path.length - 1 ) {
        choosenUnit.$element.removeClass( 'chosen-hero' ); 
        choosenUnit.indexes = nextCellIndexes;
    }

    let $cell = $( `#cell-${nextCellIndexes.x}-${nextCellIndexes.y}` );
    let cellOffset = $cell.offset();  

    choosenUnit.$element.animate( {
        left: cellOffset.left,
        top: cellOffset.top
    }, {
        duration: 500,
        easing: "linear",
        done: function() {
            choosenUnit.indexes = getCellIndexes( $cell );
            drawPathMap(); 
            if ( step < path.length - 1 ) choosenUnit.currentAP--;
            describeUnit();
            $cell.removeClass( 'path-cell' );            
            moveByPath( path, step + 1 );  
        }
    } );    
}