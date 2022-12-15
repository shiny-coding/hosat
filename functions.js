function setCellOrHeroElementSize( $cellOrHero ) {
    let size = vmin2px( 100 / BOARD_SIZE_Y ); 
    $cellOrHero.css( 'width', size + 'px' );
    $cellOrHero.css( 'height', size + 'px' );
}

function setHeroElementPosition( heroIndexes, heroId ) {    
    let cellOffset = $( `#cell-${heroIndexes.y}-${heroIndexes.x}` ).offset();
    $( '#' + heroId ).offset( { top: cellOffset.top, left: cellOffset.left } );
}

function setHeroBackground( id ) {    
    for ( let unit of units ) {
        if ( unit.type == 'hero' && id == unit.id ) {
            $( '#hero-' + id ).css( 'background-image', 'url(' + unit.imagePath + ')' );
        }
    }
}

function getUnitById( id ) {
    for ( let unit of units ) {
        if ( unit.type == 'hero' && id == unit.id ) {
            return cloneObject( unit );
        }
    }
}