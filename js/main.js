/*
 - Add help screen
 - Add bg to title screen
 - Fix enemies spawn range
 - Add player movement bounds
 - Implement end screen
*/

const gameContainer = document.querySelector('.game');

const W = 87;
const A = 65;
const S = 83;
const D = 68;

let keys = {};

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

let player;
let playerSheet = {};

let enemies = [];
let enemySheet = {};
let flames = [];
let flameSpeed = 5;


const app = new PIXI.Application(
    {
        width: 1280,
        height: 720,
        backgroundColor: 0xAAAAAA,
    }
);

gameContainer.appendChild(app.view);


app.loader.baseUrl = "images";
app.loader
    .add("player", "/player/player.png")
    .add("enemy", "/enemy/enemy.png")
    .add('flame', '/misc/flame.png')
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

// Keyboard controlls
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

function keyDown(e){
    keys[e.keyCode] = true;
}

function keyUp(e){
    keys[e.keyCode] = false;
}

function initGame(e){
    createBackground();
    createPlayerSheet();
    createEnemySheet();
    createPlayer();
    setInterval(() => {
        if(enemies.length < 5){
            createEnemy();
        } 
    }, 2000)
    setInterval(()=>{
        shootFlame();
    },3000);

    app.ticker.add(gameLoop);
}

function logError(e){
    console.log(e.message);
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

function createPlayerSheet(){
    let sheet = new PIXI.BaseTexture.from(app.loader.resources.player.url);
    let frameWidth = 64;
    let frameHeight = 64;
    playerSheet.move = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0*frameWidth,0,frameWidth,frameHeight)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1*frameWidth,0,frameWidth,frameHeight)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2*frameWidth,0,frameWidth,frameHeight)),
    ];
}

function createEnemySheet(){
    let sheet = new PIXI.BaseTexture.from(app.loader.resources.enemy.url);
    let frameWidth = 64;
    let frameHeight = 64;
    enemySheet.move = [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0*frameWidth,0,frameWidth,frameHeight)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1*frameWidth,0,frameWidth,frameHeight)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2*frameWidth,0,frameWidth,frameHeight)),
    ];
}

function shootFlame(){
    enemies.forEach(enemy=>{
        createFlame(enemy);
    });
}

function createFlame(origin){
    let flame = new PIXI.Sprite.from(app.loader.resources.flame.texture);
    flame.anchor.set(0.5);
    flame.x = origin.x;
    flame.y = origin.y;
    flame.speed = flameSpeed;
    mainScreen.addChild(flame);
    flames.push(flame);
}

function createPlayer(){
    player = new PIXI.AnimatedSprite(playerSheet.move);
    player.anchor.set(0.5);
    player.animationSpeed = .2;
    player.loop = true;
    player.x = app.view.width / 5;
    player.y = app.view.height / 2;
    mainScreen.addChild(player);
    player.play();
}

function createEnemy(){
    newEnemy = new PIXI.AnimatedSprite(enemySheet.move);
    newEnemy.anchor.set(0.5);
    newEnemy.animationSpeed = .2;
    newEnemy.loop = true;
    newEnemy.x = app.view.width;
    newEnemy.y = Math.random() * app.view.height;
    enemies.push(newEnemy);
    mainScreen.addChild(newEnemy);
    newEnemy.play();
}

function createTilingSprite(texture){
    let tiling = new PIXI.TilingSprite(texture, app.view.width, app.view.height);
    tiling.position.set(0,0);
    mainScreen.addChild(tiling);
    return tiling;
}

function gameLoop(){
    updateBackground();
    checkMovement();
    updateEnemies();
    updateFlames();
    detectCollision();
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

function checkMovement(){
    if(keys[W]){
        player.y -= 5;
    }
    if (keys[A]){
        player.x -= 5; 
    }
    if (keys[S]){
        player.y += 5;
    }
    if (keys[D]){
        player.x += 5;
    }
}

function updateEnemies(){
    enemies.forEach(enemy => {
        enemy.x -= backgroundSpeed;
        if(enemy.x < -64){
            enemy.dead = true;
        }
    });
    for(let i=0; i<enemies.length;i++){
        if(enemies[i].dead){
            mainScreen.removeChild(enemies[i]);
            enemies.splice(i, 1);
        }
    }
}

function detectCollision(){
    enemies.forEach(enemy => {
        if(collides(player, enemy)){
            console.log('Hit enemy!');
        }
    });
    flames.forEach(flame => {
        if(collides(player, flame)){
            console.log('Hit flame!');
        }
    });
}

function collides(a, b){
    let aBox = a.getBounds();
    let bBox = b.getBounds();
    return aBox.x + aBox.width > bBox.x &&
        aBox.x < bBox.width + bBox.x &&
        aBox.y + aBox.height > bBox.y &&
        aBox.y < bBox.height + bBox.y;
}

function updateFlames(){
    flames.forEach(flame => {
        flame.x -= flameSpeed;
        if(flame.x < -32){
            flame.dead = true;
        }
    });
    for(let i=0; i<flames.length;i++){
        if(flames[i].dead){
            mainScreen.removeChild(flames[i]);
            flames.splice(i, 1);
        }
    }
}