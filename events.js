function onHeroClick( e ) {
    let $hero = $( this );
    let hero = getHeroByElement( $hero );

    choosenHeroId = hero.id;
    describeHero( choosenHeroId );
    calculateHeroPathMap( choosenHeroId );
    drawHeroPathMap( choosenHeroId );
}

function onCellClick() {
    // if ( selectionBlocked ) return;
        
    let $cell = $( this ); 
    cell = getCell( $cell ); 
}