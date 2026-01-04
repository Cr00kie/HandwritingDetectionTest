class Line{
    origin; angle; length;
    constructor(origin, angle, length){ this.origin = origin; this.angle = angle; this.length = length;}
}

class Stroke{
    #lines;
    #length;
    constructor(){
        this.#lines = [];
        this.#length = 0;
    }
    addLine(line){
        this.#length += line.length;
        this.#lines.push(line);
    }
    getLines(){
        return this.#lines;
    }
    getLength(){
        return this.#length;
    }
    printStroke(){
        console.log("Stroke length: ", this.#length);
        for(let line of this.#lines){
            console.log(`x: ${line.origin.x}, y: ${line.origin.y}, angle: ${Phaser.Math.RadToDeg(line.angle)}deg`);
        }
    }
}

export class StrokeParser {
    #isDrawing = false;
    #previousDetectionPoint = new Phaser.Math.Vector2(0,0);
    #currentLine;
    #currentStroke;
    #turnDetectionMargin = 0.8;
    #strokes;

    
    #debugLine;
    #angleText;

    constructor(scene){
        this.scene = scene;
    }

    startReading(){
        this.#strokes = [];
        this.scene.input.on("pointerdown", this.onPointerDown, this);
        this.scene.input.on("pointermove", this.onPointerMove, this);
        this.scene.input.on("pointerup", this.onPointerUp, this);
    }

    stopReading(){
        this.scene.input.off("pointerdown", this.onPointerDown, this);
        this.scene.input.off("pointermove", this.onPointerMove, this);
        this.scene.input.off("pointerup", this.onPointerUp, this);
        return this.#strokes;
    }

    onPointerDown(pointer, currentlyOver){
        this.#isDrawing = true;
        this.#currentLine = new Line(new Phaser.Math.Vector2(pointer.x, pointer.y), undefined, 0);
        this.#previousDetectionPoint.set(pointer.x, pointer.y);
        this.#currentStroke = new Stroke();

        // Debug (add initial circle and initial line)
        this.scene.add.circle(this.#currentLine.origin.x, this.#currentLine.origin.y, 5, 0x0000FF).setDepth(10);
        this.#debugLine = this.scene.add.rectangle(pointer.x, pointer.y, 0, 2.5, 0xFFFFFF).setOrigin(0, 0.5);
        // Add text with
        this.#angleText = this.scene.add.text(pointer.x, pointer.y, "Not moved");
    }

    onPointerMove(pointer, currentlyOver){
        if(this.#isDrawing && Phaser.Math.Distance.Between(pointer.x, pointer.y, this.#previousDetectionPoint.x, this.#previousDetectionPoint.y) > 20){
            // Only check if angle has changed if there is movement since previous point
            let angleDetectionChanged = false;

            // Update current line length
            this.#currentLine.length = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.#currentLine.origin.x, this.#currentLine.origin.y);
            // Update final line angle to the angle between origin of the line and pointer
            this.#currentLine.angle = Phaser.Math.Angle.Between(pointer.x, pointer.y, this.#currentLine.origin.x, this.#currentLine.origin.y)
            // IDK how to do this otherwise (if the angle is to the right, use absolute values so that it is continuous when passing from 180 to -180)
            if(Math.abs(this.#currentLine.angle) > 2.6) this.#currentLine.angle = Math.abs(this.#currentLine.angle);
                
            // Update debug angle text
            this.#angleText.setText(Math.round(Phaser.Math.RadToDeg(this.#currentLine.angle)));

            // Check if angle has changed over margin allowed
            // Get angle from previous point and current point (we want to check if the angel between the previous point and the current one has changed dramatically)
            let angle = Phaser.Math.Angle.Between(pointer.x, pointer.y, this.#previousDetectionPoint.x, this.#previousDetectionPoint.y); 
            // IDK how to do this otherwise (if the angle is to the right, use absolute values so that it is continuous when passing from 180 to -180)
            if(Math.abs(angle) > 2.6) angle = Math.abs(angle);
            // console.log(`${this.#initialStrokeAngle + this.#turnDetectionMargin} | ${angle} | ${this.#initialStrokeAngle - this.#turnDetectionMargin}`);

            // If there was no previous angle we just set the previous angle
            if(this.#currentLine.angle == undefined){
                this.#currentLine.angle = angle;
            }
            // Check if the angle is above or bellow the limit
            else if(this.#currentLine.angle + this.#turnDetectionMargin < angle || this.#currentLine.angle - this.#turnDetectionMargin > angle){
                // console.log(`${this.#currentLine.angle} + ${this.#turnDetectionMargin} < ${angle} || ${this.#currentLine.angle} - ${this.#turnDetectionMargin} > ${angle}`)
                angleDetectionChanged = true;
                // Register line in stroke
                this.#currentStroke.addLine(this.#currentLine);

                // Reset line
                this.#currentLine = new Line(new Phaser.Math.Vector2(pointer.x, pointer.y), angle, 0);

                // Debug (Reset line and add text with new angle)
                this.#debugLine = this.scene.add.rectangle(pointer.x, pointer.y, 0, 2.5, 0xFFFFFF).setOrigin(0, 0.5);
                this.#angleText = this.scene.add.text(pointer.x, pointer.y, Math.round(Phaser.Math.RadToDeg(angle)));
            }

            // Add detection circle and update line
            this.scene.add.circle(pointer.x, pointer.y, 5, angleDetectionChanged?0x00FF00:0xFFFFFF).setDepth(angleDetectionChanged?10:1).setAlpha(0.5);
            this.#debugLine.width = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.#currentLine.origin.x, this.#currentLine.origin.y);
            this.#debugLine.setRotation(Phaser.Math.Angle.Between(pointer.x, pointer.y, this.#currentLine.origin.x, this.#currentLine.origin.y) + Math.PI);

            // Set previous point as this point to calculate next angle
            this.#previousDetectionPoint.set(pointer.x, pointer.y);
        }

    }

    onPointerUp(pointer){
        // Register last line in stroke
        this.#currentStroke?.addLine(this.#currentLine);

        // Register stroke
        this.#strokes.push(this.#currentStroke);
        // console.log(this.#strokes);

        if(this.#strokes.length > 1){
            console.log(this.areStrokesEqual(this.#strokes[this.#strokes.length-1], this.#strokes[this.#strokes.length-2]));
        }

        this.#isDrawing = false;
        // Draw end circle
        this.scene.add.circle(pointer.x, pointer.y, 5, 0xFF0000).setDepth(10);
    }

    areStrokesEqual(stroke1, stroke2){
        if(!stroke1 || !stroke2) return !stroke1 && !stroke2;
        const stroke1Lines = stroke1.getLines();
        const stroke2Lines = stroke2.getLines();

        // Check if they have the same number of lines
        if(stroke1Lines.length != stroke2Lines.length) return false;
        
        for(let i = 0; i < stroke1Lines.length; i++){
            console.log(`Comparing line ${i}, diff: ${Math.abs(stroke1Lines[i].angle - stroke2Lines[i].angle)} -> ${(Math.abs(stroke1Lines[i].angle - stroke2Lines[i].angle) > 0.35)?"Doesn't comply":"Complies"}`)
            if(Math.abs(stroke1Lines[i].angle - stroke2Lines[i].angle) > 0.35) return false;
        }

        return true;
    }
}