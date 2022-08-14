var enemy, enemy_Image1, enemy_Image2, enemy_Image3, enemy_destroy, enemy_Kill;
var player, player_Animation, player_dead, player_Hurt;
var bullet, bullet_Image, bullet_Sound;
var back_Music, back_Image;
var transition_Music;
var boundary;
var block;

var END = 2;
var OPEN = 0;
var PLAY = 1;
var gameState = 0;

var score = 00;
var lives = 5;

var enemies;
var bullets;


function preload() {

	//Animations ------------------------------------------------------------------------------------------------------------------------------

	player_Animation = loadAnimation("Assets/pl1.png", "Assets/pl2.png", "Assets/pl3.png", "Assets/pl4.png");

	// Images----------------------------------------------------------------------------------------------------------------------------------

	enemy_Image1 = loadImage("Assets/1.png");
	enemy_Image2 = loadImage("Assets/2.png");
	enemy_Image3 = loadImage("Assets/3.png");

	bullet_Image = loadImage("Assets/bullet.png");

	back_Image = loadImage("Assets/Background.png");

	// Sound--------------------------------------------------------------------------------------------------------------------------------------
	
	enemy_Kill = loadSound("Assets/Enemy kill.wav");

	player_dead = loadSound("Assets/Dead (Player).wav");
	player_Hurt = loadSound("Assets/Hurt (Player).wav");

	bullet_Sound = loadSound("Assets/Bullet Fire.wav");

	back_Music = loadSound("Assets/Background(M).ogg");
	transition_Music = loadSound("Assets/Transition.wav");

}

function setup() {

	player = createSprite(windowWidth / 2, 650, 70, 70);
	player.addAnimation("normal", player_Animation);
	player.scale = 0.12;

	bullets = new Group();
	enemies = new Group();

}


function draw() {

	createCanvas(windowWidth, windowHeight);
	background(0);


	// If gameState is Open -------------------------------------------------------------------------------------------------------------

	if (gameState === 0) {

		player.visible = false;


		//Sound Play----------------------------------------------------------------------------------------------------------------------

		if (!back_Music.isPlaying() && gameState === 0) {

			back_Music.play();

		}

		// Text----------------------------------------------------------------------------------------------------------------------------

		textSize(155);
		fill("white");
		textFont("Iceland");
		text("Welcome", windowWidth / 3.55, windowWidth / 8);
		textSize(70);
		text("Soldier help us win the space war and kill ", windowWidth / 11, windowWidth / 5);
		text(" as many alien bastards as you can ", windowWidth / 7, windowWidth / 4);
		textSize(63);
		text("Click left mouse button to START", windowWidth / 5.5, windowWidth / 3);
		textSize(45);
		text("Instructions : ", windowWidth / 4.9, windowWidth / 2.46);
		textSize(30);
		text("• DON'T let the enemies touch you or cross you", windowWidth / 4, windowWidth / 2.31);
		text("• KILL at least 50 of those bastards", windowWidth / 4, windowWidth / 2.21);
		text("• Right : RIGHT ARROW KEY", windowWidth / 4, windowWidth / 2.12);
		text("• Left : LEFT ARROW KEY", windowWidth / 4, windowWidth / 2.04);
		text("• Shoot : SPACE", windowWidth / 4, windowWidth / 1.97);

		// Changing gameState to PLAY ------------------------------------------------------------------------------------------------------

		if (mouseIsPressed === true) {

			if (mouseButton === LEFT) {

				transition_Music.play();
				gameState = PLAY;

			}
		}


	}

	// If gameState is PLAY----------------------------------------------------------------------------------------------------------

	if (gameState === 1) {

		back_Music.stop();

		//Visibilty-----------------------------------------------------------------------------------------------------------------------

		player.visible = true;

		//Player Movement------------------------------------------------------------------------------------------------------------------

		if (keyWentDown("left")) {
			player.x = player.x - 280;
		}
		if (keyWentDown("right")) {
			player.x = player.x + 280;
		}

		//Player Movement Control-----------------------------------------------------------------------------------------------------------

		if (player.x > windowWidth) {
			player.x = windowWidth / 2;
		}
		if (player.x < windowWidth / 100) {

			player.x = windowWidth / 2;
		}

		//Bullets Spawn---------------------------------------------------------------------------------------------------------------------

		if (keyWentDown("space")) {
			spawnBullet();
		}

		//Destroying the enemies-------------------------------------------------------------------------------------------------------------

		for (var i = 0; i < enemies.length; i++) {

			if (enemies[i].isTouching(bullets)) {

				enemies[i].destroy();
				bullets.destroyEach();
				score = score + 1;
				enemy_Kill.play();

			}

			if (enemies[i].y > windowHeight || enemies[i].isTouching(player)) {

				enemies[i].destroy();
				enemies.splice(i, 1);
				lives = lives - 1;
				player_Hurt.play();
			}
		}

		//Spawn Enemies---------------------------------------------------------------------------------------------------------------------

		spawnEnemies();

		//Change Gamestate to END--------------------------------------------------------------------------------------------------------------

		if (lives === 0) {

			player_dead.play();

			gameState = 2;

		}

	}

	//If gameState is END------------------------------------------------------------------------------------------------------------------

	if (gameState === 2) {


		// Destroy-----------------------------------------------------------------------------------------------------------------------------

		enemies.destroyEach();
		bullets.destroyEach();
		player.visible = false;

		//Text----------------------------------------------------------------------------------------------------------------------------------

		textSize(155);
		fill("white");
		textFont("Iceland");
		text("Game Over", windowWidth / 3.7, windowWidth / 4.3);
		textSize(105);
		text("Press Tab to restart", windowWidth / 4.5, windowWidth / 3);

		//Restart----------------------------------------------------------------------------------------------------------------------------

		if (keyDown("tab")) {

			lives = 5;
			score = 0;
			player.x = windowWidth / 2;
			gameState = 1;
			transition_Music.play();

		}

	}


	//Draw Sprites--------------------------------------------------------------------------------------------------------------------------

	drawSprites();

	//Text-----------------------------------------------------------------------------------------------------------------------------------

	if (gameState === 1 || gameState === 2) {

		textSize(55);
		fill("white");
		textFont("Iceland");
		text("Score: " + score, windowWidth / 2.3, 50);
		text("Lives: " + lives, windowWidth / 2.27, 100);

	}


}

function spawnBullet() {

	bullet = createSprite(player.x + 2, player.y, 8, 15);
	bullet.addImage(bullet_Image);
	bullet_Sound.play();
	bullet.velocityY = -20;
	bullet.scale = 0.05;

	bullet.depth = player.depth;
	player.depth = player.depth + 1;

	bullets.push(bullet);

	bullet.setCollider("rectangle", 0, 0, 8, 15);

}


function spawnEnemies() {

	if (World.frameCount % 20 === 0) {

		var rand = Math.round(random(1, 5));
		var rand_Speed = Math.round(random(12, 18));
		enemy = createSprite(rand, -500, 80, 70);
		enemy.velocityY = rand_Speed;

		var rand_Image = Math.round(random(1, 4));
		switch (rand_Image) {
			case 1: enemy.addImage(enemy_Image1);
				break;
			case 2: enemy.addImage(enemy_Image2);
				break;
			case 3: enemy.addImage(enemy_Image3);
				break;
			case 4: enemy.addImage(enemy_Image1);
				break;
			default: break;
		}


		switch (rand) {
			case 1: enemy.x = windowWidth / 2;
				break;
			case 2: enemy.x = windowWidth / 2 + 280;
				break;
			case 3: enemy.x = windowWidth / 2 + 560;
				break;
			case 4: enemy.x = windowWidth / 2 - 280;
				break;
			case 5: enemy.x = windowWidth / 2 - 560;
				break;
			default: break;
		}

		enemy.scale = 0.1;
		enemy.setCollider("rectangle", 0, -60, 800, 700);

		enemy.depth = player.depth;
		player.depth = player.depth + 1;

		enemies.push(enemy);

	}

}


