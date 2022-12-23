function onCellClick( e ) {
    if ( isSelectionBlocked ) return;
    if ( choosenUnitId == null ) return;    

    $cells.removeClass( 'path-cell' ); 
    let $cell = $( this ); 
    let cell = getCell( $cell ); 
    let unit = getUnitById( choosenUnitId );   

    if ( choosenCellId == cell.id ) {
        let step = 0;
        let path = calculateMovePath( cell.indexes, unit.indexes );
        animateMoveByPath( path );
        choosenCellId = null;
    }

    if ( isCellAvailable( $cell ) ) {
        drawMovePath( cell.indexes, unit.indexes );
        choosenCellId = cell.id;
    }
}

function onUnitClick( e ) {
    choosenUnitId = null;
    $cells.removeClass( 'available-cell' );
    let $unit = $( this );
    let unit = getUnitByElement( $unit );  
    choosenUnitId = unit.id;
    
    describeUnit( choosenUnitId );
    drawPathMap( choosenUnitId );
}