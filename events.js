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
        // setTeamUnitsUnselectable( unit.team ); //TODO
        choosenCellId = null;
    }

    if ( isCellAvailable( $cell ) ) {
        drawMovePath( cell.indexes, unit.indexes );
        choosenCellId = cell.id;
    }
}

function onUnitClick( e ) {
    let $unit = $( this );
    let unit = getUnitByElement( $unit );
    choosenUnitId = null;
    choosenUnitId = unit.id;
    $cells.removeClass( 'available-cell' );

    // let currentUnit = 
    // if ( unit.team != currentUnit.team ) {
    //     //
    // }

    initTurnInfoPanel( unit );
    describeUnit( choosenUnitId );
    drawPathMap( choosenUnitId );
}

function onEndTurnClick( e ) {
    let unit = getUnitById( choosenUnitId );

    if ( unit.team == 1 ) {
        player1.current = false;
        player2.current = true;
        
        setTeamUnitsUnselectable( 1 ) ;
        unsetTeamUnitsUnselectable( 2 );

        for ( let unit of units ) {
            if ( unit.team == 2 ) {
                choosenUnitId = unit.id;
                break;
            }
        }
    } else {
        player1.current = true;
        player2.current = false;

        setTeamUnitsUnselectable( 2 ) ;
        unsetTeamUnitsUnselectable( 1 );

        for ( let unit of units ) {
            if ( unit.team == 1 ) {
                choosenUnitId = unit.id;

                break;
            }
        }
    }

    $cells.removeClass( 'available-cell' );
    turnCount++;

    describeUnit( choosenUnitId );
    drawPathMap( choosenUnitId );
    updateTurnInfoPanel();
}