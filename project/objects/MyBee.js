import {CGFappearance, CGFobject, CGFtexture} from "../../lib/CGF.js";
import {MyCone} from "../geometric/MyCone.js";
import {MySphere} from "../geometric/MySphere.js";
import {MyCylinder} from "../geometric/MyCylinder.js";
import {MyWing} from "./MyWing.js";
import {MyAnimatorMovement} from "../animated/MyAnimatorMovement.js";
import {MyPollen} from "./MyPollen.js";

export class MyBee extends CGFobject {

    constructor(scene, x, y, z, garden, hive) {
        super(scene);
        this.garden = garden;
        this.hive = hive;

        // Elements
        this.antenna = new MyCone(scene, 5, 5);
        this.eye = new MySphere(scene, 0.5, 15, 15);
        this.head = new MySphere(scene, 1, 15, 15);
        this.body = new MySphere(scene, 1, 15, 15);
        this.paw = new MyCylinder(scene, 5, 5);
        this.claw = new MyCone(scene, 5, 5);
        this.tail = new MyCone(scene, 5, 5);
        this.wing = new MyWing(scene);

        // Movement
        this.scale = 1;
        this.speed = 0;
        this.orientation = 0;
        this.tailAngle = 0;
        this.wingAngle = Math.PI / 8;
        this.position = {x: x, y: y, z: z};
        this.defaultPosition = {x: x, y: y, z: z};
        this.descending = false;
        this.ascending = false;

        // Speed Factor
        this.lastSpeedFactor = 1;

        this.pollen = null;
        this.carryingPollen = false;
        this.initialY = 0;
        this.overFlower = false;
        this.positionHive = null;
        this.beeHiveMoveDone = false;
        this.positionBeeHiveModeDone = null;

        this.animatorMovement = new MyAnimatorMovement(-0.25, 0.25, 1, true, true);

        this.onAir = false;
        this.movingToHive = false;
        this.hiveTarget = { x: 0, y: 0, z: 0 };

        // Materials
        this.initMaterials();
    }

    initMaterials() {
        
        this.beeMaterial = new CGFappearance(this.scene);
        this.beeMaterial.setAmbient(0.8, 0.8, 0.8, 0.0);
        this.beeMaterial.setDiffuse(0.95, 0.95, 0.95, 0.0);
        this.beeMaterial.setSpecular(0.5, 0.5, 0.5, 0.0);
        this.beeMaterial.setTexture(new CGFtexture(this.scene, "textures/beeTexture.jpg"));
        this.beeMaterial.setTextureWrap('REPEAT', 'REPEAT');

        // Paw material
        this.pawMaterial = new CGFappearance(this.scene);
        this.pawMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.pawMaterial.setDiffuse(0.0, 0.0, 0.0, 1.0);
        this.pawMaterial.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.pawMaterial.setShininess(10.0);

        // Claw Material
        this.clawMaterial = new CGFappearance(this.scene);
        this.clawMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.clawMaterial.setDiffuse(0.0, 0.0, 0.0, 1.0);
        this.clawMaterial.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.clawMaterial.setShininess(10.0);

        // Antennas Material
        this.antennaMaterial = new CGFappearance(this.scene);
        this.antennaMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.antennaMaterial.setDiffuse(0.0, 0.0, 0.0, 1.0);
        this.antennaMaterial.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.antennaMaterial.setShininess(10.0);

        // Tail Material
        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
        this.tailMaterial.setDiffuse(0.0, 0.0, 0.0, 1.0);
        this.tailMaterial.setSpecular(0.0, 0.0, 0.0, 1.0);
        this.tailMaterial.setShininess(10.0);

        // Eye Material
        this.eyeMaterial = new CGFappearance(this.scene);
        this.eyeMaterial.setAmbient(0.05, 0.05, 0.05, 0.0);
        this.eyeMaterial.setDiffuse(0.05, 0.05, 0.05, 0.0);
        this.eyeMaterial.setSpecular(1, 1, 1, 0.0);
        this.eyeMaterial.setShininess(10.0);

        // Head Material
        this.headMaterial = new CGFappearance(this.scene);
        this.headMaterial.setAmbient(238/255, 173/255, 45/255, 0.0);
        this.headMaterial.setDiffuse(238/255, 173/255, 45/255, 0.0);
        this.headMaterial.setSpecular(238/255, 173/255, 45/255, 0.0);
        this.headMaterial.setShininess(5.0);

        // Wing Material
        this.wingMaterial = new CGFappearance(this.scene);
        this.wingMaterial.setAmbient(0.1, 0.1, 0.1, 0.1); // Alpha less than 1
        this.wingMaterial.setDiffuse(0.1, 0.1, 0.1, 0.1); // Alpha less than 1
        this.wingMaterial.setSpecular(0.1, 0.1, 0.1, 0.1); // Alpha less than 1
        this.wingMaterial.setShininess(10.0);
        this.wingMaterial.setEmission(0.1, 0.1, 0.1, 0.1); // Set the RGBA emission values
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.scale(this.scale, this.scale, this.scale);
        this.draw();
        this.scene.popMatrix();
        
        if (this.pollen) {
            this.scene.pushMatrix();
            this.scene.scale(this.scale, this.scale, this.scale);
            this.scene.translate(this.position.x, this.position.y - 2, this.position.z);
            this.pollen.display();
            this.scene.popMatrix();
        }
    }

    draw() {
        let time = Date.now() * 0.001;
        let wingRotation = Math.sin(time * 100 * Math.PI);

        // Body
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(1, 1.5, 1);
        this.beeMaterial.apply();
        this.body.display();
        this.scene.popMatrix();

        // Head
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.8, 0.8);
        this.scene.translate(0, 1, 1.7);
        this.headMaterial.apply();
        this.head.display();
        this.scene.popMatrix();

        // Paws
        this.scene.pushMatrix();
        this.scene.translate(-0.4, -0.8, 0.4);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.07, 0.07, 1.2);
        this.pawMaterial.apply();
        this.paw.display();
        this.scene.translate(10, -0.8, 0);
        this.paw.display();
        this.scene.popMatrix();

        // 2nd pair of paws
        this.scene.pushMatrix();
        this.scene.translate(-0.4, -0.8, -0.6);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.07, 0.07, 1.2);
        this.pawMaterial.apply();
        this.paw.display();
        this.scene.translate(10, -0.8, 0);
        this.paw.display();
        this.scene.popMatrix();
        
        // Claws
        this.scene.pushMatrix();
        this.scene.translate(-0.4, -2, 0.3);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.15, 0.65, 0.10);
        this.clawMaterial.apply();
        this.claw.display();
        this.scene.translate(4.65, 0, 0);
        this.claw.display();
        this.scene.popMatrix();

        // 2nd pair of claws
        this.scene.pushMatrix();
        this.scene.translate(-0.4, -2, -0.7);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.15, 0.65, 0.10);
        this.clawMaterial.apply();
        this.claw.display();
        this.scene.translate(4.65, 0, 0);
        this.claw.display();
        this.scene.popMatrix();

        // Antennas
        this.scene.pushMatrix();
        this.scene.translate(0.3, 1.5, 1.4)
        this.scene.rotate(-Math.PI / 5.5, 0, 0, 1);
        this.scene.scale(0.15, 0.6, 0.15);
        this.antennaMaterial.apply();
        this.antenna.display();

        // Top of the antenna
        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);
        this.scene.scale(0.5, 0.1, 0.5);
        this.antennaMaterial.apply();
        this.head.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Antennas
        this.scene.pushMatrix();
        this.scene.translate(-0.3, 1.5, 1.4)
        this.scene.rotate(Math.PI / 5.5, 0, 0, 1);
        this.scene.scale(0.15, 0.6, 0.15);
        this.antennaMaterial.apply();
        this.antenna.display();

        // Top of the antenna
        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);
        this.scene.scale(0.5, 0.1, 0.5);
        this.antennaMaterial.apply();
        this.head.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Eyes
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 1, 2);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.3, 0.3, 0.5);
        this.eyeMaterial.apply();
        this.eye.display();
        this.scene.translate(3.4, 0, 0);
        this.eye.display();
        this.scene.popMatrix();

        // Tail        
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -1.4);
        this.scene.rotate(-Math.PI / 2.2, 1, 0, 0);
        this.scene.scale(0.2, 0.8, 0.2);
        this.antennaMaterial.apply();
        this.antenna.display();
        this.scene.popMatrix();

        // Wing
        this.scene.pushMatrix();
        this.scene.gl.depthMask(false);
        this.wingMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(-1, 0, 0);
        this.scene.rotate(wingRotation, 0, 0, 1);
        this.scene.translate(1, 0, 0);
        this.scene.scale(1, 1, 1);
        this.wing.displayLeftWing(this.wingAngle);
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0);
        this.scene.rotate(wingRotation, 0, 0, 1);
        this.scene.translate(-1, 0, 0);
        this.scene.scale(1, 1, 1);
        this.wing.displayRightWing(this.wingAngle);
        this.scene.popMatrix();
        this.scene.popMatrix();
        this.scene.gl.depthMask(true);
    }

    update(elapsedTime, scaleFactor, speedFactor) {
        if (this.descending) {
            this.position.y -= this.speed;
            if (this.position.y < -100) {
                this.position.y = 0;
                this.descending = false;
            }
            if (this.isOverFlower() != null) {
                const lastSpeed = this.speed;
                this.pollen = new MyPollen(this.scene, 0.1, 16, 8);
                this.pollen.display();
                this.positionDescend = this.isOverFlower();
                this.carryingPollen = true;
                this.descending = false;
                this.overFlower = true;
                this.speed = lastSpeed;
            }
        } 
        else if (this.ascending) {
            this.position.y += this.speed;
            if (this.position.y >= this.initialY) {
                this.position.y = this.initialY;
                this.ascending = false;
                this.speed = 0;
                this.onAir = true;
                this.overFlower = false;
            }
        } 
        else if (this.movingToHive) {
            const deltaX = this.hiveTarget.x - this.position.x;
            const deltaY = this.hiveTarget.y - this.position.y;
            const deltaZ = this.hiveTarget.z - this.position.z;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
            const movementSpeed = 1;
    
            if (distance > 0.1) {
                const moveX = (deltaX / distance) * movementSpeed;
                const moveY = (deltaY / distance) * movementSpeed;
                const moveZ = (deltaZ / distance) * movementSpeed;
    
                this.position.x += moveX;
                this.position.y += moveY;
                this.position.z += moveZ;
            } 
            else {
                this.position.x = this.hiveTarget.x;
                this.position.y = this.hiveTarget.y;
                this.position.z = this.hiveTarget.z;
                this.positionHive = { x: this.position.x, y: this.position.y, z: this.position.z };
                this.speed = 0;
                this.movingToHive = false;
                this.carryingPollen = false;
                this.hive.pollen = new MyPollen(this.scene, 0.1, 16, 8);
                this.pollen = null;
            }
        } 
        else {
            this.scale = scaleFactor;
            this.handleKeys(speedFactor / 5, elapsedTime);
    
            if (speedFactor !== this.lastSpeedFactor && this.speed != 0) {
                this.speed += (speedFactor - this.lastSpeedFactor);
                this.lastSpeedFactor = speedFactor;
            }
    
            if (this.overFlower) {
                if (this.positionDescend != null) {
                    this.animatorMovement = new MyAnimatorMovement(this.positionDescend.y, this.positionDescend.y, 1, true, true);
                    this.animatorMovement.update(elapsedTime, { x: this.positionDescend.x, y: this.positionDescend.y, z: this.positionDescend.z, speed: this.speed, orientation: this.orientation, tailAngle: this.tailAngle, wingAngle: this.wingAngle });
                    this.updateParams();
                }
            }
            else {
                this.animatorMovement = new MyAnimatorMovement(-0.25, 0.25, 1, true, true);
                this.animatorMovement.update(elapsedTime, { x: this.position.x, y: this.position.y, z: this.position.z, speed: this.speed, orientation: this.orientation, tailAngle: this.tailAngle, wingAngle: this.wingAngle });
                this.updateParams();
            }
        }
    }    

    updateParams() {
        this.position.y = this.animatorMovement.y
        this.position.x = this.animatorMovement.x
        this.position.z = this.animatorMovement.z
        this.tailAngle = this.animatorMovement.tailAngle
        this.wingAngle = this.animatorMovement.wingAngle
    }

    descendToFlower() {
        if (!this.descending && !this.ascending) {
            this.descending = true;
        }
    }

    ascendWithPollen() {
        if (!this.ascending && !this.descending) {
            this.ascending = true;
        }
    }

    goToHive() {
        if (this.carryingPollen && this.onAir) {
            this.hiveTarget = {
                x: 0.6 * 210,
                y: 0.6 * -50,
                z: 0
            };
            this.movingToHive = true;
            this.carryingPollen = false;
            this.onAir = false;
        }
    }        

    turn(v) {
        this.orientation += v
    }

    accelerate(v) {
        this.speed = Math.max(this.speed + v, 0)
    }

    reset() {
        this.speed = 0
        this.orientation = 0
        this.position = {x: this.defaultPosition.x, y: this.defaultPosition.y, z: this.defaultPosition.z}
    }

    isOverFlower() {
        const tolerance = 3.0;
        const xBee = this.position.x;
        const yBee = this.position.y;
        const zBee = this.position.z;
        this.checkedFlowers = false;

        let nearbyFlowers = this.garden.getNearbyFlowers(xBee, zBee, tolerance);
    
        if (!this.checkedFlowers) {
            nearbyFlowers = this.garden.getNearbyFlowers(xBee, zBee, tolerance);

            for (let i = 0; i < nearbyFlowers.length; i++) {
                const flower = nearbyFlowers[i];
                const xFlower = flower.x;
                const yFlower = flower.y;
                const zFlower = flower.z;
        
                if (Math.abs(xFlower - xBee) < tolerance && Math.abs(yFlower - yBee) < tolerance && Math.abs(zFlower - zBee) < tolerance) {
                    flower.pollen = null;
                    return { x: xBee, y: yBee, z: zBee };
                }

            this.checkedFlowers = true;
            }
        }
    
        return null;
    }

    handleKeys(factor, elapsedTime) {
        if (this.scene.gui.isKeyPressed("KeyW")) {
            this.accelerate(factor)
        }
        if (this.scene.gui.isKeyPressed("KeyS")) {
            this.accelerate(-factor)
        }
        if (this.scene.gui.isKeyPressed("KeyA")) {
            this.turn(factor)
        }
        if (this.scene.gui.isKeyPressed("KeyD")) {
            this.turn(-factor)
        }
        if (this.scene.gui.isKeyPressed("KeyR")) {
            this.reset()
        }
        if (this.scene.gui.isKeyPressed("KeyF")) {
            this.descendToFlower();
        }
        if (this.scene.gui.isKeyPressed("KeyP")) {
            this.ascendWithPollen();
        }
        if (this.scene.gui.isKeyPressed("KeyO")) {
            this.goToHive();
        }
    }
}
