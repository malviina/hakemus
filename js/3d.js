window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}



// DATA FOR ROTATIONS

// [id, x, y, zoom, fix]
var rotations = [["helper", 25, 125, 4, -0.7],
                 ["helper2", 10, -60, 1, 1]];

// INITIAL VARIABLES

var width = 0.7*window.innerWidth;
var height = window.innerHeight; 
var scaleInit = 0.4;
var zoom = 200;
var camIn = zoom;
var scrollPercent = 0;
var scale = scaleInit;
if (width < 800) {
    scale *= width/800;
};

var rotating = false;

var k = 0; // current rotation cycle
var prevRot = 0;
var data;
var helperId;
var rotX;
var rotY;
var rotZ;
var rotFix;

var currentRotX = 0;
var currentRotY = 0;
var currentCamX = 0;
var currentCamZ = 10;
var currentCamY = 0.5;


// _SETUP A NEW SCENE

 var scene = new THREE.Scene();

// Setup the vamera

var camera = new THREE.PerspectiveCamera( 50, width / height, 1, 20000 ); 

//var camera = new THREE.OrthographicCamera(width/-camIn, width/camIn, height/camIn, height/ -camIn, 0.01, 2000);
camera.position.z = currentCamZ;
camera.position.y = currentCamY;

// Setup the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.getElementById("renderer").appendChild(renderer.domElement);
renderer.setClearColor(0x101010, 1);

// Add the lights
var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

var light = new THREE.PointLight( 0xFFFFDD );
light.position.set( -15, 10, 15 );
scene.add( light );


// Models
var model;

// Load the JSON files and provide callback functions (modelToScene
var loader = new THREE.JSONLoader();
loader.load( "./models/goat.json", addModelToScene );



// After loading JSON from our file, we add it to the scene
function addModelToScene( geometry, materials ) {
    var material = new THREE.MeshFaceMaterial(materials);
    model = new THREE.Mesh( geometry, material );
    model.scale.set(scale, scale, scale);
    model.position.y -= 0.5;
    model.rotation.x = 0;
    model.rotation.y = 0;
    scene.add( model );   
}

var render = function () {
    setTimeout( function() {
        requestAnimationFrame(render );
    }, 1000/15 );
    renderer.render(scene, camera);
}

render();


window.addEventListener("scroll", function() {
 /*   if (!rotating) {
        if ( typeof model != "undefined") {
            currentRotX = model.rotation.x;
            currentRotY = model.rotation.y;
        };
    };*/
    if (rotating) {
        initRotation();
    }
});
window.addEventListener("resize", function() { resize(); });


// RE-RENDER THE SCENE AFTER RESIZE

function resize() {
    width = 0.7*window.innerWidth;
    height = window.innerHeight;
    scale = scaleInit;
    if (width < 800) {
        scale *= width/800;
    };

    var currentRot = rotations[k];
    
    camera.aspect = width / height; 
    //camera.left = width/-camIn; camera.right = width/camIn; camera.top = height/camIn; camera.bottom = height/ -camIn;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    model.scale.set(scale, scale, scale);
    camera.position.x = currentCamX + currentRot[4]*countScroll(currentRot[0])*width/800;

    renderer.render(scene, camera);
};

// CHECK NEXT ROTATION

function initRotation() {
    data = rotations[k];
    helperId = data[0];
    rotX = data[1];
    rotY = data[2];
    rotZ = data[3];
    rotFix = data[4];

    rotate(helperId, rotX, rotY, rotZ, rotFix);
};

// FUNCTIONS FOR CHANGING VIEW

// Zoom in and out
function forward(id, value, fix) {
    camera.position.x = currentCamX + fix*countScroll(id)*width/800;
    camera.position.z = currentCamZ - value*countScroll(id);
}

// Rotate the model
function rotate(id, x, y, z, fix) {

    if (fix == null) {
        fix = 0;
    };
    
    if ( typeof model != "undefined") {

        forward(id, z, fix)
        model.rotation.y = currentRotY - countScroll(id)*y* Math.PI/180;
        model.rotation.x = currentRotX + countScroll(id)*x*Math.PI/180;

        camIn = zoom+(600-zoom)*countScroll(id);;
        //camera.left = width/-camIn; camera.right = width/camIn; camera.top = height/camIn; camera.bottom = height/ -camIn;
        camera.aspect = width / height; 
        camera.updateProjectionMatrix();
    }

    //var box = new THREE.Box3().setFromObject( model);
    // console.log(box.min, box.max, box.size());
    renderer.render(scene, camera);
};

// Count the scrollpercent
function countScroll(id) {
    var helper = document.getElementById(id);
    var helper_height = helper.scrollHeight;
    var screen_height = document.documentElement.clientHeight;

    var rect = helper.getBoundingClientRect(); // This is to find the position of the helper in relation to the window screen
    var helper_scrolled = screen_height - rect.top - screen_height; // the last value gives some offset so that the drawing begins a bit later then when the sections top comes to view

    if (helper_scrolled < 0) {
            helper_scrolled = 0;
    }

    if (helper_scrolled > helper_height) {
        helper_scrolled = helper_height;
        rotating = false;
    }

    var scrollpercent = helper_scrolled / helper_height;


    document.getElementById("timer").innerHTML = "helper scrolled: " + helper_scrolled + "<br>" + "helper height: " + helper_height + "<br>" + "screen height: " + screen_height + "<br>" + "scrollpercent: " + scrollpercent + "<br>" + (scrollpercent * (4*Math.PI));

    return scrollpercent;
};

function toEm(value) {
    return value / parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);
}


// WAYPOINTS

var trigger0_fade = new Waypoint({
    element: document.getElementById("trigger0"),
    handler: function(direction) {
        document.getElementById("info1").classList.toggle("fade");
    },
    offset: "100%"
});

// First helper
var rotate1 = new Waypoint({
    element: document.getElementById("helper"),
    handler: function(direction) {
        if (direction == "down") {
            k = 0;
            rotating = true;
            
        };
        if (direction == "up") {
            rotating = false;
        }
    }
});

var stopRot1 = new Waypoint({
    element: document.getElementById("helper"),
    handler: function(direction) {

        if (direction == "up") {
            rotating = true;
        }
    },
    offset: function() {
        return -this.element.clientHeight
    }
});

// Second helper
var rotate2 = new Waypoint({
    element: document.getElementById("helper2"),
    handler: function(direction) {
        if (direction == "down") {
            k = 1;
            if (typeof model != "undefined") {
                currentRotX = model.rotation.x;
                currentRotY = model.rotation.y;
                currentCamX = camera.position.x;
                currentCamZ = camera.position.z;
                rotating = true;
            }
        };
        if (direction == "up") {
            k=0;
            currentRotX = 0;
            currentRotY = 0;
            currentCamX = 0;
            currentCamZ = 10;
            rotating = true;
        }
    }
});

var stopRot2 = new Waypoint({
    element: document.getElementById("helper2"),
    handler: function(direction) {
        document.getElementById("info3").classList.toggle("fade");

        if (direction == "up") {
            rotating = true;
        };
    },
    offset: function() {
        return -this.element.clientHeight
    }
});


