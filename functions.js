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

function getUnitClone( id ) {
    for ( let unit of units ) {
        if ( unit.type == 'hero' && id == unit.id ) {
            return cloneObject( unit );
        }
    }
}

function getHeroByElement( $hero ) {   
    for ( let hero of heroes ) {
        if ( ( 'hero-' + hero.id ) == $hero.attr( 'id' ) ) {
            return hero;
        }
    }
}

function getHeroById( heroId ) {   
    for ( let hero of heroes ) {
        if ( hero.id == heroId ) {
            return hero;
        }
    }
}

function describeHero( heroId ) {
    let hero = getHeroById( heroId );
    let heroParameters = `
        ${hero.name}<br>
        Current / Base Health Points: ${hero.currentHP} / ${hero.baseHP}<br>
        Current / Base Action Points: ${hero.currentAP} / ${hero.baseAP}<br>        
        Current / Base Damage: ${hero.currentDamage} / ${hero.baseDamage}<br>   
        Current / Base Attack Distance: ${hero.currentAttackDistance} / ${hero.baseAttackDistance}
    `;

    $( '#hero-parameters' ).html( heroParameters );   
}

function calculateHeroPathMap( heroId ) {
    let map = [];

    for ( let x = 0; x < BOARD_SIZE_X; x++ ) {
        map[ x ] = [];        
        for ( let y = 0; y < BOARD_SIZE_Y; y++ ) {       
            map[ x ][ y ] = -1;
        }
    }

    for ( let hero of heroes ) {
        map[ hero.indexes.x ][ hero.indexes.y ] = -2; 
    }

    let hero = getHeroById( heroId );
    map[ hero.indexes.x ][ hero.indexes.y ] = 0;
    for ( let i = 1; i <= hero.currentAP; i++ ) {
        for ( let x = 0; x < BOARD_SIZE_X; x++ ) {
            for ( let y = 0; y < BOARD_SIZE_Y; y++ ) {

                if ( map[ x ][ y ] == i - 1 ) {
                    for ( let x2 = x-1; x2 <= x+1; x2++ ) {   
                        for ( let y2 = y-1; y2 <= y+1; y2++ ) {

                            if (    x2 >= 0 && x2 < BOARD_SIZE_X &&
                                    y2 >= 0 && y2 < BOARD_SIZE_Y &&                                 
                                    Math.abs( x - x2 ) + Math.abs( y - y2 ) <= 1 &&
                                    map[ x2 ][ y2 ] == -1   ) {    
                                
                                map[ x2 ][ y2 ] = i;                               
                            }
                        }
                    }
                }
            }
        }
    }

    return map;
}

function drawHeroPathMap( heroId ) {
    let map = calculateHeroPathMap( heroId );
    $cells.removeClass( 'available-cell' );

    for ( let cell of cells ) {
        if ( map[ cell.indexes.x ][ cell.indexes.y ] > 0 ) {
            cell.$element.addClass( 'available-cell' );            
        }
    }
}