/*
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
let enemySpeed = 2;
let spawnRate = 3600;
let maxEnemies = 5;
let spawnTimer;

let flames = [];
let flameSpeed = 4;
let attackRate = 4000;
let attackTimer;

let score = 0;
let scoreTimer;
let maxScore;

let dificultyTimer;


window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

function keyDown(e){
    keys[e.keyCode] = true;
}

function keyUp(e){
    keys[e.keyCode] = false;
}

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


menuScreen = new PIXI.Container();
helpScreen = new PIXI.Container();
mainScreen = new PIXI.Container();
endScreen = new PIXI.Container();

mainScreen.sortableChildren = true;

helpScreen.visible = false;
mainScreen.visible = false;
endScreen.visible = false;

app.stage.addChild(menuScreen);
app.stage.addChild(helpScreen);
app.stage.addChild(mainScreen);
app.stage.addChild(endScreen);

// Menu

let titleBg = new PIXI.Sprite.from('images/background/menuBg.png');
titleBg.x = menuScreen.x;
titleBg.y = menuScreen.y;
menuScreen.addChild(titleBg);

let titleText = new PIXI.Text('Ghost Game');
titleText.anchor.set(0.5);
titleText.x = app.view.width / 2;
titleText.y = app.view.height / 5;
titleText.style = new PIXI.TextStyle({fill:0xAAAAAA, fontSize:60, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
menuScreen.addChild(titleText);

let startButton = new PIXI.Text('Start');
startButton.anchor.set(0.5);
startButton.x = app.view.width / 2;
startButton.y = app.view.height / 2;
startButton.interactive = true;
startButton.buttonMode = true;
startButton.style = new PIXI.TextStyle({fill:0xFF0000, fontSize:42, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
startButton.on('pointerup', startGame);

menuScreen.addChild(startButton);

let helpButton = new PIXI.Text('Help');
helpButton.anchor.set(0.5);
helpButton.x = app.view.width / 2;
helpButton.y = app.view.height / 1.5;
helpButton.interactive = true;
helpButton.buttonMode = true;
helpButton.style = new PIXI.TextStyle({fill:0xFF0000, fontSize:32, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
helpButton.on('pointerup', showHelp);

menuScreen.addChild(helpButton);

// Help 

let helpBg = new PIXI.Sprite.from('images/background/menuBg.png');
helpBg.x = helpScreen.x;
helpBg.y = helpScreen.y;
helpScreen.addChild(helpBg);

let helpText = new PIXI.Text('Use W, A, S, D to move around and avoid the wraiths and their spells');
helpText.anchor.set(0.5);
helpText.x = app.view.width / 2;
helpText.y = app.view.height / 3;
helpText.style = new PIXI.TextStyle({fill:0xAAAAAA, fontSize:28, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
helpScreen.addChild(helpText);

let backButton = new PIXI.Text('Back');
backButton.anchor.set(0.5);
backButton.x = app.view.width / 2;
backButton.y = app.view.height / 2;
backButton.interactive = true;
backButton.buttonMode = true;
backButton.style = new PIXI.TextStyle({fill:0xFF0000, fontSize:40, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
backButton.on('pointerup', goToMenu);

helpScreen.addChild(backButton);


let scoreText = new PIXI.Text('Score: ');
scoreText.x = mainScreen.x;
scoreText.y = mainScreen.y;
scoreText.zIndex = 10;
scoreText.style = new PIXI.TextStyle({fill:0xFF0000, fontSize:40, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
mainScreen.addChild(scoreText);

// End

let endBg = new PIXI.Sprite.from('images/background/menuBg.png');
endBg.x = endScreen.x;
endBg.y = endScreen.y;
endScreen.addChild(endBg);

let endText = new PIXI.Text('You died');
endText.anchor.set(0.5);
endText.x = app.view.width / 2;
endText.y = app.view.height / 5;
endText.style = new PIXI.TextStyle({fill:0xFF0000, fontSize:60, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
endScreen.addChild(endText);

let endScore = new PIXI.Text('Your score: ');
endScore.anchor.set(0.5);
endScore.x = app.view.width / 2;
endScore.y = app.view.height / 3;
endScore.style = new PIXI.TextStyle({fill:0xAAAAAA, fontSize:42, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
endScreen.addChild(endScore);

let menuButton = new PIXI.Text('Menu');
menuButton.anchor.set(0.5);
menuButton.x = app.view.width / 2;
menuButton.y = app.view.height / 2;
menuButton.interactive = true;
menuButton.buttonMode = true;
menuButton.style = new PIXI.TextStyle({fill:0xFF0000, fontSize:36, fontFamily:'Vecna', stroke: 0x000000, strokeThickness:3})
menuButton.on('pointerup', goToMenu);

endScreen.addChild(menuButton);

function startGame(e){
    app.ticker.add(gameLoop);
    spawnEnemies();
    spawnFlames();
    goToMain();
    incrementScore();
    incrementDificulty();
}

function goToMain(e){
    menuScreen.visible = false;
    helpScreen.visible = false;
    mainScreen.visible = true;
    endScreen.visible = false;
}

function showHelp(e){
    menuScreen.visible = false;
    helpScreen.visible = true;
    mainScreen.visible = false;
    endScreen.visible = false;
}

function goToMenu(e){
    menuScreen.visible = true;
    helpScreen.visible = false;
    mainScreen.visible = false;
    endScreen.visible = false;
}

function showLoading(e){
    console.log(e.progress);
}

function spawnEnemies(){
    spawnTimer = setInterval(() => {
        if(enemies.length < maxEnemies){
            createEnemy();
        } 
    }, spawnRate)
}

function spawnFlames(){
    attackTimer = setInterval(()=>{
        shootFlame();
    }, attackRate);
}

function incrementScore(){
    scoreTimer = setInterval(()=>{
        score++;  
        scoreText.text = `Score: ${score}`;
      }, 1000)
}

function incrementDificulty(){
    dificultyTimer = setInterval(() => {
        if(spawnRate > 500){
            clearInterval(spawnTimer);
            spawnRate-=200;
            spawnEnemies();
        }
        if(attackRate > 1000){
            clearInterval(attackTimer)
            attackRate-=100;
            spawnFlames();
        }
        enemySpeed+=0.02;
        flameSpeed+=0.04;
        backgroundSpeed+=0.01;
        if(score > 100){
            maxEnemies = 6;
        }
    }, 10000)
}

function initGame(e){
    createBackground();
    createPlayerSheet();
    createEnemySheet();
    createPlayer();
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
    detectCollision(enemies);
    detectCollision(flames);
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
        enemy.x -= enemySpeed;
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

function detectCollision(entities){
    entities.forEach(entity => {
        if(collides(player, entity)){
            stopGame();
            showEndScreen();
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

function stopGame(){
    app.ticker.remove(gameLoop);
    clearInterval(scoreTimer);
    endScore.text = `Your score: ${score}`;
    clearInterval(spawnTimer);
    clearInterval(attackTimer);
    clearInterval(dificultyTimer);
    player.stop();
    enemies.forEach(enemy => {
        enemy.stop();
    })
    reconfigureGame();
}

function showEndScreen(){
    menuScreen.visible = false;
    mainScreen.visible = false;
    helpScreen.visible = false;
    endScreen.visible = true;
}

function reconfigureGame(){
    enemies = [];
    flames = [];
    score = 0;
    backgroundSpeed = 1;
    enemySpeed = 2;
    spawnRate = 3600;
    maxEnemies = 5;
    flameSpeed = 4;
    attackRate = 4000;
    initGame();
}