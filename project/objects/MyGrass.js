import { CGFobject } from '../../lib/CGF.js';

export class MyGrass extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
        this.rotation = 0;
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        // Base
        this.vertices.push(0, 0, 0);
        this.vertices.push(1, 0, 0);
        this.vertices.push(0.5, 4, 0.5); // Peak of the triangle (height is 4 times the base)
    
        // Single triangle
        this.indices.push(0, 1, 2);
    
        // Duplicate triangle with reversed vertices order
        this.vertices.push(0.5, 4, 0.5);
        this.vertices.push(1, 0, 0);
        this.vertices.push(0, 0, 0);
    
        // Duplicate triangle indices
        this.indices.push(3, 4, 5);
    
        // Calculate the normal for the first triangle
        let v1 = [1 - 0, 0 - 0, 0 - 0];
        let v2 = [0.5 - 0, 4 - 0, 0.5 - 0];
        let normal1 = [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    
        // Normals
        this.normals.push(...normal1);
        this.normals.push(...normal1);
        this.normals.push(...normal1);
    
        // Calculate the normal for the second triangle
        let v3 = [1 - 0, 0 - 0, 0 - 0];
        let v4 = [0 - 0.5, 0 - 4, 0 - 0.5];
        let normal2 = [
            v3[1] * v4[2] - v3[2] * v4[1],
            v3[2] * v4[0] - v3[0] * v4[2],
            v3[0] * v4[1] - v3[1] * v4[0]
        ];
    
        // Duplicate normals for the second face
        this.normals.push(...normal2);
        this.normals.push(...normal2);
        this.normals.push(...normal2);
    
        // Texture coordinates
        this.texCoords.push(0, 1);
        this.texCoords.push(1, 1);
        this.texCoords.push(0.5, 0); // Peak of the triangle
    
        // Duplicate texture coordinates for the second face
        this.texCoords.push(0.5, 0);
        this.texCoords.push(0, 1);
        this.texCoords.push(1, 1);
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    setTexture(texture) {
        this.texture = texture;
    }

    display() {
        for (let i = 0; i < 50; i++) {
            for (let j = 0; j < 50; j++) {
                this.scene.pushMatrix();
    
                // Translate to the position of the tile
                this.scene.translate(i-50, -100, j-140);
    
                // Increase the rotation angle by a small amount each frame
                this.rotation += 0.005;
    
                // Calculate a rotation angle that oscillates between -7.5 and 7.5 degrees
                let oscillatingRotation = Math.sin(this.rotation) * 30;
    
                // Rotate the triangle
                this.scene.rotate(oscillatingRotation * Math.PI / 180, 1, 0, 0);
    
                super.display();
    
                this.scene.popMatrix();
            }
        }
    }
}
