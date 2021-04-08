import * as Paper from "paper";
import {Path, Point, Raster, view} from "paper";





window.onload = () => {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('content');
    if (!canvas) {
        throw new Error('Could not find canvas named content in document!');
    }

    Paper.setup(canvas);

    let img = document.createElement("img");
    img.src = "./assets/DG_HEAD/DG_Insta.png";
    img.id = "mona"
    document.body.appendChild(img);


// Create a raster item using the image tag with id='mona'
    let raster = new Raster('mona');

// Move the raster to the center of the view
    raster.position = view.center;
    raster.height = 1080;
    raster.width = 1080;




// Create the blue blob
    let blob: paper.PathItem = new Path.Rectangle(view.bounds.expand(-1));

// Create the inner rectangle in which green rectangles cannot go
    let insideLimit = new Path.Rectangle(blob.bounds.expand(-1000));
    //insideLimit.strokeColor = 'orange';
    insideLimit.strokeWidth = 3;
    insideLimit.dashArray = [7, 3];

// Create 5 green rectangles which will move around and be subtracted to the blob
    let rectangles: any[] | Path.Circle[] = [];
    for(let i=0 ; i<20 ; i++) {

        // Find a random position on the view which is not in the insideLimit rectangle
        let position = new Point(200, 200);
        while(insideLimit.bounds.contains(position)) {
            position = new Point(200, 200);
        }

        // Create a green rectangle at this location and initialize it with a random speed
        //let rectangle = new Path.Rectangle(position.subtract(-300, -300), position.add(-100, -100));
        // @ts-ignore
        let rectangle = new Path.Circle(position.subtract(90),position.add(5));
        rectangle.fillColor = 'transparent';
        rectangle.data.speed = Point.random().multiply(Math.random()* 12);

        rectangles.push(rectangle);
    }


// Update the blob: recreate it, subtract all green rectangles from it, and smooth it
    function updateBlob() {
        // Recreate the blob
        blob.remove();
        blob = new Path.Rectangle(view.bounds.expand(3));
        blob.fillColor = '#1ee022';
        // Subtract all green rectangles from it
        for(let rectangle of rectangles) {
            let newPath = blob.subtract(rectangle);
            blob.remove();
            blob = newPath;
        }
        // Smooth it: choose your smoothing function (pick one in the documentation)
    }

    view.onFrame = function(event) {
        // Move the green rectangles
        for(let rectangle of rectangles) {
            // Move toward the "speed"
            rectangle.position = rectangle.position.add(rectangle.data.speed);
            // If the rectangle is going out of the screen: inverse its speed on the direction of concern
            if(rectangle.position.x > view.bounds.width || rectangle.position.x < 0){
                rectangle.data.speed.x *= -1;
            }
            if(rectangle.position.y > view.bounds.height || rectangle.position.y < 0){
                rectangle.data.speed.y *= -1;
            }
            // If the rectangle is going inside the inner limit: inverse its speed
            if(insideLimit.bounds.contains(rectangle.position)) {
                rectangle.data.speed *= -1;
            }
        }
        updateBlob();
        insideLimit.bringToFront();
    }
}

