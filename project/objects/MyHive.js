import { CGFobject } from '../../lib/CGF.js';

export class MyHive extends CGFobject {
    constructor(scene, pollen) {
        super(scene);
        this.initBuffers();
        this.pollen = pollen;
        this.scale = 1;
    }

    initBuffers() {
        this.vertices = [
            // Front face
            0, 0, 0,
            50, 0, 0,
            50, 50, 0,
            0, 50, 0,
            25, 75, 0,
        
            // Back face
            0, 0, 50,
            50, 0, 50,
            50, 50, 50,
            0, 50, 50,
            25, 75, 50
        ];

        this.indices = [
            // Front face
            0, 1, 2,
            2, 3, 0,
            2, 4, 3,
        

        
            // Side faces
            0, 5, 1,
            1, 5, 6,
            1, 6, 2,
            2, 6, 7,
            2, 7, 4,
            4, 7, 9,
            4, 9, 3,
            3, 9, 8,
            3, 8, 0,
            0, 8, 5,
        
            // Reverse of each triangle
            2, 1, 0,
            0, 3, 2,
            3, 4, 2,
            7, 6, 5,
            5, 8, 7,
            8, 9, 7,
            1, 5, 0,
            6, 5, 1,
            2, 6, 1,
            7, 6, 2,
            4, 7, 2,
            9, 7, 4,
            3, 9, 4,
            8, 9, 3,
            0, 8, 3,
            5, 8, 0
        ];

        this.normals = [
            // Front face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Back face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        this.texCoords = [
            // Front face
            0, 1,
            1, 1,
            1, 0.5,
            0, 0.5,
            0.5, 0,
        
            // Back face
            1, 1,
            0, 1,
            0, 0.5,
            1, 0.5,
            0.5, 0,
        
            // Bottom face
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        
            // Top face
            0.5, 0,
            1, 0.5,
            0, 0.5,
            0.5, 1,
            1, 1
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        this.scene.pushMatrix();    
        this.scene.translate(150, -50, 0);
        this.scene.scale(0.6, 0.6, 0.6);
        this.scene.rotate(Math.PI/6, 0, -1, 0);
        this.scene.rotate(Math.PI/2, 0, -1, 0);
        super.display();
        this.scene.popMatrix();

        if (this.pollen) {
            this.scene.pushMatrix();
            this.scene.scale(this.scale, this.scale, this.scale);
            this.scene.translate(0.6 * 210, 0.6 * -50, 0);
            this.pollen.display();
            this.scene.popMatrix();
        }
    }
}