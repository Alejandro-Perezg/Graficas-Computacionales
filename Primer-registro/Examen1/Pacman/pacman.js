let ctx = null, canvas = null;

class ball
{
    constructor(xPos, yPos, radius, radians)
    {
        
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.radians = radians;

        this.up = false;
        this.right = true;

        this.speed = 3;
    }

    draw()
    {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, this.radians, (Math.PI * 2) - this.radians);
        ctx.stroke();
        ctx.lineTo(this.xPos,this.yPos);
        ctx.fill();
    }

    update(xMin, xMax, radians)
    {
        if(this.xPos + this.radius * 2 < (xMin + this.radius)) this.right = true;
        if(this.xPos - this.radius*2 > (xMax - this.radius)) this.right = false;
        if(this.right)
            this.xPos += this.speed;
        else
            this.xPos = xMin - (this.radius * 2);
            this.right = true;
            
     for (let rads = 0; rads <= this.radians; rads++) {
        this.draw().ctx.arc(this.xPos, this.yPos, this.radius, this.radians, (Math.PI * 2) - this.radians);
     }
     
    }

     
}

function update(pacman)
{
    requestAnimationFrame(()=>update(pacman));

    ctx.clearRect(0,0, canvas.width, canvas.height);
    pacman.draw();
    pacman.update(0, canvas.width, 0, canvas.height);
 
}

function main()
{
    canvas = document.getElementById("animationCanvas");
    ctx = canvas.getContext("2d");
    let pacman = new ball(0, 150, 50, 0.76);


    update(pacman);
}