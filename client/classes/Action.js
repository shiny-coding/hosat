class Action {
	static selectedAction = null;

    constructor( $element ) {

        this.$element = $element;
        $element.click( this.onActionClick );

        // $( 'body' ).on( 'click', '.action', onActionClick );
    }

    static actions = [];
    static $actions = $( '.action' );

    static createActions( actionsDatas ) {
        let actions = [];
		let $unitActions = $( '#unit-actions' );
		actionsDatas.push( { name: 'Change Image' } );
        for ( let actionData of actionsDatas ) {

			let $actionBody = $( `<div class="description"> </div>` );

			if ( actionData.name == 'Heal' ) {
				$actionBody.append( `Power: ${actionData.power}<br>` );
			} else {
				$actionBody.append( `Damage: ${actionData.damage}<br>` );
			}
			$actionBody.append( `Distance: ${actionData.distance}<br>` );

			if ( actionData.name == 'Change Image' ) {
				$actionBody = $( '<input type="file" name="image" accept="image/png, image/jpeg">' );
			}
			let $element = $( `
				<div class="action" data-name="${actionData.name}">
					<div class="head">
						<img src="/images/actions/${actionData.image}" >
						<div class="name">${actionData.name}</div>
					</div>
				</div>`
			);

			$element.append( $actionBody );

			if ( actionData.name == 'Change Image' ) {
				$element.find( 'input' ).change( this.changeImage );
			}

			$element.hide();
            let action = new Action( $element );
			Object.assign( action, actionData );

            actions.push( action );
			$unitActions.append( $element );
        }

		$unitActions.hide();

		Action.actions = actions;
        return actions;
    }

    static getActionById( actionId ) {
        for ( let action of Action.actions ) {
            if ( action.id == actionId ) {
                return action;
            }
        }
    }

    static getActionByElement( $action ) {
        for ( let action of Action.actions ) {
            if ( action.name == $action.data( 'name' ) ) {
                return action;
            }
        }
    }

    onActionClick() {
        let $action = $( this );
        let action = Action.getActionByElement( $action );
		Action.selectedAction = action;

		$action.toggleClass( 'selected' );

		let $unitActions = $( '#unit-actions' );
		$unitActions.find( '.action' ).not( $action ).removeClass( 'selected' );

		if ( $action.hasClass( 'selected' ) ) {
			action.updateTargets();
			action.refresh();
		} else {
			Unit.updateInfoPanel( Unit.selectedUnit );
		}
    }

	refresh() {
		this.$element.toggleClass( 'inactive', !this.isActive() );

		this.updateTargets();
		for ( let unit of Unit.units ) {
			unit.updateBars();
		}

		Unit.updateInfoPanel( Unit.selectedUnit );
	}

	isActive() {
		let selectedUnit = Unit.selectedUnit;
		return selectedUnit.actionPoints >= this.actionPoints && selectedUnit.manaPoints >= this.manaPoints;
	}

	updateTargets() {

		for ( let unit of Unit.units ) {
			unit.$element.removeClass( 'attackable' );
			unit.$element.removeClass( 'enhanceable' );
		}
		for ( let cell of Cell.cells ) {
			cell.$element.removeClass( 'attackable' );
		}

		if ( this.$element.hasClass( 'inactive' ) ) return;

		let selectedUnit = Unit.selectedUnit;

		let targets = Array.isArray( this.target ) ? this.target : [ this.target ];

		for ( let target of targets ) {
			if ( target == "Cell" || target == "Enemy" || target == "Ally" ) {

				for ( let unit of Unit.units ) {
					if ( this.target == "Enemy" && unit.team == selectedUnit.team ) continue;
					if ( this.target == "Ally" && unit.team != selectedUnit.team ) continue;

					if ( distance( unit.position, selectedUnit.position ) > this.distance ) continue;

					if ( this.type == "Damage" ) {
						unit.$element.addClass( 'attackable' );
					} else if ( this.type == "Enhancement" ) {

						let allowed = true;
						if ( this.name == 'Heal' ) {
							if ( unit.healthPoints >= unit.defaultState.healthPoints ) {
								allowed = false;
							}
						}
						if ( allowed ) {
							unit.$element.addClass( 'enhanceable' );
						}
					}
				}
			}

			if ( target == "Cell" || target == "Empty_Cell"  ) {
				for ( let cell of Cell.cells ) {
					if ( target == "Empty_Cell" ) {
						let isEmptyCell = Unit.units.every( unit => distance( unit.position, cell.position ) > 0 );
						if ( !isEmptyCell ) continue;
					}
					if ( distance( cell.position, selectedUnit.position ) <= this.distance ) {

						if ( this.type == "Damage" ) {
							cell.$element.addClass( 'attackable' );
						} else if ( this.type == "Enhancement" ) {
							cell.$element.addClass( 'enhanceable' );
						}
					}
				}
			}
		}
	}

	do( target ) {

		if ( target instanceof Cell ) {
			console.log( `doing ${this.name} on cell` );
		} else {
			console.log( `doing ${this.name} on unit` );
		}

		if ( this.name == 'Fireball' ) {
			this.doFireball( target );
		} else if ( this.name == 'Heal' ) {
			this.doHeal( target );
		} else if ( this.name == 'Summon Wolf' ) {
			this.doSummonWolf( target );
		}

		let selectedUnit = Unit.selectedUnit;

		selectedUnit.actionPoints -= this.actionPoints;
		selectedUnit.manaPoints -= this.manaPoints;

		this.refresh();
		this.updateTargets();
		//Unit.updateInfoPanel( selectedUnit );
	}

	doFireball( target ) {

		let targetPosition = target.position;
		let area = this.area;

		for ( let y=targetPosition.y-area; y<=targetPosition.y+area; y++ ) {
			for ( let x=targetPosition.x-area; x<=targetPosition.x+area; x++ ) {
				let position = { x, y };
				if ( !isOnBoard( position ) ) continue;

				let targetUnit = Unit.units.find( u => positionsEqual( u.position, position ) );
				if ( targetUnit ) {
					targetUnit.healthPoints -= this.damage;
					console.log( 'damaging unit ' + targetUnit.name );
				}
			}
		}
	}

	doHeal( target ) {

		let targetPosition = target.position;
		let targetUnit = Unit.units.find( u => positionsEqual( u.position, targetPosition ) );
		targetUnit.healthPoints += this.power;
		console.log( 'healing unit ' + targetUnit.name );
	}

	doSummonWolf( target ) {

		let wolfUnit = Unit.unitsLibrary.find( u => u.name == 'Wolf' );
		Unit.createUnit( wolfUnit, target.position, Unit.selectedUnit.team );
		console.log( 'summoned wolf' );
	}


	static async changeImage() {
		let $imageFile = $( this );
		let formData = new FormData();
		let heroName = Unit.selectedUnit.name;
		formData.append( "file", $imageFile[ 0 ].files[0] );
		formData.append( "heroName", heroName );
		await fetch( SERVER_URL + '/changeImage', {
			method: "POST",
			body: formData
		});
	}
}
