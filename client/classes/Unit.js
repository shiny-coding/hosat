class Unit {
	constructor( position, team, $unit ) {

		this.position = position;
		this.usedTurn = false;
		this.movePath = undefined;
		this.team = team;
		this.pathMap = [];
		this.$element = $unit;
		this.$element.click( this.onUnitClick );
	}

	static units = [];
	static unitsLibrary = [];

	static $units = $( '.unit' );
	static selectedUnit = null;

	static createUnit( hero, position, team ) {
		let $element = $(
			`<div class="unit team${team}">
				<div class="health-bar"></div>
				<div class="mana-bar"></div>
			</div>` );
		Board.$element.append( $element );

		let actions = Action.actions.filter( action => hero.actions.includes( action.name ) )
		actions = Action.actions;

		let unit = new Unit( position, team, $element );
		Object.assign( unit, hero, { actions } );
		unit.defaultState = hero;

		Unit.units.push( unit );
		Unit.setUnitElementSize( unit );
		Unit.setUnitElementPosition( unit );
		Unit.setUnitBackground( unit );
		unit.$element.attr( 'name', hero.name );
		unit.updateBars();

		$element.data( 'unit', unit );

		return unit;
	}

	static createUnits( gameData ) {
		let randomHeroesIndexes = [ ...Array( gameData.heroes.length ).keys() ]; //shuffle( [ ...Array( gameData.heroes.length ).keys() ] );
		let randomHeroesTeams = shuffle( [  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1 ] );
		let unitCounter = 0;

		Unit.unitsLibrary = gameData.heroes;

		for ( let row = 0; row < Board.ROWS; row++ ) {
			for ( let column = 0; column < Board.COLUMNS; column++ ) {
				if ( column % ( Board.NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
					row % ( Board.NUMBER_OF_CELLS_BETWEEN_HEROES + 1 ) == 0 &&
					unitCounter < Board.NUMBER_OF_HEROES_IN_ROW * Board.NUMBER_OF_HEROES_IN_COLUMN ) {

					let heroIndex = randomHeroesIndexes[ unitCounter ];
					let hero = gameData.heroes[ heroIndex ];
					let heroPosition = { x: column, y: row };
					let team = randomHeroesTeams[ unitCounter ];
					let unit = Unit.createUnit( hero, heroPosition, team );

					unit.healthPoints--;
					unitCounter++;
				}
			}
		}

		Unit.selectTeam( Unit.units[ 0 ] );

		Unit.units[ 0 ].$element.trigger( 'click' );
		//Action.actions.find( a => a.name == 'Summon Wolf' ).$element.trigger( 'click' );
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
		let cellOffset = $( `#cell-${unit.position.x}-${unit.position.y}` ).offset();
		unit.$element.offset( { top: cellOffset.top, left: cellOffset.left } );
	}

	/**
	 * @param {Unit} unit
	 */
	static setUnitBackground( unit ) {
		let imagePath = 'url(/images/heroes/' + unit.image + ')';
		unit.$element.css( 'background-image', imagePath );
	}

	static updateInfoPanel( unit ) {
		let $unitStats = $( '#unit-stats' );
		if ( unit ) {
			$unitStats.empty();
			if ( Game.game.teamChooseFase ) {
				let $button = $( `<button id="select-team">Yes</button>` );
				$button.click( () => Unit.selectTeam( unit ) );
				$unitStats.prepend( `Do you want to play for ${ unit.team ? 'Light' : 'Dark' } Team?<br>` );
				$unitStats.append( $button );
				$unitStats.append( `<br><br>` );
			}
			$unitStats.append( `
				${unit.name}<br>
				<div id="action-points" class="attribute"><img src="/images/attributes/action_points_800_800.png">
					Action Points: ${unit.actionPoints} / ${unit.defaultState.actionPoints}
				</div>
				<div id="health-points" class="attribute"><img src="/images/attributes/health_points_1280_1280.png">
					Health Points: ${unit.healthPoints} / ${unit.defaultState.healthPoints}
				</div>
				<div id="damage-points" class="attribute"><img src="/images/attributes/melee_damage_800_800.png">
					Damage: ${unit.damage} / ${unit.defaultState.damage}
				</div>
				<div id="mana-points" class="attribute"><img src="/images/attributes/mana_points_512_512.png">
					Mana Points: ${unit.manaPoints} / ${unit.defaultState.manaPoints}
				</div>
				<div id="hit-range" class="attribute"><img src="/images/attributes/hit_range_500_500.png">
					Hit Range: ${unit.hitRange} / ${unit.defaultState.hitRange}
				</div>
			` );

			let $unitActions = $( '#unit-actions' );
			let hasSomeAction = false;
			$unitActions.find( '.action' ).each( function() {
				let $action = $( this );
				let actionName = $action.data( 'name' );
				let unitHasAction = !!unit.actions.find( action => action.name == actionName );
				hasSomeAction |= unitHasAction;
				if ( unitHasAction ) {
					$action.show();
				} else {
					$action.hide();
				}
			} );
			if ( hasSomeAction ) {
				$unitActions.show();
			} else {
				$unitActions.hide();
			}

		} else {
			$unitStats.html( '' );
		}
	}

	static selectTeam( unit ) {
		let team = unit.team;
		Game.game.currentTeam = team;
		Game.game.players[0].team = team;
		Game.game.players[1].team = !team;

		unit.showAvailableCells();
		Game.game.roundCount = 1;
		Game.game.turnCount = 1;
		Game.game.teamChooseFase = false;
		Game.game.updateTurnsInfoPanel();
		unit.markPossibleTargets();

		Unit.updateInfoPanel();
	}

	static getCurrentUnit() {
		return Unit.units.find(
				u => u.actionPoints < u.defaultState.actionPoints
		);
	}

	updateBars() {
		let $healthBar = this.$element.find( '.health-bar' );
		$healthBar.empty();
		for ( let i=0; i<this.defaultState.healthPoints; i++ ) {
			let active = this.healthPoints > this.defaultState.healthPoints - i - 1 ? 'active' : '';
			$healthBar.append( `<div class="health-point ${active}"></div>` );
		}

		let $manaBar = this.$element.find( '.mana-bar' );
		$manaBar.empty();
		for ( let i=0; i<this.defaultState.manaPoints; i++ ) {
			let active = this.manaPoints > this.defaultState.manaPoints - i - 1 ? 'active' : '';
			$manaBar.append( `<div class="mana-point ${active}"></div>` );
		}
	}

	showAvailableCells() {
		for ( let x = 0; x < Board.COLUMNS; x++ ) {
			this.pathMap[ x ] = [];
			for ( let y = 0; y < Board.ROWS; y++ ) {
				this.pathMap[ x ][ y ] = -1;
			}
		}

		for ( let iteratedUnit of Unit.units ) {
			this.pathMap[ iteratedUnit.position.x ][ iteratedUnit.position.y ] = -2;
		}

		this.pathMap[ this.position.x ][ this.position.y ] = 0;

		for ( let i = 1; i <= this.actionPoints; i++ ) {
			for ( let x = 0; x < Board.COLUMNS; x++ ) {
				for ( let y = 0; y < Board.ROWS; y++ ) {

					if ( this.pathMap[ x ][ y ] == i - 1 ) {
						for ( let x2 = x-1; x2 <= x+1; x2++ ) {
							for ( let y2 = y-1; y2 <= y+1; y2++ ) {

								if (    x2 >= 0 && x2 < Board.COLUMNS &&
										y2 >= 0 && y2 < Board.ROWS &&
										Math.abs( x - x2 ) + Math.abs( y - y2 ) <= 1 &&
										this.pathMap[ x2 ][ y2 ] == -1   ) {

									this.pathMap[ x2 ][ y2 ] = i;
								}
							}
						}
					}
				}
			}
		}

		for ( let cell of Cell.cells ) {
			cell.isAvailable = false;
		}

		for ( let cell of Cell.cells ) {
				if ( this.pathMap[ cell.position.x ][ cell.position.y ] > 0 ) {
					cell.isAvailable = true;
					cell.$element.addClass( 'available-cell' );
				}
		}
	}

	drawMovePath( $cell ) {
		let cellPosition = Cell.getCellByElement( $cell ).position;
		let unitPosition = this.position;
		let preferHorizontalMovement = Math.abs( cellPosition.x - unitPosition.x ) < Math.abs( cellPosition.y - unitPosition.y );
		let current = cellPosition; //TODO remove current ???
		let distance = this.pathMap[ cellPosition.x ][ cellPosition.y ];
		let currentDistance = distance; //TODO ???
		let movePath = [];

		while ( current.x != unitPosition.x || current.y != unitPosition.y ) {
			let stopSearch = false;
			let bestCandidate = null;

			for ( let x = current.x - 1; x <= current.x + 1; x++ ) {
				for ( let y = current.y - 1; y <= current.y + 1; y++ ) {
					if ( y < 0 || y > Board.ROWS - 1 || x < 0 || x > Board.COLUMNS - 1 ) continue;

					if ( this.pathMap[ x ][ y ] == currentDistance - 1 ) {
						let isHorizontalMovement = Math.abs( x - current.x ) != 0 && Math.abs( y - current.y ) == 0;
						bestCandidate = { x, y };

						if ( preferHorizontalMovement == isHorizontalMovement ) {
							stopSearch = true;
							break;
						}
					}
				}

				if ( stopSearch ) break;
			}

			current = bestCandidate;
			movePath.push( bestCandidate );
			currentDistance--;

			if ( currentDistance < 0 ) break;
		}

		movePath.reverse();
		movePath.shift();
		movePath.push( cellPosition );
		this.movePath = movePath;

		for ( let row = 0; row < Board.ROWS; row++ ) {
			for ( let column = 0; column < Board.COLUMNS; column++ ) {
				for ( let step of movePath ) {
					for ( let cell of Cell.cells ) {
						if ( cell.position.x == step.x && cell.position.y == step.y ) {
							cell.isPathCell = true;
							cell.$element.addClass( 'path-cell' );
						}
					}
				}
			}
		}
	}

	animateMoveByPath() {
		let nextCellPosition = this.movePath.shift();
		let $cell = $( `#cell-${nextCellPosition.x}-${nextCellPosition.y}` );
		let cellOffset = $cell.offset();
		this.actionPoints--;
		Game.game.$end.removeClass( 'end-red' );
		Game.game.$end.removeClass( 'end-green' );
		Game.game.$end.addClass( 'end-yellow' );
		Game.game.isSelectionBlocked = true;

		this.$element.animate( {
			left: cellOffset.left,
			top: cellOffset.top
		}, {
			duration: 500,
			easing: "linear",
			done: function() {
				this.position = nextCellPosition;
				Cell.$cells.removeClass( 'available-cell' );
				this.showAvailableCells();
				Unit.updateInfoPanel();
				$cell.removeClass( 'path-cell' );

				if ( this.movePath.length > 0 ) {
					this.animateMoveByPath();
					// this.markPossibleTargets();
				} else {
					Game.game.isSelectionBlocked = false;
					if ( this.actionPoints == 0 ) {
						this.usedTurn = true;
						this.$element.addClass( 'usedTurn' );
						Game.game.$end.removeClass( 'end-red' );
						Game.game.$end.removeClass( 'end-yellow' );
						Game.game.$end.addClass( 'end-green' );
					}
				}

				this.markPossibleTargets();
			}.bind( this )
		} );
	}

	markPossibleTargets() {
		for ( let unit of Unit.units ) {
			unit.$element.removeClass( 'attackable' );
		}

		if ( this == Unit.selectedUnit ) {
			for ( let unit of Unit.units ) {
				if ( unit.team == this.team ) continue;
				let dx = Math.abs( unit.position.x - this.position.x );
				let dy = Math.abs( unit.position.y - this.position.y );
				let distance = dx + dy;
				if ( this.hitRange >= distance ) {
					unit.$element.addClass( 'attackable' );
				}
			}
		}
	}

	onUnitClick() {
		if ( Game.game.isSelectionBlocked ) return;

		let $unit = $( this );
		let unit = $unit.data( 'unit' );

		if ( Action.selectedAction && Action.selectedAction.isActive() ) {
			if ( $unit.hasClass( 'attackable' ) || $unit.hasClass( 'enhanceable' ) ) {
				Action.selectedAction.do( unit );
			}
			return;
		}

		for ( let unit of Unit.units ) {
			unit.$element.removeClass( 'attackable' );
			unit.$element.removeClass( 'enhanceable' );
		}

		Unit.selectedUnit = unit;
		Unit.updateInfoPanel( unit );

		let currentUnit = Unit.getCurrentUnit();
		if ( Game.game.currentTeam == unit.team && !currentUnit && !unit.usedTurn ) {
			Cell.$cells.removeClass( 'available-cell' );
			unit.showAvailableCells();

			//unit.$element.addClass( 'current' );
			unit.markPossibleTargets();
		}
	}
}