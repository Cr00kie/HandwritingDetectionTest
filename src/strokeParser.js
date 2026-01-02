export class StrokeParser {
    #isDrawing = false;
    #previousStrokePoint = new Phaser.Math.Vector2(0,0);
    #originPoint = new Phaser.Math.Vector2(0,0);
    #debugLine;
    #initialStrokeAngle = undefined;
    #turnDetectionMargin = 0.8;

    constructor(scene){
        this.scene = scene;
    }

    startReading(){
        this.scene.input.on("pointerdown", this.onPointerDown, this);
        this.scene.input.on("pointermove", this.onPointerMove, this);
        this.scene.input.on("pointerup", this.onPointerUp, this);
    }

    stopReading(){
        this.scene.input.off("pointerdown", this.onPointerDown, this);
        this.scene.input.off("pointermove", this.onPointerMove, this);
        this.scene.input.off("pointerup", this.onPointerUp, this);
    }

    onPointerDown(pointer, currentlyOver){
        this.#isDrawing = true;
        this.#originPoint.set(pointer.x, pointer.y);
        this.#previousStrokePoint.set(pointer.x, pointer.y);
        this.scene.add.circle(this.#originPoint.x, this.#originPoint.y, 5, 0x0000FF).setDepth(10);
        this.#initialStrokeAngle = undefined;
        this.#debugLine = this.scene.add.rectangle(pointer.x, pointer.y, 0, 2.5, 0xFFFFFF).setOrigin(0, 0.5);
    }

    onPointerMove(pointer, currentlyOver){
        if(this.#isDrawing && Phaser.Math.Distance.Between(pointer.x, pointer.y, this.#previousStrokePoint.x, this.#previousStrokePoint.y) > 20){
            // Only check if angle has changed if there is movement since previous point
            let angleDetectionChanged = false;
            // Check if angle has changed over margin allowed
            // Get angle from previous point and current point
            let angle = Phaser.Math.Angle.Between(pointer.x, pointer.y, this.#previousStrokePoint.x, this.#previousStrokePoint.y); 
            // IDK how to do this otherwise (if the angle is to the write, use absolute values so that it is continuous when passing from 180 to -180)
            if(Math.abs(angle) > 2.6) angle = Math.abs(angle);
            // console.log(`${this.#initialStrokeAngle + this.#turnDetectionMargin} | ${angle} | ${this.#initialStrokeAngle - this.#turnDetectionMargin}`);

            // If there was no previous angle we just set the previous angle
            if(this.#initialStrokeAngle == undefined){
                this.#initialStrokeAngle = angle;
                this.scene.add.text(pointer.x, pointer.y, Math.round(Phaser.Math.RadToDeg(angle)));
            }
            // Check if the angle is above or bellow the limit
            else if(this.#initialStrokeAngle + this.#turnDetectionMargin < angle || this.#initialStrokeAngle - this.#turnDetectionMargin > angle){
                angleDetectionChanged = true;
                this.#initialStrokeAngle = angle;
                // console.log('angle changed', this.#initialStrokeAngle);
                this.#originPoint.set(pointer.x, pointer.y);
                this.#debugLine = this.scene.add.rectangle(pointer.x, pointer.y, 0, 2.5, 0xFFFFFF).setOrigin(0, 0.5);
                this.scene.add.text(pointer.x, pointer.y, Math.round(Phaser.Math.RadToDeg(angle)));
            }

            
            this.scene.add.circle(pointer.x, pointer.y, 5, angleDetectionChanged?0x00FF00:0xFFFFFF).setDepth(angleDetectionChanged?10:1).setAlpha(0.5);
            this.#debugLine.width = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.#originPoint.x, this.#originPoint.y);
            this.#debugLine.setRotation(Phaser.Math.Angle.Between(pointer.x, pointer.y, this.#originPoint.x, this.#originPoint.y) + Math.PI);

            // Set previous point as this point to calculate next angle
            this.#previousStrokePoint.set(pointer.x, pointer.y);
        }

    }

    onPointerUp(pointer){
        this.#isDrawing = false;
        this.scene.add.circle(pointer.x, pointer.y, 5, 0xFF0000).setDepth(10);
    }
}