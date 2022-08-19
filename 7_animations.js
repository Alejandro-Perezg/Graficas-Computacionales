let ctx = null, canvas = null;

class bar
{
    constructor(xPos, yPos, width, height, color)
    {
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;

        
    }

    draw()
    {
       
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos,this.yPos,this.width,this.height);
        
    }

    update(xMin, xMax, yMin, yMax)
    {

    }
}
class ball
{
    constructor(xPos, yPos, radius, color)
    {
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;

        this.up = false;
        this.right = true;

        this.speed = 1;
    }

    draw()
    {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update(xMin, xMax, yMin, yMax)
    {
        if(this.xPos < (xMin + this.radius)) this.right = true;
        if(this.xPos > (xMax - this.radius)) this.right = false;

        if(this.yPos > (yMax - this.radius)) this.up = true;
        if(this.yPos < (yMin + this.radius)) this.up = false;

        if(this.right)
            this.xPos += this.speed;
        else
            this.xPos -= this.speed;

        if(this.up)
            this.yPos -= this.speed;
        else    
            this.yPos += this.speed;
    }
}

function update(sphere, bars)
{
    requestAnimationFrame(()=>update(sphere, bars));

    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    bars.forEach(bar =>{
        bar.draw();
        bar.update();
    });

        sphere.draw();
        sphere.update(0, canvas.width, 0, canvas.height);

}

function inputHandlers(bar_l,bar_r)
{
    document.addEventListener("keydown", event=>{
        if(event.key == 'q') bar_l.y -= 10
        if(event.key == 'a') bar_l.y += 10
        if(event.key == 'o') bar_r.y -= 10
        if(event.key == 'l') bar_r.y += 10
    })
}

function main()
{
    canvas = document.getElementById("animationCanvas");
    ctx = canvas.getContext("2d");

    let sphere1 = new ball(Math.random() * canvas.width, Math.random() * canvas.height, 10, 'white');
    let left_bar = new bar(10,30,20,50,'white');
    let right_bar = new bar(canvas.width - 30,30,20,50,'white');
    
    inputHandlers(left_bar,right_bar)
    update(sphere1,[left_bar,right_bar]);
}
