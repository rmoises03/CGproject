import { CGFobject } from '../../lib/CGF.js';
import { MyRock } from './MyRock.js';

export class MyRockSet extends CGFobject {
    constructor(scene, baseSize, radius) {
        super(scene);
        this.baseSize = baseSize;
        this.radius = radius;
        this.rocks = [];
        this.initRocks();
    }

    initRocks() {
        let id = 0;
        for (let i = this.baseSize; i > 0; i -= 2) {
            for (let j = 0; j < i; j++) {
                for (let k = 0; k < i; k++) {
                    const scale = [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5];
                    const rock = new MyRock(this.scene, this.radius, 20, 20);
                    this.rocks.push({ id, rock, position: [j - i / 2, (this.baseSize - i) / 2, k - i / 2], scale });
                    id++;
                }
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(10, 10, 10);
        this.scene.translate(15, -9, 0);
        for (let i = 0; i < this.rocks.length; i++) {
            const { rock, position, scale } = this.rocks[i];
            this.scene.pushMatrix();
            this.scene.translate(...position);
            rock.display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }
}