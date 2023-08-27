import express from 'express';
import bodyParser from "body-parser";
import { Collection } from "mongodb";
import { Hero } from "./model.js";
import { connectToDatabase, db } from "./database.js"
import * as dotenv from "dotenv";

import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';

import multer from 'multer';
const upload = multer({ dest: "uploads/" });

dotenv.config();

const router = express.Router();
router.use( express.json() );

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: '*' }));

app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

const PORT = process.env.PORT || 3001;

async function main() {

	await connectToDatabase().catch( (error) => {
		console.error( "Database connection failed", error );
		process.exit();
	});

	let heroesCollection = db.collection( 'Heroes' );
	let actionsCollection = db.collection( 'Actions' );


	app.listen( PORT, () => {
		console.log(`Server started at http://localhost:${PORT}`);
	} );

	app.get( "/info", ( request, response ) => {
		response.json( { result : true } );
	} );

	app.get( "/library", async ( request, response ) => {
		let heroesCursor = heroesCollection.find( {} );
		let heroes = [];
		for await ( const hero of heroesCursor ) {
			heroes.push( hero );
		}
		let actionsCursor = await actionsCollection.find( {} );
		let actions = [];
		for await ( const action of actionsCursor ) {
			actions.push( action );
		}
		response.json( { result : true, heroes, actions } );
	} );

	app.post( "/login_or_register", async ( request, response ) => {

		let { username, passwordHash } = request.body;
		// if ( username.trim() == '' ) {
		// 	response.status( 403 ).json( {
		// 		result : false,
		// 		error: "empty username"
		// 	} );
		// 	return;
		// }
		let account = await accounts.findOne( { username } );
		if ( account == null ) {
			account = {
				username,
				passwordHash,
				tracks : []
			};
			let insertOne = await accounts.insertOne( account );
			account._id = insertOne.insertedId;
		} else {
			if ( account.passwordHash != passwordHash ) {
				response.status( 403 ).json( {
					result : false,
					error: "wrong password"
				} );
				return;
			}
		}
		console.log( account );
		response.json( { result : true, account } );
	});

	app.post( "/update", async ( request, response ) => {
		let { username, passwordHash } = request.body;
		let tracks = request.body.tracks;
		let updateOne = await accounts.updateOne( { username, passwordHash }, {
			$set : { tracks }
		});

		response.json( { result : updateOne.matchedCount != 0 } );
	});

	app.post( "/changeImage", upload.single( 'file' ), async ( request, response ) => {

		try {

			let targetPath = '../client/images/heroes/' + request.file.originalname;
			if ( fs.existsSync( targetPath ) ) {
				fs.unlinkSync( targetPath );
			}
			fs.renameSync( request.file.path, targetPath );
			let { heroName } = request.body;

			let updateOne = await heroesCollection.updateOne( { name: heroName }, {
				$set : { image: request.file.originalname }
			});

			response.json( { result : updateOne.matchedCount != 0 } );

		} catch ( exception ) { next( exception ); }
	});

	app.use( ( err, req, res, next ) => {
		res.status(500).json( { error: true, err } );
	});
};

main();