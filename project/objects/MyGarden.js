import { CGFobject } from '../../lib/CGF.js';
import { MyFlower } from "./MyFlower.js";

export class MyGarden {
    constructor(scene) {
        this.scene = scene;
        this.rows = 5;
        this.cols = 5;

        this.flowers = [];
        this.offsets = [];
        for (let i = 0; i < this.rows; i++) {
            this.flowers[i] = [];
            this.offsets[i] = [];
            for (let j = 0; j < this.cols; j++) {
                // Create a new flower at each grid position
                this.flowers[i][j] = new MyFlower(scene);
                // Calculate and store the offsets
                const offsetX = (Math.random() - 0.5) * 6;
                const offsetZ = (Math.random() - 0.5) * 6;
                this.offsets[i][j] = { offsetX, offsetZ };
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(40, -100, -130);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.scene.pushMatrix();
                // Translate to the correct position
                const { offsetX, offsetZ } = this.offsets[i][j]; // Get the stored offsets
                this.scene.translate(i * 12 + offsetX, 0, j * 12 + offsetZ); // Add the offset to the translation
                this.flowers[i][j].x = 40 + i * 12 + offsetX;
                this.flowers[i][j].y = -100 + this.flowers[i][j].outerRadius * (this.flowers[i][j].stemHeight * Math.cos(Math.PI / 6) + 0.1);
                this.flowers[i][j].z = -130 + j * 12 + offsetZ + this.flowers[i][j].outerRadius * (this.flowers[i][j].stemHeight / 2) * Math.tan(Math.PI / 6);
                // Display the flower
                this.flowers[i][j].display();
                this.scene.popMatrix();
            }
        }
        this.scene.popMatrix();
    }

    getNearbyFlowers(x, z, tolerance) {
        let nearbyFlowers = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const flower = this.flowers[i][j];
                if (Math.abs(flower.x - x) < tolerance && Math.abs(flower.z - z) < tolerance) {
                    nearbyFlowers.push(flower);
                }
            }
        }
        return nearbyFlowers;
    }
}