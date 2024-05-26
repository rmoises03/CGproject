import { CGFobject, CGFtexture, CGFappearance } from '../../lib/CGF.js';

export class MyPollen extends CGFobject {
    constructor(scene, radius, slices, stacks, inside = false, north = 1, south = 1) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.insideFactor = inside ? -1 : 1;
        this.northFactor = north;
        this.southFactor = south;
        this.initBuffers();
        this.initMaterials();
    }

    initMaterials() {
        this.pollenTexture = new CGFtexture(this.scene, "textures/pollen.jpg");
        this.pollenAppearance = new CGFappearance(this.scene);
        this.pollenAppearance.setTexture(this.pollenTexture);
        this.pollenAppearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Generate vertices and normals for the sides
        for (let stack = 0; stack <= this.stacks * 2; stack++) {
            const angle = -Math.PI / 2 + (Math.PI * stack) / (2 * this.stacks);
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);

            this.vertices.push(this.radius * cosAngle, this.radius * sinAngle * 1.2, 0); // Adjusted the scaling factor for y-coordinate
            this.normals.push(this.insideFactor * cosAngle, this.insideFactor * sinAngle, 0);
            this.texCoords.push(0, 1 - stack / (this.stacks * 2));
        }

        // Generate vertices, normals, and indices for the top and bottom
        for (let slice = 0; slice <= this.slices; slice++) {
            const angleXZ = (2 * Math.PI * slice) / this.slices;
            const cosAngleXZ = Math.cos(angleXZ);
            const sinAngleXZ = Math.sin(angleXZ);

            // Generate vertex and normal for the top
            this.vertices.push(0, -this.radius, 0);
            this.texCoords.push(0, 1);
            this.normals.push(0, this.insideFactor, 0);

            for (let stack = 0; stack <= this.stacks * 2; stack++) {
                const angleXY = -Math.PI / 2 + (Math.PI * stack) / (2 * this.stacks);
                const yFactor = angleXY >= 0 ? this.northFactor : this.southFactor;
                const cosAngleXY = Math.cos(angleXY);
                const sinAngleXY = Math.sin(angleXY);

                const x = cosAngleXZ * cosAngleXY;
                const y = sinAngleXY * 1.2 * yFactor; // Adjusted the scaling factor for y-coordinate
                const z = sinAngleXZ * cosAngleXY;

                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                this.normals.push(this.insideFactor * x, this.insideFactor * y, this.insideFactor * z);

                // Calculate texture coordinates and invert
                this.texCoords.push(1 - slice / this.slices, 1 - stack / (this.stacks * 2));

                // Calculate indices
                const points = this.vertices.length / 3;
                const indexC = points - 2;
                const indexD = points - 1;
                const indexB = indexD - (this.stacks * 2 + 1);
                const indexA = indexB - 1;

                if (this.insideFactor === -1) {
                    this.indices.push(indexA, indexC, indexD, indexA, indexD, indexB);
                } else {
                    this.indices.push(indexD, indexC, indexA, indexB, indexD, indexA);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        this.pollenAppearance.apply();
        super.display();
    }
}
