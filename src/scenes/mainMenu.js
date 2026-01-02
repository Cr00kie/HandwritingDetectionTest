import Button from "../UI/Button.js";

export class MainMenu extends Phaser.Scene{
    constructor(){
        super({ key: "mainmenu" });
    }

    // Configure scene cycle
    init(data){}

    // Queue assets for downloading
    preload(){
        this.load.image("bgImage", "<path>");
        
        this.load.audio("menuMusic", "<path>");
    }

    // Create game objects with loaded assets
    create(data){
        // TITULO Y FONDO
        this.BG = this.add.image(0,0,"bgImage").setOrigin(0);
        this.title = this.add.text(this.scale.width/2, 300, "GAME TITLE", {
            fontFamily: "",
            fontSize: 40
        }).setOrigin(0.5);

        // BOTONES
        this.button1 = new Button(this, this.scale.width/2, 350, 80, 20, {
            text: "BUTTON 1", offsetX:0.5, offsetY:0.5,
            style:{fontFamily: "", fontSize: 20}
        }).addInteraction((btn)=>{
            btn.on("pointerdown", ()=>{this.scene.start('gameplay')})
        })

        this.button2 = new Button(this, this.scale.width/2, this.button1.y+50, 80, 20, {
            text: "BUTTON 2", offsetX:0.5, offsetY:0.5,
            style:{fontFamily: "", fontSize: 20}
        }).addInteraction((btn)=>{
            btn.on("pointerdown", ()=>{console.log("button 2")})
        })

        // MUSICA
        // this.sound.play("menuMusic", {loop: true});
    }

    // Work on game objects at each game step
    update(t, dt){}
}