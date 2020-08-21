const petHappyDisplay = document.getElementById('petHappy');
const petAgeDisplay = document.getElementById('petAge');
const petEnergyDisplay = document.getElementById('petEnergy');
const petHungerDisplay = document.getElementById('petHunger');
const petHealthDisplay = document.getElementById('petHealth');
const petPoopsDisplay = document.getElementById('petPoop');

let Game = {};

const feedBtns = document.querySelectorAll('button.feed');
const playBtns = document.querySelectorAll('button.play');
//const cleanBtns = document.querySelectorAll('button.clean');
const cleanBtn = document.querySelector('button.clean');

const maxStat = 100;
const gameTimeStep = 400;

function Pet(options) {
    this.hunger = 100;
    this.happy = 100;
    this.health = 100;
    this.energy = 100;
    this.age = 0;
    this.game = options.game;
    this.digestion = 0;
    this.poops = 0;
}

Pet.prototype.update = function(time){
    this.updateHappy(time);
    this.updateHunger(time);
    this.updateEnergy(time);
    this.updatePoops(time);
}

Pet.prototype.updateHappy = function(time){
    const dec = Math.randomBetween(maxStat/400, maxStat/200) * time/1000;
    this.happy = Math.max(0, this.happy - dec) - (this.poops / 10);
    petHappyDisplay.innerText = this.happy;
}

Pet.prototype.updateHunger = function(time){
    const dec = Math.randomBetween(maxStat/300, maxStat/150) * time/1000;
    this.hunger = Math.max(0, this.hunger - dec);
    petHungerDisplay.innerText = this.hunger;
}

Pet.prototype.updateEnergy = function(time){
    const dec = 0.1 * time/1000;
    this.energy = Math.max(0, this.energy - dec);
    petEnergyDisplay.innerText = this.energy;
}

Pet.prototype.updateAge = function(time){
    
}

Pet.prototype.updatePoops = function(time){
    const inc = Math.randomBetween(maxStat/300, maxStat/150) * time/1000;
    this.digestion += inc; 
    if(this.digestion >= 100){
        this.poops++;
        this.digestion = 0;
    }
    petPoopsDisplay.innerText = this.poops;
}

Pet.prototype.feed = function(type){
    if(type === 'meat'){
        this.hunger += 70;
        this.happy += 20;
    } else if(type === 'veg'){
        this.hunger += 40;
    } else if(type === 'junk'){
        this.hunger += 10;
        this.happy += 40;
    }
    this.digestion += 20;
}

Pet.prototype.play = function(activity){
    if(activity === 'pet'){
        this.happy += 35;
    }
}

Pet.prototype.cleanPoop = function() {
    if(this.poops > 0){
        this.poops--;
    }
}
 
function initGame(){
    Game.pet = new Pet({game: Game});
    Game.ticks = 0;
}

function runGame(){    
    Game.ticks++
    Game.pet.update(gameTimeStep);
    setTimeout(runGame, gameTimeStep);
}

Math.randomBetween = function(min, max) {
    return Math.random() * (max - min + 1) + min;
};



initGame();
runGame();

feedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        Game.pet.feed(btn.dataset.item);
    })
})
playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        Game.pet.play(btn.dataset.item);
    })
})
cleanBtn.addEventListener('click', () => {
    Game.pet.cleanPoop();
})