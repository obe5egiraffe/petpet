const petHappyDisplay = document.getElementById('petHappy');
const petAgeDisplay = document.getElementById('petAge');
const petStatusDisplay = document.getElementById('petStatus');
const petEnergyDisplay = document.getElementById('petEnergy');
const petHungerDisplay = document.getElementById('petHunger');
const petHealthDisplay = document.getElementById('petHealth');
const petPoopsDisplay = document.getElementById('petPoop');

const goodColour = '#3b822c';
const okColour = '#74d660';
const mehColour = '#ebe83b';
const badColour = '#eb3b3b';

let Game = {};

const feedBtns = document.querySelectorAll('button.feed');
const playBtns = document.querySelectorAll('button.play');
//const cleanBtns = document.querySelectorAll('button.clean');
const cleanBtn = document.querySelector('button.clean');

const maxStat = 100;
const gameTimeStep = 400;

function Pet(options) {
    this.hunger = 100;
    this.awake = true;
    this.happy = 100;
    this.health = 100;
    this.energy = 100;
    this.age = 0;
    this.game = options.game;
    this.digestion = 0;
    this.poops = 0;
    this.alive = true;
}

Pet.prototype.update = function(time){
    if(this.alive){
        this.updateHappy(time);
        this.updateHunger(time);
        this.updateEnergy(time);
        this.updatePoops(time);
        this.updateAge(time);
        this.updateStatus(time);
        this.updateHealth();
    }
    
}

Pet.prototype.updateHappy = function(time){
    const dec = Math.randomBetween(maxStat/500, maxStat/300) * time/1000;
    const happyAmt = Math.max(0, this.happy - dec) - (this.poops / 10);
    this.happy = happyAmt > 100 ? 100 : happyAmt;
    petHappyDisplay.style.width = this.happy + '%';
}

Pet.prototype.updateHunger = function(time){
    const dec = Math.randomBetween(maxStat/300, maxStat/150) * time/1000;
    this.hunger = Math.max(0, this.hunger - dec) > 100 ? 100 : Math.max(0, this.hunger - dec);
    petHungerDisplay.style.width = this.hunger + '%';
}

Pet.prototype.updateEnergy = function(time){
    if(this.awake){
        const dec = 0.1 * time/1000;
        this.energy = Math.max(0, this.energy - dec);
        petEnergyDisplay.style.width = this.energy + '%';
        
    } else {
        const inc = 0.5 * time/1000;
        this.energy += inc;
        petEnergyDisplay.style.width = this.energy + '%';
        
    }
}

Pet.prototype.updateStatus = function(time){
    if(this.awake && this.energy < 15 && this.health > 0){
        this.awake = false;
    } else if(!this.awake && this.energy > 80 && this.health > 0){
        this.awake = true;
    } else if(this.health === 0) {
        this.awake = false;
        this.alive = false;
    }
    if(this.awake && this.alive){
        petStatusDisplay.innerHTML = "Awake";
    } else if (!this.awake && this.alive){
        petStatusDisplay.innerHTML = "Sleeping";
    } else if (!this.alive){
        petStatusDisplay.innerHTML = "Dead";
    }
}

Pet.prototype.updateHealth = function(){
    petHealthDisplay.style.width = this.health + '%';
}

Pet.prototype.updateAge = function(time){
    if(Game.ticks <= 3000){
        this.age = "Baby"
    } else if(Game.ticks > 3000 && Game.ticks < 5000){
        this.age = "Teenager"
    } else {
        this.age = "Adult"
    }
    petAgeDisplay.innerText = this.age;
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
    if(this.awake){
        if(type === 'meat'){
            this.hunger += 70;
            this.happy += 20;
        } else if(type === 'veg'){
            this.hunger += 40;
            this.health = this.health + 5 > 100 ? 100 : this.health + 5;
            
        } else if(type === 'junk'){
            this.hunger += 10;
            this.happy += 40;
            this.health = this.health - 10 < 0 ? 0 : this.health - 10;
        }
        this.digestion += 20;
    }
}

Pet.prototype.play = function(activity){
    if(activity === 'pet' && this.awake){
        this.happy += 35;
    }
}

Pet.prototype.cleanPoop = function() {
    if(this.alive){
        if(this.poops > 0){
            this.poops--;
            this.happy += 15;
        }
    }
}


function updateStatusColour() {
    const statusBars = document.querySelectorAll('.stat');
    statusBars.forEach(bar => {
        const barWidth = parseFloat(bar.style.width); 
        let barColour = goodColour;
        if(barWidth >= 75){
            barColour = goodColour;
        } else if (barWidth < 75 && barWidth >= 50){
            barColour = okColour;
        } else if (barWidth < 50 && barWidth >= 20){
            barColour = mehColour;
        } else {
            barColour = badColour;
        }
        bar.style.backgroundColor = barColour;
    })
}
 
function initGame(){
    Game.pet = new Pet({game: Game});
    Game.ticks = 0;
    runGame();
}

function runGame(){    
    Game.ticks++
    Game.pet.update(gameTimeStep);
    updateStatusColour();
    setTimeout(runGame, gameTimeStep);
}

Math.randomBetween = function(min, max) {
    return Math.random() * (max - min + 1) + min;
};


initGame();

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