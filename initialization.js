function initBoard() {
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
            cell.indexes = { x: column, y: row };
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
                let heroIndexes = { x: column, y: row };  
                setCellOrHeroElementSize( $hero );     
                setHeroElementPosition( heroIndexes, heroId );    
                setHeroBackground( heroesIds[ heroCounter ] );
                let hero = getUnitClone( heroesIds[ heroCounter ] );   
                let team = heroesTeams[ heroesIds[ heroCounter ] ];                

                if ( team == 0 ) {
                    $hero.addClass( 'team1' );
                } else {
                    $hero.addClass( 'team2' );
                }

                hero.team = team;
                hero.indexes = heroIndexes;
                hero.$element = $hero;
                heroes.push( hero );                 
                heroCounter++;
            }
        }    
    }
}

function initUnits() {
    units = [
        {
            'id' : 0,
            'type' : 'hero',        
            'name' : 'Astral Mage',
            'imagePath' : '/images/heroes/astral_mage.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 6,
            'currentAP' : 6,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7
        },
        {
            'id' : 1,
            'type' : 'hero',        
            'name' : 'Air Mage',
            'imagePath' : '/images/heroes/air_mage.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 7,
            'currentAP' : 7,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7
        },
        {
            'id' : 2,
            'type' : 'hero',        
            'name' : 'Fire Mage',
            'imagePath' : '/images/heroes/fire_mage.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 5,
            'currentAP' : 5,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7 
        },
        {
            'id' : 3,
            'type' : 'hero',        
            'name' : 'Water Mage',
            'imagePath' : '/images/heroes/water_mage.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 5,
            'currentAP' : 5,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7
        },
        {
            'id' : 4,
            'type' : 'hero',        
            'name' : 'Earth Mage',
            'imagePath' : '/images/heroes/earth_mage.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 2,
            'currentAP' : 2,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7
        },
        {
            'id' : 5,
            'type' : 'hero',        
            'name' : 'White Mage',
            'imagePath' : '/images/heroes/white_mage.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 4,
            'currentAP' : 4,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7 
        },
        {
            'id' : 6,
            'type' : 'hero',        
            'name' : 'Black Mage',
            'imagePath' : '/images/heroes/black_mage.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 4,
            'currentAP' : 4,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7 
        },
        {
            'id' : 7,
            'type' : 'hero',        
            'name' : 'Summoner Mage',
            'imagePath' : '/images/heroes/summoner_mage.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 5,
            'currentAP' : 5,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7 
        },
        {
            'id' : 8,
            'type' : 'hero',        
            'name' : 'Bowman',
            'imagePath' : '/images/heroes/bowman.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 5,
            'currentAP' : 5,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7
        },
        {
            'id' : 9,
            'type' : 'hero',        
            'name' : 'Shieldman',
            'imagePath' : '/images/heroes/shieldman.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 3,
            'currentAP' : 3,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7
        },
        {
            'id' : 10,
            'type' : 'hero',        
            'name' : 'Swordman',
            'imagePath' : '/images/heroes/swordman.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 4,
            'currentAP' : 4,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7
        },
        {
            'id' : 11,
            'type' : 'hero',        
            'name' : 'Daggerman',
            'imagePath' : '/images/heroes/daggerman.jpg', 
            'team' : undefined,  
            'indexes' : { x : undefined, y : undefined },
            'baseHP' : 7,
            'currentHP' : 7,
            'baseAP' : 5,
            'currentAP' : 5,
            'baseDamage' : 7,
            'currentDamage' : 7,
            'baseAttackDistance' : 7,
            'currentAttackDistance' : 7
        }
    ];
}