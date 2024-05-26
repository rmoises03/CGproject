import { CGFobject } from '../../lib/CGF.js';

export class MyPetal extends CGFobject {
    constructor(scene, receptacleRadius, petalAngle, curvatureAngle, petalRadius) {
        super(scene);
        this.receptacleRadius = receptacleRadius;
        this.petalAngle = petalAngle;
        this.curvatureAngle = curvatureAngle;
        this.petalRadius = petalRadius;
        this.initBuffers();
    }

    initBuffers() {
        let cosAngle = Math.cos(this.petalAngle) * this.petalRadius;
        let sinAngle = Math.sin(this.petalAngle) * this.petalRadius;

        if (cosAngle < 0.01) {
            cosAngle = this.petalRadius;
        }
        if (sinAngle < 0.01) {
            sinAngle = this.petalRadius;
        }
    
        this.vertices = [
            0, this.receptacleRadius, 0,
            cosAngle, this.receptacleRadius + sinAngle, 0,
            -cosAngle, this.receptacleRadius + sinAngle, 0,
            // Add vertices for the other side
            0, this.receptacleRadius, 0,
            cosAngle, this.receptacleRadius + sinAngle, 0,
            -cosAngle, this.receptacleRadius + sinAngle, 0,
            // Add vertices for the second triangle
            cosAngle, this.receptacleRadius + sinAngle, 0,
            -cosAngle, this.receptacleRadius + sinAngle, 0,
            this.curvatureAngle * this.petalRadius, this.receptacleRadius + 2 * sinAngle, this.curvatureAngle * this.petalRadius,
            // Add vertices for the other side of the second triangle
            cosAngle, this.receptacleRadius + sinAngle, 0,
            -cosAngle, this.receptacleRadius + sinAngle, 0,
            this.curvatureAngle * this.petalRadius, this.receptacleRadius + 2 * sinAngle, this.curvatureAngle * this.petalRadius,
        ];
    
        this.indices = [
            0, 1, 2,
            // Add indices for the other side
            3, 5, 4,
            // Add indices for the second triangle
            6, 7, 8,
            // Add indices for the other side of the second triangle
            9, 11, 10
        ];
    
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            // Add normals for the other side
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            // Add normals for the second triangle
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            // Add normals for the other side of the second triangle
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];
    
        this.texCoords = [
            0.5, 0.5,
            1, 1,
            0, 1,
            // Add texture coordinates for the other side
            0.5, 0.5,
            1, 1,
            0, 1,
            // Add texture coordinates for the second triangle
            1, 1,
            0, 1,
            0.5, 0,
            // Add texture coordinates for the other side of the second triangle
            1, 1,
            0, 1,
            0.5, 0
        ];
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}