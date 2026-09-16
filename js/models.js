/**
 * Models & Procedural 3D Mesh Builders using Three.js
 * Clean, lightweight and super fast (0 lag)
 */

const COLOR_MAP = {
    red: { hex: 0xef4444, name: 'Красный', text: '#ef4444' },
    blue: { hex: 0x3b82f6, name: 'Синий', text: '#3b82f6' },
    yellow: { hex: 0xf59e0b, name: 'Жёлтый', text: '#f59e0b' },
    green: { hex: 0x10b981, name: 'Зелёный', text: '#10b981' },
    purple: { hex: 0x8b5cf6, name: 'Фиолетовый', text: '#8b5cf6' },
    orange: { hex: 0xf97316, name: 'Оранжевый', text: '#f97316' },
    cyan: { hex: 0x06b6d4, name: 'Голубой', text: '#06b6d4' },
    magenta: { hex: 0xec4899, name: 'Розовый', text: '#ec4899' }
};

class ModelBuilder {
    constructor() {
        // Shared materials
        this.materials = {
            window: new THREE.MeshLambertMaterial({ color: 0x1e293b }),
            wheel: new THREE.MeshLambertMaterial({ color: 0x0f172a }),
            hubcap: new THREE.MeshLambertMaterial({ color: 0xe2e8f0 }),
            headlight: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
            taillight: new THREE.MeshBasicMaterial({ color: 0xdc2626 }),
            arrow: new THREE.MeshBasicMaterial({ color: 0xffffff }),
            curb: new THREE.MeshLambertMaterial({ color: 0x94a3b8 }),
            curbWhite: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            railWhite: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            trackFloor: new THREE.MeshLambertMaterial({ color: 0x64748b, side: THREE.DoubleSide }),
            road: new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }),
            slotActive: new THREE.MeshLambertMaterial({ color: 0x334155 }),
            slotLocked: new THREE.MeshLambertMaterial({ color: 0x475569 }),
            track: new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
            skin: new THREE.MeshLambertMaterial({ color: 0xffd1a4 }),
            plus: new THREE.MeshBasicMaterial({ color: 0x10b981 }),
            lampPost: new THREE.MeshLambertMaterial({ color: 0x64748b }),
            lampGlow: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
            bush: new THREE.MeshLambertMaterial({ color: 0x15803d }),
            pot: new THREE.MeshLambertMaterial({ color: 0x94a3b8 })
        };

        // Shared geometries
        this.geos = {
            wheel: new THREE.CylinderGeometry(0.18, 0.18, 0.1, 10).rotateZ(Math.PI / 2),
            hubcap: new THREE.CylinderGeometry(0.08, 0.08, 0.11, 8).rotateZ(Math.PI / 2),
            headlight: new THREE.BoxGeometry(0.18, 0.12, 0.04),
            passengerBody: new THREE.CylinderGeometry(0.12, 0.1, 0.28, 8),
            passengerHead: new THREE.SphereGeometry(0.12, 8, 8),
            passengerCap: new THREE.SphereGeometry(0.125, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.45)
        };

        // Color materials
        this.colorMaterials = {};
        for (const [key, val] of Object.entries(COLOR_MAP)) {
            this.colorMaterials[key] = new THREE.MeshLambertMaterial({ color: val.hex });
        }

        // Roof arrow geo
        const arrowShape = new THREE.Shape();
        arrowShape.moveTo(0, -0.4);
        arrowShape.lineTo(0.25, 0);
        arrowShape.lineTo(0.12, 0);
        arrowShape.lineTo(0.12, 0.4);
        arrowShape.lineTo(-0.12, 0.4);
        arrowShape.lineTo(-0.12, 0);
        arrowShape.lineTo(-0.25, 0);
        arrowShape.closePath();
        this.geos.arrow = new THREE.ShapeGeometry(arrowShape);
    }

    /**
     * Create Bus 3D Group
     */
    createBus(colorKey, capacity = 24, lengthType = 'normal') {
        const group = new THREE.Group();
        group.name = 'bus';

        const bodyMat = this.colorMaterials[colorKey] || this.colorMaterials.red;
        const length = lengthType === 'long' ? 2.4 : 1.7;
        const width = 0.95;
        const height = 0.85;

        // 1. Body
        const bodyGeo = new THREE.BoxGeometry(width, height, length);
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.position.y = height / 2 + 0.15;
        bodyMesh.castShadow = true;
        group.add(bodyMesh);

        // 2. Windows
        const frontGlassGeo = new THREE.BoxGeometry(width * 0.9, height * 0.45, 0.05);
        const frontGlass = new THREE.Mesh(frontGlassGeo, this.materials.window);
        frontGlass.position.set(0, height * 0.7 + 0.15, -length / 2 - 0.01);
        group.add(frontGlass);

        const rearGlassGeo = new THREE.BoxGeometry(width * 0.85, height * 0.4, 0.05);
        const rearGlass = new THREE.Mesh(rearGlassGeo, this.materials.window);
        rearGlass.position.set(0, height * 0.7 + 0.15, length / 2 + 0.01);
        group.add(rearGlass);

        const sideGlassGeo = new THREE.BoxGeometry(0.05, height * 0.35, length * 0.75);
        const leftGlass = new THREE.Mesh(sideGlassGeo, this.materials.window);
        leftGlass.position.set(-width / 2 - 0.01, height * 0.7 + 0.15, 0);
        group.add(leftGlass);

        const rightGlass = new THREE.Mesh(sideGlassGeo, this.materials.window);
        rightGlass.position.set(width / 2 + 0.01, height * 0.7 + 0.15, 0);
        group.add(rightGlass);

        // 3. Headlights & Taillights
        const hl1 = new THREE.Mesh(this.geos.headlight, this.materials.headlight);
        hl1.position.set(-width * 0.35, 0.35, -length / 2 - 0.01);
        const hl2 = new THREE.Mesh(this.geos.headlight, this.materials.headlight);
        hl2.position.set(width * 0.35, 0.35, -length / 2 - 0.01);
        group.add(hl1, hl2);

        const tl1 = new THREE.Mesh(this.geos.headlight, this.materials.taillight);
        tl1.position.set(-width * 0.35, 0.35, length / 2 + 0.01);
        const tl2 = new THREE.Mesh(this.geos.headlight, this.materials.taillight);
        tl2.position.set(width * 0.35, 0.35, length / 2 + 0.01);
        group.add(tl1, tl2);

        // 4. Wheels
        const wheelZOffsets = lengthType === 'long' ? [-0.8, 0.8] : [-0.5, 0.5];
        wheelZOffsets.forEach(z => {
            const wL = new THREE.Mesh(this.geos.wheel, this.materials.wheel);
            wL.position.set(-width / 2 - 0.02, 0.18, z);
            const hubL = new THREE.Mesh(this.geos.hubcap, this.materials.hubcap);
            wL.add(hubL);

            const wR = new THREE.Mesh(this.geos.wheel, this.materials.wheel);
            wR.position.set(width / 2 + 0.02, 0.18, z);
            const hubR = new THREE.Mesh(this.geos.hubcap, this.materials.hubcap);
            wR.add(hubR);

            group.add(wL, wR);
        });

        // 5. Arrow on Roof
        const arrowMesh = new THREE.Mesh(this.geos.arrow, this.materials.arrow);
        arrowMesh.rotation.x = -Math.PI / 2;
        arrowMesh.rotation.z = Math.PI;
        arrowMesh.position.set(0, height + 0.17, 0);
        group.add(arrowMesh);

        // 6. Capacity Badge
        const badgeCanvas = document.createElement('canvas');
        badgeCanvas.width = 128;
        badgeCanvas.height = 64;
        const badgeCtx = badgeCanvas.getContext('2d');

        const badgeTex = new THREE.CanvasTexture(badgeCanvas);
        const badgeMat = new THREE.SpriteMaterial({ map: badgeTex, depthTest: false });
        const badgeSprite = new THREE.Sprite(badgeMat);
        badgeSprite.scale.set(1.1, 0.55, 1);
        badgeSprite.position.set(0, height + 0.65, 0);
        group.add(badgeSprite);

        const updateCapacity = (rem) => {
            badgeCtx.clearRect(0, 0, 128, 64);
            badgeCtx.fillStyle = 'rgba(15, 23, 42, 0.88)';
            badgeCtx.beginPath();
            badgeCtx.roundRect(8, 8, 112, 48, 24);
            badgeCtx.fill();

            badgeCtx.fillStyle = '#ffffff';
            badgeCtx.font = 'bold 30px -apple-system, sans-serif';
            badgeCtx.textAlign = 'center';
            badgeCtx.textBaseline = 'middle';
            badgeCtx.fillText(rem.toString(), 64, 33);

            badgeTex.needsUpdate = true;
        };

        updateCapacity(capacity);

        group.userData = {
            color: colorKey,
            capacity: capacity,
            maxCapacity: capacity,
            length: length,
            width: width,
            height: height,
            updateCapacity: updateCapacity,
            badgeSprite: badgeSprite,
            isMoving: false,
            isParked: false,
            slotIndex: -1
        };

        return group;
    }

    /**
     * Create Passenger
     */
    createPassenger(colorKey) {
        const group = new THREE.Group();
        group.name = 'passenger';

        const bodyMat = this.colorMaterials[colorKey] || this.colorMaterials.red;

        const bodyMesh = new THREE.Mesh(this.geos.passengerBody, bodyMat);
        bodyMesh.position.y = 0.18;
        group.add(bodyMesh);

        const headMesh = new THREE.Mesh(this.geos.passengerHead, this.materials.skin);
        headMesh.position.y = 0.39;
        group.add(headMesh);

        const capMesh = new THREE.Mesh(this.geos.passengerCap, bodyMat);
        capMesh.position.y = 0.41;
        group.add(capMesh);

        group.userData = {
            color: colorKey,
            queueIndex: -1
        };

        return group;
    }

    /**
     * Create Parking Area
     */
    createParkingArea(totalSlots = 7, activeSlots = 4) {
        const group = new THREE.Group();

        const baseGeo = new THREE.BoxGeometry(9.2, 0.15, 2.6);
        const baseMesh = new THREE.Mesh(baseGeo, this.materials.curb);
        baseMesh.position.set(0, -0.05, 0);
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        const slotMeshes = [];
        const slotWidth = 1.15;
        const startX = -((totalSlots - 1) * slotWidth) / 2;

        for (let i = 0; i < totalSlots; i++) {
            const posX = startX + i * slotWidth;
            const isUnlocked = i < activeSlots;

            const slotGeo = new THREE.BoxGeometry(1.0, 0.05, 2.1);
            const slotMat = isUnlocked ? this.materials.slotActive : this.materials.slotLocked;
            const slotMesh = new THREE.Mesh(slotGeo, slotMat);
            slotMesh.position.set(posX, 0.06, 0);
            group.add(slotMesh);

            const lineGeo = new THREE.BoxGeometry(1.04, 0.06, 0.06);
            const lineMesh = new THREE.Mesh(lineGeo, this.materials.arrow);
            lineMesh.position.set(posX, 0.07, -1.02);
            group.add(lineMesh);

            if (!isUnlocked) {
                const plusShape = new THREE.Shape();
                plusShape.moveTo(-0.05, 0.18);
                plusShape.lineTo(0.05, 0.18);
                plusShape.lineTo(0.05, 0.05);
                plusShape.lineTo(0.18, 0.05);
                plusShape.lineTo(0.18, -0.05);
                plusShape.lineTo(0.05, -0.05);
                plusShape.lineTo(0.05, -0.18);
                plusShape.lineTo(-0.05, -0.18);
                plusShape.lineTo(-0.05, -0.05);
                plusShape.lineTo(-0.18, -0.05);
                plusShape.lineTo(-0.18, 0.05);
                plusShape.lineTo(-0.05, 0.05);
                plusShape.closePath();

                const plusGeo = new THREE.ShapeGeometry(plusShape);
                const plusMesh = new THREE.Mesh(plusGeo, this.materials.plus);
                plusMesh.rotation.x = -Math.PI / 2;
                plusMesh.position.set(posX, 0.09, 0);
                group.add(plusMesh);
                slotMesh.userData.plusMesh = plusMesh;
            }

            slotMeshes.push({
                index: i,
                position: new THREE.Vector3(posX, 0.1, 0),
                isUnlocked: isUnlocked,
                mesh: slotMesh,
                occupiedBus: null
            });
        }

        // Add street lamps and decorative planters on both sides of the parking deck
        const addStreetLamp = (x, z) => {
            const lampGroup = new THREE.Group();
            const postGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.3, 8);
            const post = new THREE.Mesh(postGeo, this.materials.lampPost);
            post.position.y = 0.65;
            lampGroup.add(post);

            const armGeo = new THREE.BoxGeometry(0.25, 0.04, 0.04);
            const arm = new THREE.Mesh(armGeo, this.materials.lampPost);
            arm.position.set(x > 0 ? -0.1 : 0.1, 1.28, 0);
            lampGroup.add(arm);

            const headGeo = new THREE.BoxGeometry(0.12, 0.06, 0.08);
            const head = new THREE.Mesh(headGeo, this.materials.lampGlow);
            head.position.set(x > 0 ? -0.2 : 0.2, 1.25, 0);
            lampGroup.add(head);

            lampGroup.position.set(x, 0, z);
            group.add(lampGroup);
        };

        const addPlanterBush = (x, z) => {
            const potGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.2, 8);
            const pot = new THREE.Mesh(potGeo, this.materials.pot);
            pot.position.set(x, 0.1, z);
            group.add(pot);

            const bushGeo = new THREE.SphereGeometry(0.18, 8, 8);
            const bush = new THREE.Mesh(bushGeo, this.materials.bush);
            bush.position.set(x, 0.28, z);
            group.add(bush);
        };

        // Left and right side props
        addStreetLamp(-4.2, -0.6);
        addStreetLamp(4.2, -0.6);
        addPlanterBush(-4.2, 0.6);
        addPlanterBush(4.2, 0.6);

        group.userData = { slots: slotMeshes };
        return group;
    }

    /**
     * Create Queue Track - Oval Loop with Dual Top Feeder Chutes & Exit Gate
     */
    createQueueTrack() {
        const group = new THREE.Group();

        // 1. Oval Loop Floor (Shape with inner hole)
        const shape = new THREE.Shape();
        shape.absellipse(0, 0, 2.75, 1.85, 0, Math.PI * 2, false);
        const hole = new THREE.Path();
        hole.absellipse(0, 0, 1.55, 1.05, 0, Math.PI * 2, true);
        shape.holes.push(hole);

        const floorGeo = new THREE.ShapeGeometry(shape, 40);
        const floorMesh = new THREE.Mesh(floorGeo, this.materials.trackFloor);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.set(0, 0.015, 0);
        floorMesh.receiveShadow = true;
        group.add(floorMesh);

        // Center dashed guide on loop
        const centerLineShape = new THREE.Shape();
        centerLineShape.absellipse(0, 0, 2.16, 1.46, 0, Math.PI * 2, false);
        const centerLineHole = new THREE.Path();
        centerLineHole.absellipse(0, 0, 2.13, 1.43, 0, Math.PI * 2, true);
        centerLineShape.holes.push(centerLineHole);
        const centerLineGeo = new THREE.ShapeGeometry(centerLineShape, 40);
        const centerLineMesh = new THREE.Mesh(centerLineGeo, this.materials.road);
        centerLineMesh.rotation.x = -Math.PI / 2;
        centerLineMesh.position.set(0, 0.02, 0);
        group.add(centerLineMesh);

        // 2. Inner Rail Guard (Closed Oval Tube)
        class InnerLoopCurve extends THREE.Curve {
            getPoint(t) {
                const a = t * Math.PI * 2;
                return new THREE.Vector3(1.52 * Math.cos(a), 0.08, 1.03 * Math.sin(a));
            }
        }
        const innerRailGeo = new THREE.TubeGeometry(new InnerLoopCurve(), 48, 0.05, 8, true);
        const innerRail = new THREE.Mesh(innerRailGeo, this.materials.curbWhite);
        group.add(innerRail);

        // 3. Outer Rail Guard with Bottom Boarding Gate Opening
        class OuterLoopCurve extends THREE.Curve {
            getPoint(t) {
                // Opening between ~0.35 * PI and ~0.65 * PI
                // Map t: 0 -> 1 to angle: 0.67 * PI -> 2.33 * PI (which wraps around top and sides)
                const startAngle = 0.67 * Math.PI;
                const endAngle = 2.33 * Math.PI;
                const a = startAngle + t * (endAngle - startAngle);
                return new THREE.Vector3(2.75 * Math.cos(a), 0.08, 1.85 * Math.sin(a));
            }
        }
        const outerRailGeo = new THREE.TubeGeometry(new OuterLoopCurve(), 48, 0.05, 8, false);
        const outerRail = new THREE.Mesh(outerRailGeo, this.materials.curbWhite);
        group.add(outerRail);

        // 4. Feeder Chutes at Top (Left and Right)
        const createChute = (isRight) => {
            const sign = isRight ? 1 : -1;

            // Chute floor ribbon using smooth CatmullRom points
            const p0 = new THREE.Vector3(sign * 2.8, 0.015, -2.6);
            const p1 = new THREE.Vector3(sign * 2.3, 0.015, -1.8);
            const p2 = new THREE.Vector3(sign * 1.8, 0.015, -1.2);

            const chuteCurve = new THREE.CatmullRomCurve3([p0, p1, p2]);
            const pts = chuteCurve.getPoints(12);

            const ribbonGeo = new THREE.BufferGeometry();
            const verts = [];
            const uvs = [];
            const halfW = 0.58;

            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];
                const t = chuteCurve.getTangent(i / (pts.length - 1));
                const normal = new THREE.Vector3(-t.z, 0, t.x).normalize();

                verts.push(p.x - normal.x * halfW, 0.015, p.z - normal.z * halfW);
                verts.push(p.x + normal.x * halfW, 0.015, p.z + normal.z * halfW);
                uvs.push(0, i / (pts.length - 1), 1, i / (pts.length - 1));
            }

            const indices = [];
            for (let i = 0; i < pts.length - 1; i++) {
                const base = i * 2;
                indices.push(base, base + 1, base + 2);
                indices.push(base + 1, base + 3, base + 2);
            }

            ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
            ribbonGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            ribbonGeo.setIndex(indices);
            ribbonGeo.computeVertexNormals();

            const chuteFloor = new THREE.Mesh(ribbonGeo, this.materials.trackFloor);
            chuteFloor.receiveShadow = true;
            group.add(chuteFloor);

            // Chute Left & Right Outer Rails
            const railCurveOuter = new THREE.CatmullRomCurve3(pts.map((p, idx) => {
                const t = chuteCurve.getTangent(idx / (pts.length - 1));
                const normal = new THREE.Vector3(-t.z, 0, t.x).normalize();
                return new THREE.Vector3(p.x + normal.x * halfW, 0.08, p.z + normal.z * halfW);
            }));
            const railOuter = new THREE.Mesh(new THREE.TubeGeometry(railCurveOuter, 14, 0.04, 6, false), this.materials.curbWhite);
            group.add(railOuter);

            const railCurveInner = new THREE.CatmullRomCurve3(pts.map((p, idx) => {
                const t = chuteCurve.getTangent(idx / (pts.length - 1));
                const normal = new THREE.Vector3(-t.z, 0, t.x).normalize();
                return new THREE.Vector3(p.x - normal.x * halfW, 0.08, p.z - normal.z * halfW);
            }));
            const railInner = new THREE.Mesh(new THREE.TubeGeometry(railCurveInner, 14, 0.04, 6, false), this.materials.curbWhite);
            group.add(railInner);
        };

        createChute(false); // Left chute
        createChute(true);  // Right chute

        return group;
    }
}

window.modelBuilder = new ModelBuilder();
window.COLOR_MAP = COLOR_MAP;
