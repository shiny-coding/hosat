function initUnits() {
    for ( let unit of unitsLibrary ) {
        units.push( cloneObject( unit ) );
    }
}

function initBoard() {
    let heroesTeams = [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1 ];
    shuffle( heroesTeams );

    let heroesIds = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    shuffle( heroesIds );

    let $board = $( '#board' );

    for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
        $board.append( $( `<div class="row" id="row-${row}">` ) ); 
    }

    let cellCounter = 0;

    for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
        for ( let column = 0; column < BOARD_SIZE_X; column++ ) {
            let cellId = `cell-${column}-${row}`;                    
            $( '#row-' + row ).append( $( `<div class="cell" id="${cellId}">` ) );        
            let $cell = $( '#' + cellId );       
            $cell.text(column + '-' + row); //TODO         
            let cell = {};  
            cells.push( cell );
            cell.id = cellCounter;
            cell.$element = $cell;
            cell.indexes = { x: column, y: row };
            setCellOrHeroElementSize( $cell );
            cellCounter++;
        }    
    }

    let heroCounter = 0;

    for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
        for ( let column = 0; column < BOARD_SIZE_X; column++ ) {
            if ( column % ( NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                 row % ( NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
                 heroCounter < NUMBER_OF_HEROES_IN_ROW * NUMBER_OF_HEROES_IN_COLUMN ) { 

                let heroId = `hero-${heroesIds[ heroCounter ]}`;                                    
                $board.append( $( `<div class="hero" id="${heroId}">` ) );    
                let $hero = $( '#' + heroId ); 
                let heroIndexes = { x: column, y: row };  
                setCellOrHeroElementSize( $hero );     
                setHeroElementPosition( heroIndexes, heroId );    
                setHeroBackground( heroesIds[ heroCounter ] );
                let team = heroesTeams[ heroesIds[ heroCounter ] ];                

                if ( team == 0 ) {
                    $hero.addClass( 'team1' );
                } else {
                    $hero.addClass( 'team2' );
                }

                for ( let unit of units ) {
                    if ( unit.id == heroesIds[ heroCounter ] ) {
                        unit.team = team;
                        unit.indexes = heroIndexes;
                        unit.$element = $hero;
                    }
                }
               
                heroCounter++;
            }
        }    
    }
}