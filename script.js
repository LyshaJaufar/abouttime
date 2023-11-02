//Vanilla Javascript fireworks by Shirak Soghomonian 

//Settings
let canvas = document.querySelector('#canvas'); 
let c = canvas.getContext('2d'); 
let numberOfParticles = 1000; 
let density = 7;
let fireworkGravity = .2;
let particlesGravity = .08;
let explosionRadiusRange = { max:7 ,  min:-7  };
let fireworkRandomXPathRange = { max: 2 ,  min:-2  };
let fireworkRadius = 3; 
let particlesLifespan = 15; 
let fireworksArrayLength = 50;
let particleRadiusRange = { max: 2,  min: 1  };
let fireworkOnXaxis = 2; 

//-------------------------------



init();
class Particle {
    constructor(x,y,firework,color){
        this.x = x; 
        this.y = y; 
        this.lifeSpan = random(1000,50); 
        this.firework = firework;
        this.radius = random(particleRadiusRange.max,particleRadiusRange.min);
        this.color = color; 
        // ; 
        if(this.firework){
            this.vx =random(fireworkOnXaxis,-fireworkOnXaxis); 
            this.vy = random(-9,-15);
            this.gravity = fireworkGravity;
        }else {
            this.vy = random(explosionRadiusRange.max,explosionRadiusRange.min); // firework radius on Y axis
            this.vx = random(explosionRadiusRange.max,explosionRadiusRange.min); //firework radius on X axis
            this.vy = this.vy * random(3,2);
            this.vx = this.vx * random(3,2);
            this.gravity = particlesGravity;
            if(random(600,1) < 200){
                this.vx *= random(2,1);
                this.vy *= random(2,1);
            }
            
        }
   
    }

    done(){
        if(this.lifeSpan < 0){
            return true; 
        }else {
            return false; 
        }
    }

    draw(){
			//${this.lifeSpan/random(255,10)} the random number gives the particles sparkle effect
            circle(c, this.x, this.y, this.radius, `rgba(${this.color.red},${this.color.green},${this.color.blue},${this.lifeSpan/random(1000,10)})`);
            // circle(this.x, this.y,this.radius, `rgba(${this.color.red},${this.color.green},${this.color.blue},${this.lifeSpan/255})` ); 
    }

    update(){
        this.y += this.vy;
        this.x += this.vx;
        this.vy += this.gravity;
        if(this.firework){
            this.x += random(fireworkRandomXPathRange.max,fireworkRandomXPathRange.min);//Randomize the direction on X axis
            this.radius = random(fireworkRadius,fireworkRadius - fireworkRadius/2);

        }
        if (!this.firework) {
            this.vy *= .9;
            this.vx *= .9;
            this.lifeSpan -= particlesLifespan;
           
            // this.vx += random(.5,-.5);
            // this.vy += random(.5,-.5);
            if (this.lifeSpan < 0) {
                this.done();
            }
        }

        


        
    }
}

class Firework {
    constructor(){
        this.color = {
            red: random(255,0),
            green: random(255,0),
            blue:random(250,0)
           }; 

        if(this.color.red <= 150 && this.color.green <= 150 && this.color.blue <= 150 ){
            this.rgb = {
                red:255, 
                green: this.color.green,
                blue: this.color.blue
            }
        } else {

            this.rgb = {
                red:this.color.red, 
                green: 255,
                blue: this.color.blue
            }
        }
        
        
        this.firework = new Particle(random((canvas.width/2 ) - 50,canvas.width/2) , canvas.height,true,{
            red: 255, green: 255, blue:255
       }) ;
       this.exploded = false;
       this.particles = [];
    }


    

    done(){
        if(this.exploded && this.particles.length === 0){
            return true; 

        }else {
            return false; 
        }
    }

    explode(){
        for(let i =0; i < numberOfParticles; i++){
            this.particles.push(new Particle(this.firework.x, this.firework.y,false,this.rgb)); 
        }

        
      
    }
  

    update(){
        if(!this.exploded){
            this.firework.draw();
            this.firework.update();
            
            
            if(this.firework.vy > 0){
                this.firework.vy = 0;
                this.exploded = true;
                this.explode();

            }
    
        }

       for(let i = this.particles.length - 1; i >= 0 ; i--){
            this.particles[i].draw();
            this.particles[i].update();
            if(this.particles[i].done()){
                this.particles.splice(i, 1);
                //this.done();
            }
       }

 

    }
}

let fireworks = [];

function loop() {
		requestAnimationFrame(loop);
    c.fillStyle = "rgba(0,0,0,.2)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.round(random(0, 100)) < density) {
        fireworks.push(new Firework());
        // fireworks.push(new Firework());
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {

        fireworks[i].update();
        if (fireworks[i].done()) {
        }
    }


    if (fireworks.length >= fireworksArrayLength) {
        fireworks.splice(0, 1);
			
    }
    // Draw text in the center of the screen
    writeText(["ABOUT DAMN TIME!", "outta your cage", "(fly like a bird)"], [40, 30, 30], { red: 255, green: 255, blue: 255 }); // First line is larger // First line is larger
	
}

window.addEventListener('resize', ()=> {
    init();
});


// let interval = setInterval(loop, 24); 
loop();


function writeText(lines, fontSizes, color) {
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    for (let i = 0; i < lines.length; i++) {
        const yPosition = canvas.height / 2 + (i - 1) * (fontSizes[i] || fontSizes[0]); // Use the specified or the first font size
        const fontSize = fontSizes[i] || fontSizes[0]; // Use the specified or the first font size
        const shade = i * 50; // Adjust the shade for depth

        // Draw the text with a shadow for a 3D effect
        c.fillStyle = `rgb(${color.red - shade},${color.green - shade},${color.blue - shade})`;
        c.font = `${fontSize}px Arial`;
        c.fillText(lines[i], canvas.width / 2, yPosition);

        // Draw the text again with a slightly lighter color for the 3D effect
        c.fillStyle = `rgb(${color.red - shade + 20},${color.green - shade + 20},${color.blue - shade + 20})`;
        c.fillText(lines[i], canvas.width / 2 - 3, yPosition - 3); // Offset for the shadow effect
    }
}


function random(max, min) {
    let x = Math.random() * (max - min) + min;
    return x;
}

function circle(c, x, y, radius, color) {
    c.fillStyle = color;
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2);
    c.fill();
}

function init(){

    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 

}