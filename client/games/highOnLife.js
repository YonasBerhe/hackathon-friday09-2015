var screen = {
  w: window.innerWidth,
  h: window.innerHeight,
}
var game = new Phaser.Game(screen.w, screen.h, Phaser.AUTO, 'highOnLife', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  console.log("PRELOAD");

  game.load.atlas('breakout', '/assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');

  game.load.image('starfield', '/assets/bg/starfield.jpg');

  game.load.spritesheet('player', 'assets/sprites/spaceman.png', 16, 16);
}

var player;

var drugs;

var lives = 3;
var score = 0;

var scoreText;
var livesText;

var drugTypes = ["meth", "weed", "lsd", "cocaine"];

var s;

function create() {
  console.log("CREATE");

  game.physics.startSystem(Phaser.Physics.ARCADE);
  // s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

  game.stage.backgroundColor = '#ffffff';

  // NOTE: Drug Setup
  drugs = game.add.group();
  drugs.enableBody = true;
  drugs.physicsBodyType = Phaser.Physics.ARCADE;

  var drug;

  for (var i = 0; i < 8; i++) {
    var num = getRandomInt(1, 4);
    drug = drugs.create(game.world.randomX, game.world.randomY, 'breakout', 'brick_' + num + '_1.png');
    drug.body.bounce.set(1);
    drug.body.immovable = true;
    drug.type = drugTypes[num - 1];
  }

  // NOTE: Player Setup
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1);

  left = player.animations.add('left', [8, 9], 10, true);
  right = player.animations.add('right', [1, 2], 10, true);
  player.animations.add('up', [11, 12, 13], 10, true);
  player.animations.add('down', [4, 5, 6], 10, true);

  left.enableUpdate = true;
  right.enableUpdate = true;

  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.body.bounce.set(1);

  player.anchor.setTo(0.5, 0.5);

  player.scale.setTo(2, 2);

  // NOTE: Score Text Setup

  scoreText = game.add.text(32, 550, 'score: 0', {
    font: "20px Arial",
    fill: "#ffffff",
    align: "left"
  });
  livesText = game.add.text(680, 550, 'lives: 3', {
    font: "20px Arial",
    fill: "#ffffff",
    align: "left"
  });
}

/**
  Return random Color
*/
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var moving = false;

function update() {
  // Check is left and is in bound
  // console.log(player.x);
  // console.log(player.y);

  moving = false;

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && player.x > 0) {
    player.x -= 4;
    player.play('left');
    moving = true;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && player.x < screen.w) {
    player.x += 4;
    player.play('right');
    moving = true;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.y > 0) {
    player.y -= 4;
    player.play('up');
    moving = true;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && player.y < screen.h) {
    player.y += 4;
    player.play('down');
    moving = true;
  }

  if (moving) {
    game.stage.backgroundColor = getRandomColor();
  } else {
    player.animations.stop();
  }

  game.physics.arcade.overlap(player, drugs, playerHitdrug, null, this);

}

function gameOver() {

  ball.body.velocity.setTo(0, 0);

  introText.text = 'Game Over!';
  introText.visible = true;

}

function playerHitdrug(_player, _drug) {
  console.log('Collision!');
  console.log(_drug.type);
  _drug.kill();

  score += 10;

  scoreText.text = 'score: ' + score;

  //  Are they any drugs left?
  if (drugs.countLiving() === 0) {
    //  New level starts
    score += 1000;
    scoreText.text = 'score: ' + score;
    // introText.text = '- Next Level -';

    //  And bring the drugs back from the dead :)
    drugs.callAll('revive');
  }

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
