import Phaser from "phaser";
/**
 * A simple interactive text-based button component.
 * Displays a label and emits events when hovered or clicked.
 *
 * @class
 * @category UI
 * @extends Phaser.GameObjects.Image
 *
 * @param {Phaser.Scene} scene - The scene this button belongs to.
 * @param {number} x - The x-coordinate of the button's position.
 * @param {number} y - The y-coordinate of the button's position.
 * @param {number} width - Logical width used to layout children and interaction area.
 * @param {number} height - Logical height used to layout children and interaction area.
 * @param {Object|null} [textSettings=null] - Optional text settings. If provided a label will be created.
 * @param {string} textSettings.text - The label string.
 * @param {Object} textSettings.style - Phaser text style config passed to scene.add.text.
 * @param {Object|null} [ninesliceSettings=null] - Optional nine-slice background settings. If provided a nineslice is created.
 * @param {string} ninesliceSettings.texture - Texture key for the nineslice.
 * @param {string|number} [ninesliceSettings.frame] - Optional frame for the nineslice texture.
 * @param {number} ninesliceSettings.leftWidth - Nine-slice left slice width.
 * @param {number} ninesliceSettings.rightWidth - Nine-slice right slice width.
 * @param {number} ninesliceSettings.topHeight - Nine-slice top slice height.
 * @param {number} ninesliceSettings.bottomHeight - Nine-slice bottom slice height.
 * @param {number} [ninesliceSettings.scale=1] - Scale applied to the nineslice when computing interaction area.
 *
 * @example
 * new Button(this.scene, centerX+130, this.gameSlot[i].y, 20, 20,
        {
            text: 'X',
            style: {
                fontSize: 10,
                color: Colors.White,
                fontFamily: 'FableFont',
                padding: { x: 5, y: 5 },
            }
        },
        {
            texture: "UIbackground",
            frame: 0,
            leftWidth: 3,
            rightWidth: 3,
            topHeight: 3,
            bottomHeight: 3
        }
    );
 */
export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height,
        textSettings = null, ninesliceSettings = null) {
        super(scene, x, y);

        /**
         * Reference to the Phaser scene this button belongs to.
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        // Make button background if settings provided
        if(ninesliceSettings){
            this.buttonNineslice = this.scene.add.nineslice(
                ninesliceSettings.x||0,
                ninesliceSettings.y||0,
                ninesliceSettings.texture,
                ninesliceSettings.frame,
                width,
                height,
                ninesliceSettings.leftWidth,
                ninesliceSettings.rightWidth,
                ninesliceSettings.topHeight,
                ninesliceSettings.bottomHeight
            ).setOrigin(ninesliceSettings.offsetX||0, ninesliceSettings.offsetY||0);
            this.buttonNineslice.setScale(ninesliceSettings.scale);
            this.add(this.buttonNineslice);
        }
        // Make button text if settings provided
        if(textSettings){
            this.buttonText = this.scene.add.text(
                textSettings.x||0,
                textSettings.y||0,
                textSettings.text,
                textSettings.style
            ).setOrigin(textSettings.offsetX||0, textSettings.offsetY||0);;
            this.add(this.buttonText);
        }

        //Debug center pos
        //this.add(this.scene.add.rectangle(0,0,5,5,0xFF00FF));
        // If the button has nineslice, make the nineslice the interact area, otherwise, use width and height given
        let interactRect;
        if(ninesliceSettings){
            // Has to move the area manually because ninslice origin is 0.5
            interactRect = new Phaser.Geom.Rectangle(this.buttonNineslice.x-this.buttonNineslice.width*ninesliceSettings.offsetX, this.buttonNineslice.y-this.buttonNineslice.height*ninesliceSettings.offsetY, width*this.buttonNineslice.scale, height*this.buttonNineslice.scale);
            // Debug rect
            //this.add(this.scene.add.rectangle(this.buttonNineslice.x-this.buttonNineslice.width*ninesliceSettings.offsetX, this.buttonNineslice.y-this.buttonNineslice.height*ninesliceSettings.offsetY, width*this.buttonNineslice.scale, height*this.buttonNineslice.scale, 0xFFFFFF, 0.5).setOrigin(0));
        }
        else{
            interactRect = new Phaser.Geom.Rectangle(this.buttonText.x-this.buttonText.width*textSettings.offsetX, this.buttonText.y-this.buttonText.height*textSettings.offsetY, this.buttonText.width, this.buttonText.height)
            // Debug rect
            //this.add(this.scene.add.rectangle(this.buttonText.x-this.buttonText.width*textSettings.offsetX, this.buttonText.y-this.buttonText.height*textSettings.offsetY, this.buttonText.width, this.buttonText.height, 0xFFFFFF, 0.5).setOrigin(0));
        }

        this.setInteractive(
            interactRect,
            Phaser.Geom.Rectangle.Contains
        );

        this.scene.add.existing(this);
    }
    
    /**
     * Adds custom interaction setup logic to the button.
     * Allows adding event listeners or animations externally.
     *
     * @param {Function} setupFunction - A function that receives this button instance.
     * @returns {ButtonIcon} The current button instance for method chaining.
     *
     * @example
     * button.addInteraction((btn) => {
     *     btn.on("pointerdown", () => btn.invokeClick());
     *     btn.on("pointerover", () => btn.invokeHover());
     * });
     */
    addInteraction(setupFunction) {
        if (typeof setupFunction === "function") {
            setupFunction(this);
        }
        return this; 
    }

    /**
     * Triggers the button click behavior.
     * Emits a `button-clicked` event.
     *
     * @fires ButtonIcon#button-clicked
     * @returns {void}
     */
    invokeClick() {
        this.emit("button-clicked", this);
    }

    /**
     * Triggers the button hover behavior.
     * Emits a `button-hovered` event.
     *
     * @fires ButtonIcon#button-hovered
     * @returns {void}
     */
    invokeHover() {
        this.emit("button-hovered", this);
    }
}

/**
 * Fired when the button is clicked.
 * @event ButtonIcon#button-clicked
 * @type {ButtonIcon}
 */

/**
 * Fired when the pointer hovers over the button.
 * @event ButtonIcon#button-hovered
 * @type {ButtonIcon}
 */