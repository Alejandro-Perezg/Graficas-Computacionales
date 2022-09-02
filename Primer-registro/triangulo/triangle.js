

class Triangle
{
    constructor(points)
    {
        this.vertex1 = points[0]
        this.vertex2 = points[1]
        this.vertex3 = points[2]
        
    }
    draw()
    {
        ctx.beginPath()
        ctx.moveTo(this.vertex1[0],this.vertex1[1])
        ctx.lineTo(this.vertex2[0],this.vertex2[1])
        ctx.lineTo(this.vertex3[0],this.vertex3[1])
        ctx.closePath()
        ctx.strokeStyle = 'red'
        ctx.stroke()
    }

}

function getMids(points)
{
    let vertex1 = points[0]
    let vertex2 = points[1]
    let vertex3 = points[2]
    
    midA = Array((vertex1[0] + vertex2[0])/2, (vertex1[1] + vertex2[1])/2)
    midB = Array((vertex2[0] + vertex3[0])/2, (vertex2[1] + vertex3[1])/2)
    midC = Array((vertex1[0] + vertex3[0])/2, (vertex1[1] + vertex3[1])/2)
    let newPoints = [midA, midB, midC]

    return newPoints
}

function drawLevels(points,steps)
{
    let triangle = new Triangle(points).draw()
    if (steps > 0) { 
        let newPoints = getMids(points)
        drawLevels([points[0], newPoints[0],newPoints[2]], steps - 1)
        drawLevels([points[1], newPoints[0],newPoints[1]], steps - 1)  
        drawLevels([points[2], newPoints[1],newPoints[2]], steps - 1)          

    }
}

        function getSliderVal(canvas,points)
{
    document.getElementById("slider").oninput = function(event)
    {
        let steps = event.target.value
        document.getElementById("sliderValue").innerHTML = "Levels: " + event.target.value
        ctx.clearRect(0,0,canvas.width,canvas.height)
        drawLevels(points,steps)
    };
}

function main()
{
 
    let points = [[200,100],[100,300],[300,300]]
    let canvas = document.getElementById("htmlCanvas")
    ctx = canvas.getContext("2d")
    getSliderVal(canvas,points)
}
