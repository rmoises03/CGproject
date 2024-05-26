import { CGFobject } from '../../lib/CGF.js';

export class MyDoor extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Front face
            0, 0, 0,
            50, 0, 0,
            50, 50, 0,
            0, 50, 0,
            // Back face
            0, 0, 1,
            50, 0, 1,
            50, 50, 1,
            0, 50, 1,
        ];
        
        this.indices = [
            // Front face
            0, 1, 2,
            2, 3, 0,
            // Back face
            4, 5, 6,
            4, 6, 7,
        ];
        
        this.normals = [
            // Front face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            // Back face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];
        
        this.texCoords = [
            // Front face
            0, 1,
            1, 1,
            1, 0,
            0, 0,
            // Back face
            0, 1,
            1, 1,
            1, 0,
            0, 0,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    setTexture(texture) {
        this.texture = texture;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(150, -50, 0);
        this.scene.rotate(Math.PI/6, 0, -1, 0);
        this.scene.rotate(Math.PI/2, 0, -1, 0);
        this.scene.translate(0, 0, 29.95);
        this.scene.scale(0.6, 0.4, 0.6);
        super.display();
        this.scene.popMatrix();
    }
}