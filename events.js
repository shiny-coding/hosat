function onCellClick( e ) {
    if ( game.teamChooseFase || game.isSelectionBlocked ) return;   

    let unit = getCurrentUnit();
    if ( !unit ) return;

    let $cell = $( this ); 
    let cell = getCellByElement( $cell ); 

    if ( cell.isPathCell ) {
        unit.animateMoveByPath();     
    } else if ( cell.isAvailable ) {
        $cells.removeClass( 'path-cell' ); 
        unit.drawMovePath( $cell );       
    }
}

function onUnitClick( e ) {
    if ( game.isSelectionBlocked ) return;  

    let $unit = $( this );
    let unit = Unit.getUnitByElement( $unit );  
    for ( let unit of Unit.units ) unit.isLastSelected = false;
    unit.isLastSelected = true;   
    updateSidebar( unit );   
    
    if ( game.teamChooseFase ) {
        if ( unit.isCurrent ) {
            let team = unit.team;
            
            if ( team == TEAMS[0] ) {
                game.currentTeam = TEAMS[0];   
                game.currentPlayerId = 0;             
                players[0].team = TEAMS[0];
                players[1].team = TEAMS[1];
            } else {
                game.currentTeam = TEAMS[1];
                game.currentPlayerId = 1;
                players[0].team = TEAMS[1];
                players[1].team = TEAMS[0];
            }

            updateSidebar( unit ); 
            unit.showAvailableCells();
            // unit.isCurrent = false;
            game.roundCount = 1;
            game.turnCount = 1;            
            game.teamChooseFase = false;
        } else {
            for ( let unit of Unit.units ) unit.isCurrent = false;
            unit.isCurrent = true;
            return;
        }
    }    
    
    let test1 = unit.team != game.currentTeam;
    let test2 = isPartlyMoved();
    let test3 = isOneRoundOneMovedUnit();
    if ( test1 || test2 || isOneRoundOneMovedUnit() || unit.isMoved ) return; // TODO

    if ( unit.team == game.currentTeam && !isPartlyMoved()) {
        for ( let unit of Unit.units ) unit.isCurrent = false;
        unit.isCurrent = true;
        $cells.removeClass( 'available-cell' );
        $cells.removeClass( 'path-cell' );
        unit.showAvailableCells();
    }
}

function onEndClick( e ) {
    game.turnCount++;
    $end.removeClass( 'end-yellow' );
    $end.removeClass( 'end-green' );
    $end.addClass( 'end-red' );
    $( '#unit-stats' ).text( '' );
    updateSidebar(); 
    let isAllUnitsMoved = true;

    for ( let unit of Unit.units ) {
        if ( unit.apCurrent < unit.apDefault ) {
            unit.apCurrent = 0;
            updateSidebar(); 
            // break;
        }

        if ( !unit.isMoved ) {
            isAllUnitsMoved = false;
            // break;
        }
    }

    // if ( isAllUnitsMoved ) {
    //     // for ( let unit of Unit.units ) {
    //     //     unit.isPartlyMooved = false;
    //     //     unit.apCurrent = unit.apDefault; //TODO учесть заклинания
    //     // }

    //     // game.roundCount++;
    // } else {
    //     game.turnCount++;
    // }

    if ( game.turnCount == 13 ) { //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!
        game.roundCount++;
        game.turnCount = 1;

        for ( let unit of Unit.units ) {
            unit.isPartlyMooved = false;
            unit.apCurrent = unit.apDefault; //TODO учесть заклинания
        }
    }
    
    $cells.removeClass( 'available-cell' );
    for ( let unit of Unit.units ) {
        unit.isCurrent = false;
    }

    if ( game.currentTeam == TEAMS[0] ) {
        game.currentTeam = TEAMS[1]; 
        game.currentPlayerId = 1;
    } else {
        game.currentTeam = TEAMS[0];
        game.currentPlayerId = 0;
    }

    updateSidebar(); 
}

function onActionClick( e ) {
    let $action = $( this );
    let action = Action.getActionByElement( $action ); 
    
    if ( action.isSelected == false ) {
        for ( let action of Action.actions ) {
            action.isSelected = false;
            action.$element.removeClass( 'action-selected' );
        }

        action.isSelected = true;
        action.$element.addClass( 'action-selected' );
    } else {
        action.isSelected = false;
        action.$element.removeClass( 'action-selected' );
    }

    // updateSidebar( unit );
    updateSidebar();

    markPossibleTargets( action.id );
}