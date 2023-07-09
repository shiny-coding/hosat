class Board {
    static $element = $( '#board' );
    static NUMBER_OF_HEROES_IN_ROW = 4;
    static NUMBER_OF_HEROES_IN_COLUMN = 3;
    static NUMBER_OF_CELLS_BETWEEN_HEROES = 4;
    static ROWS = ( Board.NUMBER_OF_HEROES_IN_COLUMN - 1 ) * Board.NUMBER_OF_CELLS_BETWEEN_HEROES + Board.NUMBER_OF_HEROES_IN_COLUMN;
    static COLUMNS = ( Board.NUMBER_OF_HEROES_IN_ROW - 1 ) * Board.NUMBER_OF_CELLS_BETWEEN_HEROES + Board.NUMBER_OF_HEROES_IN_ROW;
}