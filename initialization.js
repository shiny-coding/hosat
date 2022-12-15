function initialization() {
    let heroesTeams = [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1 ];
    shuffle( heroesTeams );
    let heroesIds = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    shuffle( heroesIds );

    let $board = $( '#board' );

    for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
        $board.append( $( `<div class="row" id="row-${row}">` ) ); 
    }

    for ( let row = 0; row < BOARD_SIZE_Y; row++ ) {
        for ( let column = 0; column < BOARD_SIZE_X; column++ ) {
            let cellId = `cell-${column}-${row}`;                    
            $( '#row-' + row ).append( $( `<div class="cell" id="${cellId}">` ) );        
            let $cell = $( '#' + cellId );                
            let cell = {};  
            cells.push( cell );   
            cell.$element = $cell;
            cell.indexes = { x: row, y: column };
            setCellOrHeroElementSize( $cell );
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
                let heroIndexes = { x: row, y: column };          
                setCellOrHeroElementSize( $hero );     
                setHeroElementPosition( heroIndexes, heroId );    
                setHeroBackground( heroesIds[ heroCounter ] );

                let hero = getUnitById( heroesIds[ heroCounter ] );   
                let team = heroesTeams[ heroesIds[ heroCounter ] ];                

                if ( team == 0 ) {
                    $hero.addClass( 'team1' );
                } else {
                    $hero.addClass( 'team2' );
                }

                hero.team = team;
                hero.$element = $hero;
                heroes.push( hero ); 
                
                heroCounter++;
            }
        }    
    }
}