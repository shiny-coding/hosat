class Cell {
    constructor(
        id,
        position,
        $cell
    ) {
        this.id = id;
        this.position = position;
        this.isAvailable = false;
        this.isPathCell = false;
        this.$element = $cell;
        this.$element.click( this.onCellClick );
    }

    static cells = [];
    // static $cells = $( '.cell' );
    static $cells; //$( '.cell' );

    /**
     * @param {Cell} cell
     */
    static createCells() {
        for ( let row = 0; row < Board.ROWS; row++ ) {
            Board.$element.append( $( `<div class="row" id="row-${row}">` ) );
        }

        let cellCounter = 0;
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

                Cell.cells.push( cell );
                let cellSize = vmin2px( 100 / Board.ROWS );
                cell.$element.css( 'width', cellSize + 'px' );
                cell.$element.css( 'height', cellSize + 'px' );
                Cell.setCellElementSize( cell );
                cellCounter++;
            }
        }

        Cell.$cells = $( '.cell' );
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
     * @param {Cell} cell
     */
    static getCellByElement( $cell ) {
        for ( let cell of Cell.cells ) {
            if ( cell.$element.is( $cell ) ) {
                return cell;
            }
        }
    }

    onCellClick( event ) {
        if ( Game.game.teamChooseFase || Game.game.isSelectionBlocked ) return;

		let $cell = $( this );
        let cell = Cell.getCellByElement( $cell );

		let canPerformAction = $cell.hasClass( 'attackable' ) || $cell.hasClass( 'enhanceable' )
		if ( Action.selectedAction && canPerformAction ) {
			Action.selectedAction.do( cell );
			return;
		}

        let unit = Unit.selectedUnit;
        if ( !unit ) return;

        if ( cell.isPathCell ) {
            unit.animateMoveByPath();
        } else if ( cell.isAvailable ) {
            for ( let cell of Cell.cells ) {
                cell.isPathCell = false;
            }

            Cell.$cells.removeClass( 'path-cell' );
            unit.drawMovePath( $cell );
        }
    }
}