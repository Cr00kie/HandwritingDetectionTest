import Phaser from "phaser";
import { StrokeParser } from "../strokeParser";

export class Gameplay extends Phaser.Scene{
    constructor(){
        super({ key: "gameplay" });
    }

    // Configure scene cycle
    init(data){}

    // Queue assets for downloading
    preload(){
        
    }

    // Create game objects with loaded assets
    create(data){
        const strokeParser = new StrokeParser(this);
        strokeParser.startReading();
    }

    // Work on game objects at each game step
    update(t, dt){}
}