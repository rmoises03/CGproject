import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js';
import { MyPetal } from './MyPetal.js';
import { MyReceptacle } from './MyReceptacle.js';
import { MyStem } from './MyStem.js';
import { MyPollen } from './MyPollen.js';

export class MyFlower extends CGFobject {
    constructor(scene) {
        super(scene);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.outerRadius = Math.random() * 4 + 3;
        this.petalRadius = Math.random() * 0.3 + 0.3;
        this.curvatureAngle = Math.random() * Math.PI / 2 - Math.PI / 4;
        this.numPetals = Math.floor(Math.random() * 7) + 2;
        this.petalColor = [Math.random(), Math.random(), Math.random(), 1];
        this.receptacleRadius = Math.random() * 0.3 + 0.3;
        this.receptacleColor = [Math.random(), Math.random(), Math.random(), 1]
        this.stemRadius = Math.random() * 0.1 + 0.1;
        this.stemHeight = Math.random() * 2 + 1;
        this.stemSlices = 10;
        this.stemStacks = 10;
        this.stemColor = [Math.random(), Math.random(), Math.random(), 1];
        this.initComponents();
    }

    initComponents() {
        // Create petals
        this.petalTexture = new CGFtexture(this.scene, 'textures/pinkpetal.jpg');
        this.stemTexture = new CGFtexture(this.scene, 'textures/stem.jpeg');
        this.receptacleTexture = new CGFtexture(this.scene, 'textures/receptacle.jpg');
        this.petals = [];
        const petalAngle = (2 * Math.PI) / this.numPetals;
        const curvatureAngle = this.curvatureAngle;

        this.petalAppearance = new CGFappearance(this.scene);
        this.petalAppearance.setShininess(10.0);
        this.petalAppearance.setTexture(this.petalTexture);
        this.petalAppearance.setTextureWrap('MIRROR', 'MIRROR');
        
        for (let i = 0; i < this.numPetals; i++) {
            const petal = new MyPetal(this.scene, this.receptacleRadius, petalAngle, curvatureAngle, this.petalRadius);
            this.petals.push(petal);
        }
    
        // Create receptacle
        this.receptacle = new MyReceptacle(this.scene, this.receptacleRadius);
        this.receptacleAppearance = new CGFappearance(this.scene);
        this.receptacleAppearance.setShininess(10.0);
        this.receptacleAppearance.setTexture(this.receptacleTexture);
        this.receptacleAppearance.setTextureWrap('REPEAT', 'REPEAT');
    
        // Create stem
        this.stem = new MyStem(this.scene, this.stemRadius, this.stemHeight, this.stemSlices, this.stemStacks);
        this.stemAppearance = new CGFappearance(this.scene);
        this.stemAppearance.setShininess(10.0);
        this.stemAppearance.setTexture(this.stemTexture);
        this.stemAppearance.setTextureWrap('REPEAT', 'REPEAT');

        this.pollen = new MyPollen(this.scene, 0.1, 16, 8);
    }
    


    display() {
        this.scene.scale(this.outerRadius, this.outerRadius, this.outerRadius);
    
        // Draw stem
        this.scene.pushMatrix();
        this.scene.translate(0, this.stemHeight / 2, 0); // Shift the stem upwards by half its height
        this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Rotate the stem 90 degrees around the X-axis
        this.stemAppearance.apply();
        this.stem.display();
        this.scene.popMatrix();
    
        // Calculate the adjusted position for petals and receptacle
        const rotationAngle = Math.PI / 6; // This should be the same rotation angle used in MyStem
        const adjustedZ = (this.stemHeight / 2) * Math.tan(rotationAngle); // Calculate the Z translation
    
        // Draw petals
        this.scene.pushMatrix();
        this.scene.translate(0,  this.stemHeight * Math.cos(rotationAngle), adjustedZ); // Translate the receptacle in Z direction
        this.scene.rotate(Math.PI / 6, 1, 0, 0); // Rotate the petals to match the stem
        this.scene.rotate(- Math.PI / 2, 1, 0, 0); // Rotate the petals to match the stem
        for (let i = 0; i < this.numPetals; i++) {
            this.scene.pushMatrix();
            if ((2 * Math.PI) / this.numPetals === Math.PI) {
                this.scene.rotate(Math.PI / 2 + i * (2 * Math.PI) / this.numPetals, 0, 0, 1);
            }
            else if ((2 * Math.PI) / this.numPetals === Math.PI / 2) {
                this.scene.rotate(Math.PI / 4 + i * (2 * Math.PI) / this.numPetals, 0, 0, 1);
            }
            else {
                this.scene.rotate(i * (2 * Math.PI) / this.numPetals, 0, 0, 1); // Rotate each petal
            }
            this.petalAppearance.apply();
            this.petals[i].display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    
        // Draw receptacle
        this.scene.pushMatrix();
        this.scene.translate(0, this.stemHeight * Math.cos(rotationAngle), adjustedZ); // Translate the receptacle in Z direction
        this.scene.rotate(Math.PI / 6, 1, 0, 0); // Rotate the petals to match the stem
        this.scene.rotate(- Math.PI / 2, 1, 0, 0); // Rotate the petals to match the stem
        this.receptacleAppearance.apply();
        this.receptacle.display();
        this.scene.popMatrix();

        // Draw pollen
        if (this.pollen != null) {
            this.scene.pushMatrix();
            this.scene.translate(0, this.stemHeight * Math.cos(rotationAngle) + 0.1, adjustedZ);
            this.scene.rotate(Math.PI / 6, 1, 0, 0); // Rotate the petals to match the stem
            this.pollen.display(); // Display the pollen
            this.scene.popMatrix();
        }
    }
}