// import { platform } from "os";


var config = {
    type: Phaser.AUTO,
    width:800,
    height: 600,
    parent:'game-area',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        
    }
};


var game = new Phaser.Game(config);
var platforms,airplatform=[];
var key;
var enemy;
var dooor;
var player;
var cursors;
var stars=[];
var score = 0;
var scoreText;
var hasKey=false;
var startScene,button,btnL,btnR,brand,keys,btnJ,stick,pad,move,car,win='false';
// var root='/game';//production
var root='';

function preload ()
{  
    // this.load.script('joystick', '/assets/js/phaser-virtual-joystick.min.js');
this.load.image('brand', root+'/images/brand.png');
this.load.image('button', root+'/images/button.png');
this.load.image('sky', root+'/images/sky.png');
this.load.image('brown2', root+'/images/brown2.png');
this.load.image('ground', root+'/images/platform.png');
this.load.image('ground2', root+'/images/platform2.png');
this.load.image('key', root+'/images/key.png');
this.load.image('gameover', root+'/images/gameover.png');
this.load.image('win', root+'/images/win.png');
this.load.image('keys', root+'/images/keys.png');
this.load.spritesheet('btn', root+'/images/button_sprite_sheet.png', { frameWidth: 64, frameHeight: 64 });
this.load.spritesheet('btnJ', root+'/images/jump.png', { frameWidth: 64, frameHeight: 64 });

this.load.spritesheet('door',root+'/images/door.png', { frameWidth: 50, frameHeight: 63 } );
this.load.spritesheet('dude',root+'/images/dude.png', { frameWidth: 40, frameHeight: 60 } );
this.load.spritesheet('star',root+'/images/coins.png', { frameWidth: 16, frameHeight: 16 } );
this.load.spritesheet('enemy',root+'/images/enemy.png', { frameWidth: 20, frameHeight: 20 } );
this.load.spritesheet('car',root+'/images/car.png', { frameWidth: 152, frameHeight: 50 } );
this.load.image('start', root+'/images/start.png');
this.load.audio('coin',root+'/sounds/coin.wav');
this.load.audio('over',root+'/sounds/over.wav');
this.load.audio('won',root+'/sounds/won.wav');
this.load.audio('music',root+'/sounds/game.wav');
this.load.audio('jump',root+'/sounds/jump.wav');
this.load.audio('happy',root+'/sounds/happy.wav');
}

function create ()
{
    
coin = this.sound.add('coin');  
music = this.sound.add('music'); 
over = this.sound.add('over'); 
won = this.sound.add('won'); 
jump = this.sound.add('jump'); 
happy = this.sound.add('happy');//you won 

this.sound.context.resume();
platforms = this.physics.add.staticGroup();
this.add.image(390, 250, 'worker');
platforms.create(400, 300, 'sky');
airplatform[0] = platforms.create(440, 400, 'ground');
airplatform[1] = platforms.create(390, 250, 'ground'); 
airplatform[2] = platforms.create(650, 190, 'ground');
airplatform[3] = platforms.create(650, 300, 'ground');//low
airplatform[4] = platforms.create(16, 170, 'ground');
airplatform[5] = platforms.create(105, 280, 'ground'); 
platforms.create(0, 504, 'brown2').setOrigin(0, 0).setScale(3).refreshBody();
platforms.create(0, 441, 'ground2').setOrigin(0, 0).setScale(2).refreshBody();
scoreText = this.add.text(16, 16, 'SCORE: 0', { fontSize: '30px', fill: '#fff' });

btnL = this.add.sprite(100, 530, 'btn').setScale(2).setInteractive();
btnR = this.add.sprite(300, 530, 'btn').setScale(2).setInteractive();
btnJ = this.add.sprite(700, 530, 'btnJ').setScale(2).setInteractive();
btnL.on('pointerup', function (pointer) {
    move="stop";
    this.anims.play('buttonUp', true);
});
btnL.on('pointerdown', function (pointer) {
    move="left";
    this.anims.play('buttonDown', true);
});
btnR.on('pointerup', function (pointer) {
    move="stop";
    this.anims.play('buttonUp', true);
});
btnR.on('pointerdown', function (pointer) {
    move="right";
    this.anims.play('buttonDown', true);
});
btnJ.on('pointerdown', function (pointer) {
    jump.play();
    this.anims.play('buttonJDown', true);
    player.setVelocityY(-330);  
});
btnJ.on('pointerup', function (pointer) {   
    this.anims.play('buttonJUp', true);   
});

player = this.physics.add.sprite(0, 100, 'dude');           
player.setBounce(0.2);//0.2
player.setCollideWorldBounds(true);
player.body.setGravityY(150);

enemy = this.physics.add.sprite(50, 400, 'enemy');  
enemy.setCollideWorldBounds(true);
enemy.body.setGravityY(150);


car = this.physics.add.sprite(870,400, 'car');
car.setCollideWorldBounds(true);
car.body.setGravityY(150);
car.flipX= true;
this.physics.add.collider(car, platforms);
this.physics.add.overlap(car, enemy,function(){enemy.destroy()} , null, this);

dooor = this.physics.add.sprite(800,410, 'door');//876 
dooor.setCollideWorldBounds(true);
dooor.body.allowGravity=false; 
this.physics.add.overlap(player, dooor, openDoor, null, this);

this.anims.create({
    key: 'buttonDown',
    frames: [ { key: 'btn', frame: 0 } ]   
});
this.anims.create({
    key: 'buttonUp',
    frames: [ { key: 'btn', frame: 1 } ]   
});
this.anims.create({
    key: 'buttonJDown',
    frames: [ { key: 'btnJ', frame: 0 } ]   
});
this.anims.create({
    key: 'buttonJUp',
    frames: [ { key: 'btnJ', frame: 1 } ]   
});
this.anims.create({
    key: 'doorClose',
    frames: [ { key: 'door', frame: 0 } ]   
});
this.anims.create({
    key: 'doorOpen',
    frames: this.anims.generateFrameNumbers('door',{ start: 0, end: 4 }),
    frameRate:20,

});
this.anims.create({
    key: 'rotatecCoins',
    frames: this.anims.generateFrameNumbers('star',{ start: 0, end: 3 }),
    frameRate:20,
    repeat:-1
});
this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 4 }),
    frameRate: 3,
    repeat: -1
});
this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 0 } ],
    frameRate: 20
});
this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 2 }),
    frameRate: 3,
    repeat: -1,
    
});
this.anims.create({
    key: 'enemyleft',
    frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
    frameRate: 3,
    repeat: -1,
    
});
this.anims.create({
    key: 'enemyright',
    frames: this.anims.generateFrameNumbers('enemy', { start: 2, end: 3 }),
    frameRate: 3,
    repeat: -1,
    
});
this.anims.create({
    key: 'carmove',
    frames: this.anims.generateFrameNumbers('car', { start: 1, end: 5 }),
    frameRate: 4,
    repeat: -1,
    
});
this.anims.create({
    key: 'cardisable',   
    frames: [ { key: 'car', frame: 5 } ]
    
});

cursors = this.input.keyboard.createCursorKeys();
this.physics.add.collider(player, platforms);
this.physics.add.collider(player, airplatform);
this.physics.add.collider(stars, platforms);
this.physics.add.collider(dooor, platforms);
this.physics.add.collider(player, dooor);
this.physics.add.collider(enemy, platforms);
// this.physics.add.collider(car, platforms);



for (var i=1,ry,rx;i<12;i++,ry=Math.floor(Math.random() * 236)+64,rx=Math.floor(Math.random() * 736)+64){

    stars[i] = this.physics.add.sprite(rx, ry, 'star'); 
    stars[i].setCollideWorldBounds(true);
    stars[i].setBounce(0.2);//0.2
    stars[i].body.allowGravity=false; 
    this.physics.add.overlap(player, stars[i], collectStar, null, this);
    this.physics.add.overlap(airplatform, stars[i], overlapStars, null, this);    
    this.physics.add.overlap(player ,enemy, killPlayer, null, this);             

    stars[i].anims.play('rotatecCoins');
 
}

startScene = this.add.sprite(400, 300, 'start');
keys = this.add.sprite(400, 470, 'keys');
button = this.add.sprite(400, 350, 'button').setInteractive();

brand = this.add.sprite(400, 200, 'brand');
button.on('pointerdown', function (pointer) {
    startScene.destroy(); music.play(); button.destroy();brand.destroy();keys.destroy();
    music.loop=true;
});


dooor.anims.play('doorClose');

function killPlayer(player, star){
    player.disableBody(true, true);
    platforms.create(400, 150, 'gameover');
    over.play();
    music.stop();    
}
function overlapStars(player, star){  
    star.x = Math.floor(Math.random() * 736)+64;
    star.y = Math.floor(Math.random() * 236)+64;
  
}

function collectStar (player, star)
{      
    coin.play();
    star.destroy();    
    score += 1;
    scoreText.setText('Score: ' + score);
    if(score==11){
        key=this.physics.add.sprite(100,180,'key').setScale(2);
        key.setCollideWorldBounds(true);  
        this.physics.add.collider(player, key); 
        this.physics.add.collider(airplatform, key);
        this.physics.add.collider(key, platforms);         
        this.physics.add.overlap(player, key, collectKey, null, this);
           }


}

function collectKey(player, varkey){ 
    happy.play();  
    varkey.destroy();    
    hasKey=!hasKey;
}

function openDoor(player,door){
   
    if(hasKey){
        
        dooor.anims.play('doorOpen');
        player.disableBody(true, true); 
        platforms.create(400, 150, 'win');
        airplatform.forEach(function(element) { element.destroy(); });
        btnL.destroy();btnR.destroy();btnJ.destroy();
        coin.destroy();music.destroy();over.destroy();
        hasKey=!hasKey; 
        won.play();
        music.stop(); 
        win='true';
        car.anims.play('carmove'); 
    } 
}  

}

function update ()
{
    if(win=='true'){   
     car.setVelocityX(-80);            
    }
    this.sound.context.resume();
    if(enemy.x>=630){
        enemy.setVelocityX(-160);
        enemy.anims.play('enemyright');
    }
    if(enemy.x<=50){        
        enemy.setVelocityX(160);
        enemy.anims.play('enemyleft');
    }
   
    if (cursors.left.isDown||move=="left")
        {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown||move=="right")
            {
                player.setVelocityX(160);
               
                player.anims.play('right', true);
            }
            else
            {
                player.setVelocityX(0);
                player.anims.play('turn');
            }

            if (cursors.up.isDown && player.body.touching.down)
            {
                jump.play();
                player.setVelocityY(-330);                
            } 

         
       
                 
}

