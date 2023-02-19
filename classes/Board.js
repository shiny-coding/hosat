class Board {
    static $ELEMENT = $( '#Board' );
    static NUMBER_OF_HEROES_IN_ROW = 4;
    static NUMBER_OF_HEROES_IN_COLUMN = 3;
    static NUMBER_OF_CELLS_BETWEEN_HEROES = 4;
    static ROWS = ( Board.NUMBER_OF_HEROES_IN_COLUMN - 1 ) * Board.NUMBER_OF_CELLS_BETWEEN_HEROES + Board.NUMBER_OF_HEROES_IN_COLUMN;
    static COLUMNS = ( Board.NUMBER_OF_HEROES_IN_ROW - 1 ) * Board.NUMBER_OF_CELLS_BETWEEN_HEROES + Board.NUMBER_OF_HEROES_IN_ROW;

    static createCells() {
        let cells = [];
        let cellCounter = 0;

        for ( let row = 0; row < Board.ROWS; row++ ) {
            Board.$ELEMENT.append( $( `<div class="row" id="row-${row}">` ) ); 
        }

        for ( let row = 0; row < Board.ROWS; row++ ) {        
            for ( let column = 0; column < Board.COLUMNS; column++ ) {
                let cellId = cellCounter;                 
                let $element = $( `<div class="cell" id="cell-${column}-${row}">` );
                $( '#row-' + row ).append( $element ); 

                let cell = new Cell( 
                    cellId, 
                    { x: column, y: row }, 
                    $element 
                );

                cells.push( cell );
                let cellSize = vmin2px( 100 / Board.ROWS ); 
                cell.$element.css( 'width', cellSize + 'px' );
                cell.$element.css( 'height', cellSize + 'px' );
                Board.setCellElementSize( cell );
                cellCounter++;
            }
        }

        return cells;
    }

    static createUnits( gameData ) {
        let units = [];
        let randomHeroesId = shuffle( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] );
        let randomHeroesTeams = shuffle( [  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1 ] );
        let unitCounter = 0;
    
        for ( let row = 0; row < Board.ROWS; row++ ) {
            for ( let column = 0; column < Board.COLUMNS; column++ ) {
                if ( column % ( Board.NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                     row % ( Board.NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                     unitCounter < Board.NUMBER_OF_HEROES_IN_ROW * Board.NUMBER_OF_HEROES_IN_COLUMN ) { 
    
                    let $element = $( `<div class="unit hero" id="hero-${randomHeroesId[unitCounter]}">` );    
                    // TODO change ( REMOVE ) hero (left unit)                   
                    Board.$ELEMENT.append( $element );    
                    let heroIndexes = { x: column, y: row };  
                    let team = randomHeroesTeams[ randomHeroesId[ unitCounter ] ];  
    
                    if ( team == 0 ) {
                        $element.addClass( 'team0' );
                    } else {
                        $element.addClass( 'team1' );
                    }

                    let currentUnit = gameData.units[ unitCounter ];

                    let unit = new Unit( 
                        // [], //actionsIds,
                        currentUnit.apCurrent,   
                        currentUnit.apDefault,  
                        currentUnit.damageCurrent,   
                        currentUnit.damageDefault,
                        currentUnit.hpCurrent, 
                        currentUnit.hpDefault,
                        randomHeroesId[ unitCounter ], //id,
                        currentUnit.imageFileName,
                        heroIndexes,
                        // false, //isCurrent,
                        // false, //isLastSelected,
                        // false, //isMoved,
                        // false, //isPartlyMoved,
                        // undefined, //movePath,
                        currentUnit.name,
                        // undefined, //pathMap,
                        TEAMS[ team ],
                        currentUnit.type,
                        $element
                    );

                    units.push( unit );
                    Board.setUnitElementSize( unit );
                    Board.setUnitElementPosition( unit );    
                    Board.setUnitBackground( unit );
                    unitCounter++;
                }
            }    
        }

        return units;
    }

    /**
     * @param {Cell} cell
     */
    static setCellElementSize( cell ) {
        let size = vmin2px( 100 / Board.ROWS ); 
        cell.$element.css( 'width', size + 'px' );
        cell.$element.css( 'height', size + 'px' );
    }

    /**
     * @param {Unit} unit
     */
    static setUnitElementSize( unit ) {
        let size = vmin2px( 100 / Board.ROWS ); 
        unit.$element.css( 'width', size + 'px' );
        unit.$element.css( 'height', size + 'px' );    
    }

    /**
     * @param {Unit} unit
     */
    static setUnitElementPosition( unit ) {  
        let cellOffset = $( `#cell-${unit.indexes.x}-${unit.indexes.y}` ).offset();
        unit.$element.offset( { top: cellOffset.top, left: cellOffset.left } );
    }

    /**
     * @param {Unit} unit
     */
    static setUnitBackground( unit ) {
        let imagePath = 'url(/images/heroes/' + unit.imageFileName + '.jpg)';
        $( '#hero-' + unit.id ).css( 'background-image', imagePath );
    }
}