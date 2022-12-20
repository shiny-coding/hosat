function onCellClick( e ) {
    if ( isSelectionBlocked ) return;

    $cells.removeClass( 'path-cell' );
        
    let $cell = $( this ); 

    if ( isCellAvailable( $cell ) ) {
        let cell = getCell( $cell ); 

        // choosenCellId = cell.id;
        $cell.addClass( 'path-cell' ); //TODO remove?
        
        drawMovePath( cell.indexes, getUnitById( choosenUnitId ).indexes );
    }

}

function onUnitClick( e ) {
    $cells.removeClass( 'available-cell' );

    let $unit = $( this );
    let unit = getUnitByElement( $unit );

    choosenUnitId = unit.id;
    describeUnit( choosenUnitId );
    // calculatePathMap( choosenUnitId );
    drawPathMap( choosenUnitId );
}