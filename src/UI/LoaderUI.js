/**
 * Function called before loading assets in a scene. 
 * It overlays a UI giving the user info about the information being loaded.
 * @param {Phaser.Scene} scene The scene where the loader shows the loading information
 */
export default function showLoaderUI(scene) {
    // Add progress bar to scene
    var progressBar = scene.add.graphics();
    var progressBox = scene.add.graphics();

    // Set progress bar properties
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    progressBox.setAlpha(0);
    progressBar.setAlpha(0);

    // Add loading text to scene
    var percentText = scene.make.text({
        x: scene.game.canvas.width / 2,
        y: scene.game.canvas.height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    percentText.setAlpha(0);

    // Add text showing which file is being loaded
    var assetText = scene.make.text({
    x: scene.game.canvas.width / 2,
    y: scene.game.canvas.height / 2 + 50,
    text: '',
    style: {
        font: '18px monospace',
        fill: '#ffffff'
    }
    });
    assetText.setOrigin(0.5, 0.5);
    assetText.setAlpha(0);


    // Update UI when progress is made
    scene.load.on("progress", function (progress) {
        // Update progress bar
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * progress, 30);

        // Update loading text
        percentText.setText(parseInt(progress * 100) + '%');
    });

    // Update UI when a file is loaded
    scene.load.on("fileprogress", function(file){
        // Update which file is being loaded
        assetText.setText('Loading asset: ' + file.key);
    });

    // Fade in UI elements when loading starts
    scene.load.on("start", function(){
        // Create fade-out animation for UI
        var tween = scene.tweens.add({
            targets: [assetText, progressBar, progressBox, percentText],
            alpha: 1,
            duration: 500,
        });
    });

    // Fade out and destroy UI elements when loading ends
    scene.load.once("complete", function () {
        // Create fade-out animation for UI
        var tween = scene.tweens.add({
            targets: [assetText, progressBar, progressBox, percentText],
            alpha: 0,
            duration: 500,
            onComplete: function (){
                // Destroy loading UI when fade out is finished to free cache space
                assetText.destroy();
                percentText.destroy();
                progressBar.destroy();
                progressBox.destroy();
                tween.remove();
            },
        });
    });
}