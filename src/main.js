import { Gameplay } from "./scenes/gameplay.js";
import { MainMenu } from "./scenes/mainMenu.js";

// == GAME CONFIG ==
const config = {
    // -- GENERAL PROYECT CONFIG -- 
    title: 'Test', // Title of the game shown in browser console
    version: '0.0', // Game version
    // url: , // The URL of the game


    // -- RENDERER CONFIG --
    type: Phaser.AUTO,
    pixelArt: true, // Set renderer config for pixel art
	transparent: false,
    //backgroundColor: , // Default game background color (can be changed for each camera)
    zoom: 1, // scale applied to the game canvas


    // -- HTML CONFIG --
    parent: 'game-container',
    scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		mode: Phaser.Scale.FIT, // Adapt to available space
		width: 800, // width in px
		height: 600, // height in px
		zoom: 1 // canvas applied scale
	},


    // -- PHYSICS CONFIG --
    physics: {
        default: 'arcade', // You should only need arcade in exam
        // Arcade physics settings
		arcade: { 
			x: 0, // x coord of world bounds
			y: 0, // y coord of world bounds
			width: 800,// width of world bounds
			height: 600,// height of world bounds
			gravity: { y: 5000 }, // Physics gravity
			debug: true // Should render debug shapes
		},
		checkCollision: {
			up: true,
			down: true,
			left: true,
			right: true
		}
    },


    // -- GAME SCENES --
    scene: [MainMenu, Gameplay],


    // -- GAME PLUGINS --
    plugins: {
        global: [
            // If using the sound facade plugin uncomment this line
            //{key: 'soundfacade', plugin: SoundSceneFacade, start: true}
        ]
    },
}

// == GAME INIT ==
new Phaser.Game(config);