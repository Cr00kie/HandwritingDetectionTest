/**
 * Interactive horizontal slider UI component for adjusting normalized values (0–1).
 * Can be used for volume, brightness, or other adjustable settings.
 *
 * @class
 * @category UI
 * @extends Phaser.GameObjects.Container
 * @param {Phaser.Scene} scene - The Phaser scene this slider belongs to.
 * @param {number} x - The x-coordinate of the slider's position.
 * @param {number} y - The y-coordinate of the slider's position.
 * @param {number} [width=200] - The width of the slider track.
 * @param {number} [height=20] - The height of the slider.
 * @param {number} [initialValue=0.5] - The initial value of the slider (from 0 to 1).
 * @param {Phaser.GameObject} [track=Phaser.Geom.Rectangle] - The game object used as a track
 * @param {Phaser.GameObject} [thumb=Phaser.Geom.Circle] - The game object used as the slider thumb
 *
 * @example
 * const slider = new Slider(this, 400, 300, 250, 20, 0.3)
 *     .on("slider-changed", (value) => console.log("Slider value:", value));
 */
export default class Slider extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width = 200, height = 20, initialValue = 0.5, track = null, thumb = null) {
        super(scene, x, y);

        /**
         * Reference to the Phaser scene this slider belongs to.
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        /**
         * Width of the slider track.
         * @type {number}
         */
        this.width = width;

        /**
         * Height of the slider track.
         * @type {number}
         */
        this.height = height;

        /**
         * Current normalized value of the slider (0–1).
         * @type {number}
         */
        this.value = Phaser.Math.Clamp(initialValue, 0, 1);

        /**
         * Whether the user is currently dragging the thumb.
         * @type {boolean}
         */
        this.isDragging = false;

        /**
         * Background track of the slider.
         * @type {Phaser.GameObjects.Rectangle}
         */
        this.track = track || scene.add.rectangle(0, 0, width, height, 0x999999).setOrigin(0.5);
        this.add(this.track);

        /**
         * Movable thumb handle of the slider.
         * @type {Phaser.GameObjects.Rectangle}
         */
        this.thumb = thumb || scene.add.circle(0, 0, height/2, 0xFFFFFF).setOrigin(0.5);
        this.add(this.thumb);

        // Enable mouse input
        this.setSize(width, height);
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, -height / 2, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        // Update thumb position to initial value
        this.updateThumbPosition();

        // Pointer events
        this.scene.input.on("pointerdown", this.onPointerDown, this);
        this.scene.input.on("pointerup", this.onPointerUp, this);
        this.scene.input.on("pointermove", this.onPointerMove, this);

        scene.add.existing(this);
    }

    /**
     * Adds custom interactive logic to the slider.
     * Useful for additional event binding or UI customization.
     * 
     * @param {Function} setupFunction - A setup function receiving the slider instance.
     * @returns {Slider} This slider instance (for chaining).
     */
    addInteraction(setupFunction) {
        if (typeof setupFunction === "function") {
            setupFunction(this);
        }
        return this;
    }

    /**
     * Handles pointer down event.
     * Starts dragging if pointer is within slider bounds.
     * 
     * @param {Phaser.Input.Pointer} pointer - The pointer event.
     * @returns {void}
     */
    onPointerDown(pointer) {
        const bounds = this.getBounds();
        if (this.active && bounds.contains(pointer.x, pointer.y)) {
            this.isDragging = true;
            this.updateValueFromPointer(pointer);
        }
    }

    /**
     * Handles pointer up event.
     * Stops dragging.
     * 
     * @param {Phaser.Input.Pointer} pointer - The pointer event.
     * @returns {void}
     */
    onPointerUp(pointer) {
        this.isDragging = false;
    }

    /**
     * Handles pointer move event.
     * Updates slider value while dragging.
     * 
     * @param {Phaser.Input.Pointer} pointer - The pointer event.
     * @returns {void}
     */
    onPointerMove(pointer) {
        if (this.active && this.isDragging) {
            this.updateValueFromPointer(pointer);
        }
    }

    /**
     * Updates slider value based on pointer position.
     * Emits a "slider-changed" event when the value updates.
     * 
     * @param {Phaser.Input.Pointer} pointer - The pointer event.
     * @returns {void}
     */
    updateValueFromPointer(pointer) {
        const localX = Phaser.Math.Clamp(pointer.x - (this.x - this.width / 2), 0, this.width);
        const localY = Phaser.Math.Clamp(pointer.y - (this.y - this.width / 2), 0, this.width);

        this.value = (localX*Math.cos(this.rotation)+localY*Math.sin(this.rotation)) / this.width;
        this.updateThumbPosition();
        this.invokeChange();
    }

    /**
     * Updates thumb position visually according to current value.
     * @returns {void}
     */
    updateThumbPosition() {
        this.thumb.x = (this.value - 0.5) * this.width;
    }

    /**
     * Sets slider value manually and updates thumb position.
     * @param {number} value - The new slider value (0–1).
     * @returns {void}
     */
    setValue(value) {
        this.value = Phaser.Math.Clamp(value, 0, 1);
        this.updateThumbPosition();
    }

    /**
     * Returns current slider value.
     * @returns {number} The current slider value (0–1).
     */
    getValue() {
        return this.value;
    }

    /**
     * Emits a "slider-changed" event with the new value.
     * @event Slider#slider-changed
     * @type {number}
     * @returns {void}
     */
    invokeChange() {
        this.emit("slider-changed", this.value);
    }
}