import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MySphere } from '../geometric/MySphere.js';

export class MyPanorama extends CGFobject {

    constructor(scene, texture) {
        super(scene)
        this.sphere = new MySphere(this.scene, 200, 40, 40, true)
        this.material = new CGFappearance(this.scene)
        this.material.setEmission(1, 1, 1, 1)
        this.material.setTexture(texture)
    }

    display() {
        this.scene.pushMatrix()
        this.material.apply()
        this.sphere.display()
        this.scene.popMatrix()
    }
}