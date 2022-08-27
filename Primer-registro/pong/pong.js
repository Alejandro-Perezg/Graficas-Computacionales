let ctx = null, canvas = null;

class bar
{
    constructor(xPos, yPos, width, height, color, yMin, yMax)
    {
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.yMax = yMax;
        this.yMin = yMin;

        
    }

    draw()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos,this.yPos,this.width,this.height); 
    }



    
    update()
    {
        if(this.yPos < this.yMin) this.yPos = this.yMin
        if(this.yPos > (this.yMax - this.height)) this.yPos = this.yMax - this.height
    }
}

class ball
{
    constructor(xPos, yPos, radius, color,yMax,xMax,height,bar_l,bar_r)
    {
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.xMax = xMax;
        this.yMax = yMax;
        this.bar_l = bar_l;
        this.bar_r = bar_r;
        this.height = height;

 

        this.speed = 2;
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
        //bordes
        if(this.xPos < (xMin + this.radius)) this.right = true;
        if(this.xPos > (xMax - this.radius)) this.right = false;
        if(this.yPos > (yMax - this.radius)) this.up = true;
        if(this.yPos < (yMin + this.radius)) this.up = false;

        // paletas
        //paleta izq
        if(((this.xPos - this.radius) <= (this.bar_l.xPos + this.bar_l.width) && 
        (this.yPos <= (this.bar_l.yPos + this.height)) && 
        (this.yPos >= this.bar_l.yPos))){
            this.right = true
        }

        
        //rebote superior
        if ((this.yPos + this.radius ) >= (this.bar_l.yPos) &&
            (this.xPos <= (this.bar_l.xPos + this.bar_l.width)))
        {
            this.up = true;    
        }



        //paleta der
        if(((this.xPos + this.radius) >= this.bar_r.xPos && 
        (this.yPos <= (this.bar_r.yPos + this.height)) && 
        (this.yPos >= this.bar_r.yPos)) ){
            this.right = false
        }

        //rebote superior
        if ((this.yPos + this.radius) >= (this.bar_r.yPos) &&
            (this.xPos >= (this.bar_r.xPos))) 
        {
            this.up = true;    
        }

          


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
    
    bars.forEach(bars =>{
        bars.draw();
        bars.update();
    });

        sphere.draw();
        sphere.update(0, canvas.width, 0, canvas.height);

}

 function inputHandlers(bar_l,bar_r)
 {
     document.addEventListener("keydown", event=>{
         if(event.key == 'q') bar_l.yPos -= 10
         if(event.key == 'a') bar_l.yPos += 10
         if(event.key == 'o') bar_r.yPos -= 10
         if(event.key == 'l') bar_r.yPos += 10
     })
 }

 

function main()
{
    canvas = document.getElementById("animationCanvas");
    ctx = canvas.getContext("2d");

    
    
    let bar_l = new bar(10,30,20,50,'white',0,canvas.height);
    let bar_r = new bar(canvas.width - 30,30,20,50,'white',0,canvas.height);
    let sphere1 = new ball(canvas.width / 2,canvas.height/2, 10, 'white',canvas.height,canvas.width,bar_l.height,bar_l,bar_r);

    inputHandlers(bar_l,bar_r);
    update(sphere1,[bar_l,bar_r]);
    
}

