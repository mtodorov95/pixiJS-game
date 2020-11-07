const gameContainer = document.querySelector('.game');

let titleScreen;
let mainScreen;
let endScreen;

let bg1;
let bg2;
let bg3;
let bg4;
let bg5;
let bg6;
let bg7;
let bg8;
let backgroundX=0;
let backgroundSpeed = 1;


const app = new PIXI.Application(
    {
        width: 1280,
        height: 720,
        backgroundColor: 0xAAAAAA,
    }
);

gameContainer.appendChild(app.view);

// Preload assets

app.loader.baseUrl = "images";
app.loader
    .add("player", "/player/player.png")
    .add("enemy", "/enemy/enemy.png")
    .add('flame1', '/misc/flame1.png')
    .add('flame2', '/misc/flame2.png')
    .add('background01', '/background/01.png')
    .add('background02', '/background/02.png')
    .add('background03', '/background/03.png')
    .add('background04', '/background/04.png')
    .add('background05', '/background/05.png')
    .add('background06', '/background/06.png')
    .add('background07', '/background/07.png')
    .add('background08', '/background/08.png')

app.loader.onProgress.add(showLoading);
app.loader.onComplete.add(initGame);
app.loader.onError.add(logError);

app.loader.load();


titleScreen = new PIXI.Container();
mainScreen = new PIXI.Container();
endScreen = new PIXI.Container();

mainScreen.visible = false;
endScreen.visible = false;

app.stage.addChild(titleScreen);
app.stage.addChild(mainScreen);
app.stage.addChild(endScreen);

// Screens
let titleRect = new PIXI.Graphics();
titleRect.beginFill(0x423B38);
titleRect.drawRect(0,0,app.view.width, app.view.height);
titleScreen.addChild(titleRect);
// Title
let titleText = new PIXI.Text('Ghosting');
titleText.anchor.set(0.5);
titleText.x = app.view.width / 2;
titleText.y = app.view.height / 5;
titleText.style = new PIXI.TextStyle({fill:0xAAAAAA, fontSize:56, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
titleScreen.addChild(titleText);

// start button

let startButton = new PIXI.Text('Start');
startButton.anchor.set(0.5);
startButton.x = app.view.width / 2;
startButton.y = app.view.height / 2;
startButton.interactive = true;
startButton.buttonMode = true;
startButton.style = new PIXI.TextStyle({fill:0xFF0000, fontSize:40, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
startButton.on('pointerup', goToMain);

titleScreen.addChild(startButton);

function goToMain(e){
    titleScreen.visible = false;
    mainScreen.visible = true;
    endScreen.visible = false;
}

function showLoading(e){
    console.log(e.progress);
    // display loading spinner
}

function initGame(e){
    createPlayerSheet();
    createEnemySheet();
    createPlayer();
    createEnemy();
    createBackground();

    app.ticker.add(gameLoop);
}

function logError(e){
    console.log(e.message);
}

// Implement
function createPlayerSheet(){
    // let sheet = new PIXI.BaseTexture.from(app.loader.resources.player.url);
    // let w = 32;
    // let h = 32;
    // playerSheet.idle = [
    //     new PIXI.Texture(sheet, new PIXI.Rectangle(0*w,0,w,h)),
    //     new PIXI.Texture(sheet, new PIXI.Rectangle(1*w,0,w,h)),
    //     new PIXI.Texture(sheet, new PIXI.Rectangle(2*w,0,w,h)),
    //     new PIXI.Texture(sheet, new PIXI.Rectangle(3*w,0,w,h)),
    // ];

    // playerSheet.walk = [
    //     new PIXI.Texture(sheet, new PIXI.Rectangle(4*w,0,w,h)),
    //     new PIXI.Texture(sheet, new PIXI.Rectangle(5*w,0,w,h)),
    //     new PIXI.Texture(sheet, new PIXI.Rectangle(6*w,0,w,h)),
    //     new PIXI.Texture(sheet, new PIXI.Rectangle(7*w,0,w,h)),
    // ];
}

// Implement
function createPlayer(){
    // player = new PIXI.AnimatedSprite(playerSheet.idle);
    // player.anchor.set(0.5);
    // player.animationSpeed = .2;
    // player.loop = false;
    // player.x = 50;
    // player.y = app.view.height / 2;
    // app.stage.addChild(player);
    // player.play();
}

function createEnemySheet(){

}

function createEnemy(){

}

function createBackground(){
    bg8 = createTilingSprite(app.loader.resources.background08.texture);
    bg7 = createTilingSprite(app.loader.resources.background07.texture);
    bg6 = createTilingSprite(app.loader.resources.background06.texture);
    bg5 = createTilingSprite(app.loader.resources.background05.texture);
    bg4 = createTilingSprite(app.loader.resources.background04.texture);
    bg3 = createTilingSprite(app.loader.resources.background03.texture);
    bg2 = createTilingSprite(app.loader.resources.background02.texture);
    bg1 = createTilingSprite(app.loader.resources.background01.texture);  
}

function createTilingSprite(texture){
    let tiling = new PIXI.TilingSprite(texture, app.view.width, app.view.height);
    tiling.position.set(0,0);
    mainScreen.addChild(tiling);
    return tiling;
}

function gameLoop(){
    updateBackground();
}

function updateBackground(){
    backgroundX = backgroundX - backgroundSpeed;
    bg1.tilePosition.x = backgroundX;
    bg2.tilePosition.x = backgroundX;
    bg3.tilePosition.x = backgroundX;
    bg4.tilePosition.x = backgroundX / 2;
    bg5.tilePosition.x = backgroundX / 2;
    bg6.tilePosition.x = backgroundX / 4;
    bg7.tilePosition.x = backgroundX / 4;
    bg8.tilePosition.x = backgroundX / 4;
}