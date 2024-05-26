import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./geometric/MyPlane.js";
import { MySphere } from "./geometric/MySphere.js";
import { MyPanorama } from "./objects/MyPanorama.js";
import { MyTriangle } from "./geometric/MyTriangle.js";
import { MyFlower } from "./objects/MyFlower.js";
import { MyGarden } from "./objects/MyGarden.js";
import { MyRock } from "./objects/MyRock.js";
import { MyRockSet } from "./objects/MyRockSet.js";
import { MyBee } from "./objects/MyBee.js";
import { MyHive } from "./objects/MyHive.js";
import { MyDoor } from "./objects/MyDoor.js";
import { MyGrass } from "./objects/MyGrass.js";

export class MyScene extends CGFscene {
    constructor() {
        super();
        this.keysPressed = {};
    }

    init(application) {

        super.init(application);
        this.initCameras();
        this.initLights();
    
        // Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        // Enable blending for transparency
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);

        // Textures
        this.enableTextures(true);
        this.initTextures();
        this.appearance = new CGFappearance(this);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');

        // Initialize scene objects
        this.axis = new CGFaxis(this);
        this.plane = new MyPlane(this, 30);
        this.sphere = new MySphere(this, 1, 16, 8);
        this.triangle = new MyTriangle(this);
        this.flower = new MyFlower(this);
        this.garden = new MyGarden(this);
        this.rock = new MyRock(this, 5, 16, 8, 'rock1');
        this.rockSet = new MyRockSet(this, 7, 1);
        this.hive = new MyHive(this);
        this.bee = new MyBee(this, 0, 0, 0, this.garden, this.hive);
        this.door = new MyDoor(this);
        this.grass = new MyGrass(this);

        // Objects connected to MyInterface
        this.displayPanorama = true;
        this.displayTerrain = true;
        this.displayAxis = false;
        this.displaySphere = false;
        this.scaleFactor = 1;
        this.speedFactor = 1;
        this.displayGarden = true;
        this.displayFlower = false;
        this.displayRock = true;
        this.displayRockSet = true;
        this.displayBee = true;
        this.displayHive = true;
        this.displayDoor = true;
        this.displayGrass = true;
        
        // set the scene update period in milliseconds
        this.setUpdatePeriod(50);

        // set current time in milliseconds
        this.startTime = Date.now();

        // Set texture for the plane
        this.appearance.setTexture(this.texture);

        // Enable alpha blending
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);
    }

    initTextures(){
        this.panoramaTexture = new CGFtexture(this, "textures/panorama.jpg");
        this.panorama = new MyPanorama(this, this.panoramaTexture);
        this.terrainAppearance = new CGFappearance(this);
        this.terrainTexture = new CGFtexture(this, "textures/ground2.jpg");
        this.terrainAppearance.setTexture(this.terrainTexture);
        this.terrainAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.sphereTexture = new CGFtexture(this, "textures/earth.jpg");
        this.sphereAppearance = new CGFappearance(this);
        this.sphereAppearance.setTexture(this.sphereTexture);
        this.sphereAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.flowerAppearance = new CGFappearance(this);
        this.rockTexture = new CGFtexture(this, "textures/rock.jpg");
        this.rockAppearance = new CGFappearance(this);
        this.rockAppearance.setTexture(this.rockTexture);
        this.rockAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.hiveTexture = new CGFtexture(this, "textures/wood.jpg");
        this.hiveAppearance = new CGFappearance(this);
        this.hiveAppearance.setTexture(this.hiveTexture);
        this.hiveAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.grassTexture = new CGFtexture(this, "textures/green.jpg");
        this.grassAppearance = new CGFappearance(this);
        this.grassAppearance.setTexture(this.grassTexture);
        this.grassAppearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    initLights() {
        // Light 0
        this.lights[0].setPosition(15, 0, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();

        // Light 1
        this.lights[1].setPosition(-15, 0, 5, 1);
        this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[1].enable();
        this.lights[1].update();

        // Light 2
        this.lights[2].setPosition(0, 15, 5, 1);
        this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[2].enable();
        this.lights[2].update();

        // Light 3
        this.lights[3].setPosition(120, -50, 0, 1);
        this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[3].enable();
        this.lights[3].update();
    }

    initCameras() {
        this.camera = new CGFcamera(
            1.0,
            0.1,
            1000,
            vec3.fromValues(50, 10, 15),
            vec3.fromValues(0, 0, 0)
        );
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    display() {
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
        // Initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();
    
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
    
        // Draw terrain if enabled
        if (this.displayTerrain) {
            this.pushMatrix();
            this.terrainAppearance.apply();
            this.translate(0, -100, 0);
            this.scale(400, 400, 400);
            this.rotate(-Math.PI / 2.0, 1, 0, 0);
            this.plane.display();
            this.popMatrix();
        }
    
        // Draw panorama
        if (this.displayPanorama) {
            this.panorama.display();
            this.appearance.setTexture(null);
        }
    
        // Draw sphere if enabled
        if (this.displaySphere) {
            this.pushMatrix();
            this.sphereAppearance.apply();
            this.sphere.display();
            this.popMatrix();
        }
    
        // Draw axis if enabled
        if (this.displayAxis) {
            this.axis.display();
        }

        if(this.displayFlower){
            this.flowerAppearance.apply();
            this.flower.display();
        }

        if (this.displayGarden) {
            this.flowerAppearance.apply();
            this.garden.display();
          }
          
        if(this.displayRock){
            this.pushMatrix();
            this.rockAppearance.apply();
            this.rock.display();
            this.popMatrix();
        }

        if(this.displayRockSet){
            this.rockAppearance.apply();
            this.rockSet.display();
        }

        if(this.displayBee){
            this.bee.display();
        } 

        if(this.displayHive){
            this.hiveAppearance.apply();
            this.hive.display();
        
            this.hiveAppearance.apply();
            this.door.setTexture(this.hiveAppearance);
            this.door.display();
        }

        if(this.displayGrass){
            this.grassAppearance.apply();
            this.grass.display();
        }
    }

    
  update(time) {

    let timeSinceStart = (time - this.startTime) / 1000.0;
    this.bee.update(timeSinceStart, this.scaleFactor, this.speedFactor);
  } 
}
