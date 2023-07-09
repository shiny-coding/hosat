function isPartlyMoved() {
    for ( let unit of Unit.units ) {
        if ( unit.apCurrent < unit.apDefault && unit.apCurrent > 0 ) {
            return unit;
        }
    }

    return false;
}

function isOneRoundOneMovedUnit() {
    let movedUnitsCounter = 0;

    for ( let unit of Unit.units ) {
        if ( unit.isMoved ) {
            movedUnitsCounter++;
        }
    }

    if ( movedUnitsCounter == game.turnCount ) return true;
        else return false;
}

function isCellOfPath( cell ) {
    for ( let cell of Board.cells ) {
        if ( cell.indexes.x == cellIindexes.x && cell.indexes.y == cellIindexes.y ) {
            return cell.$element;
        }
    }
}


