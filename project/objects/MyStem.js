import { CGFobject } from '../../lib/CGF.js';

export class MyStem extends CGFobject {
    constructor(scene, radius, height, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        const stackHeight = this.height / (2 * this.stacks);
        const stackAngle = (2 * Math.PI) / this.slices;
        const rotationAngle = Math.PI / 6;
    
        for (let part = 0; part < 2; part++) {
            for (let i = 0; i <= this.stacks; i++) {
                const stackZ = part * this.height / 2 + i * stackHeight - this.height / 2;
    
                for (let j = 0; j <= this.slices; j++) {
                    const theta = j * stackAngle;
    
                    let x = this.radius * Math.cos(theta);
                    let y = this.radius * Math.sin(theta);
                    let z = stackZ;
    
                    // rotate the second part
                    if (part === 1) {
                        const newY = y * Math.cos(rotationAngle) - z * Math.sin(rotationAngle);
                        const newZ = y * Math.sin(rotationAngle) + z * Math.cos(rotationAngle);
                        y = newY;
                        z = newZ;
                    }
    
                    this.vertices.push(x, y, z);
                    this.normals.push(x, y, 0);
                    this.texCoords.push(j / this.slices, (part * this.stacks + i) / (2 * this.stacks));
    
                    if (i < this.stacks && j < this.slices) {
                        const first = (part * this.stacks + i) * (this.slices + 1) + j;
                        const second = first + this.slices + 1;
                        this.indices.push(first, second, first + 1, second, second + 1, first + 1);
                    }
                }
            }
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}