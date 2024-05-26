import { CGFobject } from '../../lib/CGF.js';

export class MyReceptacle extends CGFobject {
    constructor(scene, radius) {
        super(scene);
        this.radius = radius;
        this.initBuffers();
    }

    initBuffers() {
        const slices = 20; // Number of slices for the circle
    
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        // Vertices, normals and texture coordinates for the front side
        for (let i = 0; i <= slices; i++) {
            const angle = (i * 2 * Math.PI) / slices;
            const x = Math.cos(angle);
            const y = Math.sin(angle);
    
            this.vertices.push(this.radius * x, this.radius * y, 0);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0.5 + 0.5 * x, 0.5 + 0.5 * y);
    
            if (i > 0) {
                this.indices.push(0, i - 1, i);
            }
        }
    
        // Vertices, normals and texture coordinates for the back side
        for (let i = 0; i <= slices; i++) {
            const angle = (i * 2 * Math.PI) / slices;
            const x = Math.cos(angle);
            const y = Math.sin(angle);
    
            this.vertices.push(this.radius * x, this.radius * y, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5 + 0.5 * x, 0.5 + 0.5 * y);
    
            if (i > 0) {
                this.indices.push(slices + 1, slices + i + 1, slices + i);
            }
        }
    
        // Final indices to close the circle for both sides
        this.indices.push(0, slices, 1);
        this.indices.push(slices + 1, slices + 2, 2 * slices + 1);
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}