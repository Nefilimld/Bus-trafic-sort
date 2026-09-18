/**
 * Main Game Controller: Bus Traffic Sort 3D
 * - Hypnotic, Satisfying (ASMR) Passenger Boarding Flow (~160ms cadence)
 * - 100% Working Boosters (Сорт, + Место, Полёт) across all levels and after shop purchases
 * - Precise SAT Collision Detection (No wrong blocking)
 * - Smooth Weighted Cubic Bezier Bus Driving (780ms)
 * - Perfectly Centered Circular Track (R = 2.05) with Zero-Clumping Even Distribution
 * - Full Coin Shop & Upgrades System (1-10 + Infinite Levels)
 */

class BusGame {
    constructor() {
        this.container = document.getElementById('game-container');
        this.canvas = document.getElementById('bg-canvas');

        // Game State
        this.currentLevelNum = 1;
        this.coins = 0;
        this.coinBonusLevel = 1;
        this.isPaused = false;
        this.isHeliMode = false;

        this.buses = [];
        this.passengers = [];     // Active walking meshes on the circular track
        this.reserveQueue = [];   // Reserve passenger colors to feed the track
        this.dockSlots = [];

        this.boosters = {
            sort: 2,
            slot: 1,
            heli: 1
        };

        // Circular track state
        this.globalTrackAngle = 0;
        this.trackRadius = 2.05;
        this.trackCenter = new THREE.Vector3(0, 0, -6.0);
        this.maxTrackCapacity = 24;

        // Boarding Pacing / Cadence (Залипательное заполнение)
        this.lastBoardingTime = 0;
        this.boardingInterval = 160; // ms between passengers

        // Three.js Core
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.lastTime = performance.now();
        this.init();
    }

    async init() {
        this.updateLoadingProgress(30, 'Инициализация 3D сцены...');
        this.setupThree();

        this.updateLoadingProgress(60, 'Подключение Yandex SDK...');
        await window.yandexBridge.init();
        await this.loadSaveData();

        this.updateLoadingProgress(80, 'Настройка интерфейса...');
        this.setupUI();
        this.setupEvents();

        this.updateLoadingProgress(100, 'Готово!');
        setTimeout(() => {
            const loader = document.getElementById('loading-screen');
            if (loader) loader.classList.add('fade-out');
            window.yandexBridge.notifyGameReady();
            this.loadLevel(this.currentLevelNum);
        }, 200);

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    updateLoadingProgress(percent, statusText) {
        const fill = document.getElementById('progress-fill');
        const status = document.getElementById('loading-status');
        if (fill) fill.style.width = percent + '%';
        if (status) status.innerText = statusText;
    }

    setupThree() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xdbeafe);

        // Camera
        this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        this.camera.position.set(0, 16.0, 13.0);
        this.camera.lookAt(0, 0, 0.5);

        // WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xfffaed, 0.8);
        dirLight.position.set(8, 16, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 512;
        dirLight.shadow.mapSize.height = 512;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 35;
        dirLight.shadow.camera.left = -7;
        dirLight.shadow.camera.right = 7;
        dirLight.shadow.camera.top = 9;
        dirLight.shadow.camera.bottom = -9;
        this.scene.add(dirLight);

        // Ground
        const groundGeo = new THREE.PlaneGeometry(28, 38);
        const groundMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        this.scene.add(ground);

        const gridHelper = new THREE.GridHelper(28, 28, 0xcfd8dc, 0xe2e8f0);
        gridHelper.position.y = 0.005;
        this.scene.add(gridHelper);

        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    async loadSaveData() {
        const data = await window.yandexBridge.loadData();
        if (data) {
            if (data.level) this.currentLevelNum = data.level;
            if (data.coins !== undefined) this.coins = data.coins;
            if (data.coinBonusLevel) this.coinBonusLevel = data.coinBonusLevel;
            if (data.boosters) this.boosters = Object.assign(this.boosters, data.boosters);
        }
        this.updateCoinDisplay();
        this.updateBoosterUI();
    }

    async persistSaveData() {
        await window.yandexBridge.saveData({
            level: this.currentLevelNum,
            coins: this.coins,
            coinBonusLevel: this.coinBonusLevel,
            boosters: this.boosters
        });
    }

    updateCoinDisplay() {
        const el = document.getElementById('coin-count');
        if (el) el.innerText = this.coins;

        const shopCoins = document.getElementById('shop-coins-display');
        if (shopCoins) shopCoins.innerText = this.coins;

        const bonusBadge = document.getElementById('level-coin-bonus');
        if (bonusBadge) bonusBadge.innerText = `Ур. ${this.coinBonusLevel}`;

        const upgBtn = document.getElementById('btn-upgrade-coins');
        if (upgBtn) {
            const cost = 150 * this.coinBonusLevel;
            upgBtn.innerText = `${cost} 🟡`;
        }
    }

    showToast(text) {
        const el = document.getElementById('toast-message');
        if (!el) return;
        el.innerText = text;
        el.classList.add('show');
        clearTimeout(this._toastTimeout);
        this._toastTimeout = setTimeout(() => {
            el.classList.remove('show');
        }, 1600);
    }

    setupUI() {
        // Restart Button
        document.getElementById('btn-restart').onclick = () => {
            window.soundManager.playClick();
            this.loadLevel(this.currentLevelNum);
        };

        // Settings Modal
        const settingsModal = document.getElementById('modal-settings');
        document.getElementById('btn-settings').onclick = () => {
            window.soundManager.playClick();
            settingsModal.classList.remove('hidden');
        };
        document.getElementById('btn-close-settings').onclick = () => {
            window.soundManager.playClick();
            settingsModal.classList.add('hidden');
        };

        // Shop Modal Open / Close
        const shopModal = document.getElementById('modal-shop');
        document.getElementById('coin-badge').onclick = () => {
            window.soundManager.playClick();
            this.updateCoinDisplay();
            shopModal.classList.remove('hidden');
        };
        document.getElementById('btn-close-shop').onclick = () => {
            window.soundManager.playClick();
            shopModal.classList.add('hidden');
        };

        // Booster Modal Close & Action Handlers
        const boosterModal = document.getElementById('modal-booster-purchase');
        document.getElementById('btn-close-booster-modal').onclick = () => {
            window.soundManager.playClick();
            boosterModal.classList.add('hidden');
        };

        document.getElementById('btn-booster-buy-coins').onclick = () => {
            this.onBoosterModalBuyCoins();
        };

        document.getElementById('btn-booster-buy-ad').onclick = () => {
            this.onBoosterModalBuyAd();
        };

        // Shop Buy Items
        document.getElementById('btn-buy-sort').onclick = () => {
            if (this.coins >= 50) {
                this.coins -= 50;
                this.boosters.sort++;
                this.updateCoinDisplay();
                this.updateBoosterUI();
                this.persistSaveData();
                window.soundManager.playCoin();
                this.showToast('+1 Сортировка куплена!');
            } else {
                this.showToast('Недостаточно монет!');
            }
        };

        document.getElementById('btn-buy-slot').onclick = () => {
            if (this.coins >= 75) {
                this.coins -= 75;
                this.boosters.slot++;
                this.updateCoinDisplay();
                this.updateBoosterUI();
                this.persistSaveData();
                window.soundManager.playCoin();
                this.showToast('+1 Место куплено!');
            } else {
                this.showToast('Недостаточно монет!');
            }
        };

        document.getElementById('btn-buy-heli').onclick = () => {
            if (this.coins >= 100) {
                this.coins -= 100;
                this.boosters.heli++;
                this.updateCoinDisplay();
                this.updateBoosterUI();
                this.persistSaveData();
                window.soundManager.playCoin();
                this.showToast('+1 Полёт куплен!');
            } else {
                this.showToast('Недостаточно монет!');
            }
        };

        // Upgrade: Coin Bonus per win
        document.getElementById('btn-upgrade-coins').onclick = () => {
            const cost = 150 * this.coinBonusLevel;
            if (this.coins >= cost) {
                this.coins -= cost;
                this.coinBonusLevel++;
                this.updateCoinDisplay();
                this.persistSaveData();
                window.soundManager.playCoin();
                this.showToast(`Прокачано! +${(this.coinBonusLevel - 1) * 10} 🟡 за победу`);
            } else {
                this.showToast('Недостаточно монет!');
            }
        };

        // Shop Free Ad Reward
        document.getElementById('btn-shop-free-ad').onclick = () => {
            window.soundManager.playClick();
            window.yandexBridge.showRewardedVideo(() => {
                this.coins += 50;
                this.updateCoinDisplay();
                this.persistSaveData();
                window.soundManager.playCoin();
                this.showToast('+50 Монет получено!');
            });
        };

        // Sound Toggles
        const soundToggle = document.getElementById('toggle-sound');
        soundToggle.onclick = () => {
            window.soundManager.isSoundEnabled = !window.soundManager.isSoundEnabled;
            soundToggle.classList.toggle('active', window.soundManager.isSoundEnabled);
            window.soundManager.playClick();
        };

        const vibrateToggle = document.getElementById('toggle-vibrate');
        vibrateToggle.onclick = () => {
            window.soundManager.isVibrationEnabled = !window.soundManager.isVibrationEnabled;
            vibrateToggle.classList.toggle('active', window.soundManager.isVibrationEnabled);
            window.soundManager.playClick();
        };

        // Booster Click Handlers
        document.getElementById('btn-booster-sort').onclick = () => this.useBoosterSort();
        document.getElementById('btn-booster-slot').onclick = () => this.useBoosterSlot();
        document.getElementById('btn-booster-heli').onclick = () => this.toggleBoosterHeli();

        // Free Coins Button (+50)
        document.getElementById('btn-free-coins').onclick = () => {
            window.soundManager.playClick();
            window.yandexBridge.showRewardedVideo(() => {
                this.coins += 50;
                this.updateCoinDisplay();
                this.persistSaveData();
                window.soundManager.playCoin();
                this.showToast('+50 Монет!');
            });
        };

        // Win Modal Actions
        document.getElementById('btn-win-next').onclick = () => {
            window.soundManager.playClick();
            document.getElementById('modal-win').classList.add('hidden');
            this.currentLevelNum++;
            this.persistSaveData();
            window.yandexBridge.showFullscreenAd(() => {
                this.loadLevel(this.currentLevelNum);
            });
        };

        document.getElementById('btn-win-x2').onclick = () => {
            window.soundManager.playClick();
            window.yandexBridge.showRewardedVideo(() => {
                const baseReward = 20 + (this.coinBonusLevel - 1) * 10;
                this.coins += baseReward;
                this.updateCoinDisplay();
                this.persistSaveData();
                window.soundManager.playCoin();
                document.getElementById('modal-win').classList.add('hidden');
                this.currentLevelNum++;
                this.loadLevel(this.currentLevelNum);
            });
        };

        // Fail Modal Actions
        document.getElementById('btn-fail-restart').onclick = () => {
            window.soundManager.playClick();
            document.getElementById('modal-fail').classList.add('hidden');
            this.loadLevel(this.currentLevelNum);
        };

        document.getElementById('btn-fail-revive').onclick = () => {
            window.soundManager.playClick();
            window.yandexBridge.showRewardedVideo(() => {
                document.getElementById('modal-fail').classList.add('hidden');
                this.unlockExtraSlot();
                this.showToast('VIP место открыто!');
            });
        };

        document.getElementById('btn-fail-sort').onclick = () => {
            window.soundManager.playClick();
            window.yandexBridge.showRewardedVideo(() => {
                document.getElementById('modal-fail').classList.add('hidden');
                this.applyQueueSort();
                this.showToast('Очередь отсортирована!');
            });
        };
    }

    /**
     * Open Booster Purchase Modal (Exact replica of Reference Screenshot)
     */
    openBoosterModal(boosterType) {
        this.currentBoosterModalType = boosterType;
        const modal = document.getElementById('modal-booster-purchase');
        const titleEl = document.getElementById('booster-modal-title');
        const descEl = document.getElementById('booster-modal-desc');
        const costEl = document.getElementById('booster-modal-coin-cost');
        const iconContainer = document.getElementById('booster-modal-icon-container');

        window.soundManager.playClick();

        if (boosterType === 'sort') {
            titleEl.innerText = 'Sort';
            descEl.innerText = 'Заполнить все автобусы на парковке';
            costEl.innerText = '50';
            this.currentBoosterCost = 50;
            iconContainer.innerHTML = `
                <svg viewBox="0 0 100 100" width="90" height="90">
                    <rect x="20" y="32" width="60" height="38" rx="8" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
                    <rect x="25" y="38" width="16" height="14" rx="3" fill="#0f172a"/>
                    <rect x="46" y="38" width="14" height="14" rx="3" fill="#0f172a"/>
                    <rect x="64" y="38" width="12" height="14" rx="3" fill="#0f172a"/>
                    <circle cx="34" cy="70" r="7" fill="#1e293b" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="66" cy="70" r="7" fill="#1e293b" stroke="#ffffff" stroke-width="2"/>
                    <!-- Little passengers jumping in -->
                    <circle cx="16" cy="54" r="6" fill="#ef4444"/>
                    <circle cx="28" cy="22" r="6" fill="#3b82f6"/>
                    <circle cx="52" cy="22" r="6" fill="#10b981"/>
                    <circle cx="72" cy="24" r="6" fill="#ec4899"/>
                </svg>
            `;
        } else if (boosterType === 'slot') {
            titleEl.innerText = '+1 Slot';
            descEl.innerText = 'Открыть дополнительное парковочное место';
            costEl.innerText = '75';
            this.currentBoosterCost = 75;
            iconContainer.innerHTML = `
                <svg viewBox="0 0 100 100" width="90" height="90">
                    <rect x="18" y="24" width="64" height="52" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
                    <path d="M50 32 V68 M32 50 H68" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
                </svg>
            `;
        } else if (boosterType === 'heli') {
            titleEl.innerText = 'Helicopter';
            descEl.innerText = 'Эвакуировать любой заблокированный автобус';
            costEl.innerText = '100';
            this.currentBoosterCost = 100;
            iconContainer.innerHTML = `
                <svg viewBox="0 0 100 100" width="90" height="90">
                    <path d="M20 26 H80" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
                    <ellipse cx="48" cy="46" rx="26" ry="16" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3"/>
                    <rect x="12" y="42" width="22" height="6" rx="3" fill="#60a5fa"/>
                    <rect x="42" y="60" width="8" height="12" fill="#0f172a"/>
                    <rect x="28" y="72" width="40" height="4" rx="2" fill="#0f172a"/>
                    <circle cx="60" cy="45" r="7" fill="#fef08a"/>
                </svg>
            `;
        }

        modal.classList.remove('hidden');
    }

    onBoosterModalBuyCoins() {
        const cost = this.currentBoosterCost || 50;
        if (this.coins >= cost) {
            this.coins -= cost;
            this.updateCoinDisplay();
            window.soundManager.playCoin();
            document.getElementById('modal-booster-purchase').classList.add('hidden');

            if (this.currentBoosterModalType === 'sort') {
                this.applyQueueSort();
            } else if (this.currentBoosterModalType === 'slot') {
                this.unlockExtraSlot();
            } else if (this.currentBoosterModalType === 'heli') {
                this.activateHeliMode();
            }
            this.persistSaveData();
        } else {
            this.showToast('Недостаточно монет! Посмотрите видео 📺');
        }
    }

    onBoosterModalBuyAd() {
        window.soundManager.playClick();
        window.yandexBridge.showRewardedVideo(() => {
            document.getElementById('modal-booster-purchase').classList.add('hidden');
            if (this.currentBoosterModalType === 'sort') {
                this.applyQueueSort();
            } else if (this.currentBoosterModalType === 'slot') {
                this.unlockExtraSlot();
            } else if (this.currentBoosterModalType === 'heli') {
                this.activateHeliMode();
            }
            this.persistSaveData();
        });
    }

    updateBoosterUI() {
        const checkBooster = (id, badgeId, key, minLevel) => {
            const btn = document.getElementById(id);
            const badge = document.getElementById(badgeId);
            // Unlocked if player reached the level OR has purchased/earned charges
            const isUnlocked = this.currentLevelNum >= minLevel || this.boosters[key] > 0;
            btn.classList.toggle('locked', !isUnlocked);
            if (badge) badge.innerText = this.boosters[key];
        };

        checkBooster('btn-booster-sort', 'badge-sort', 'sort', 2);
        checkBooster('btn-booster-slot', 'badge-slot', 'slot', 3);
        checkBooster('btn-booster-heli', 'badge-heli', 'heli', 5);
    }

    setupEvents() {
        const onPointerDown = (event) => {
            if (this.isPaused) return;

            const rect = this.renderer.domElement.getBoundingClientRect();
            this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            for (const hit of intersects) {
                let obj = hit.object;

                // Check if clicking on locked parking slot
                if (obj.userData && obj.userData.isSlot && !obj.userData.isUnlocked) {
                    this.openBoosterModal('slot');
                    return;
                }

                while (obj && obj.parent && obj.name !== 'bus') {
                    if (obj.userData && obj.userData.isSlot && !obj.userData.isUnlocked) {
                        this.openBoosterModal('slot');
                        return;
                    }
                    obj = obj.parent;
                }

                if (obj && obj.name === 'bus' && !obj.userData.isMoving && !obj.userData.isParked) {
                    this.onBusClicked(obj);
                    break;
                }
            }
        };

        this.canvas.addEventListener('pointerdown', onPointerDown);
    }

    loadLevel(levelNum) {
        this.clearLevel();

        const levelData = window.LevelManager.getLevel(levelNum);
        document.getElementById('level-title').innerText = `LEVEL ${levelNum}`;
        this.updateBoosterUI();

        // 1. Parking Area
        this.parkingGroup = window.modelBuilder.createParkingArea(7, levelData.activeSlots);
        this.parkingGroup.position.set(0, 0, -1.8);
        this.scene.add(this.parkingGroup);
        this.dockSlots = this.parkingGroup.userData.slots;

        // 2. Circular Queue Track
        this.queueTrackGroup = window.modelBuilder.createQueueTrack();
        this.queueTrackGroup.position.copy(this.trackCenter);
        this.scene.add(this.queueTrackGroup);

        // 3. Build Reserve Queue
        this.reserveQueue = [];
        levelData.queue.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                this.reserveQueue.push(item.color);
            }
        });

        // 4. Populate Circular Track
        this.initCircularQueue();

        // 5. Instantiate Buses
        this.buses = [];
        levelData.buses.forEach((bData) => {
            const bus = window.modelBuilder.createBus(bData.color, bData.capacity, bData.type);
            bus.position.set(bData.x, 0, bData.z);
            bus.rotation.y = bData.rot;
            this.scene.add(bus);
            this.buses.push(bus);
        });

        this.isHeliMode = false;
        document.getElementById('btn-booster-heli').classList.remove('active');
    }

    clearLevel() {
        TWEEN.removeAll();

        if (this.parkingGroup) this.scene.remove(this.parkingGroup);
        if (this.queueTrackGroup) this.scene.remove(this.queueTrackGroup);

        this.buses.forEach(b => this.scene.remove(b));
        this.buses = [];

        this.passengers.forEach(p => this.scene.remove(p));
        this.passengers = [];
        this.reserveQueue = [];
    }

    /**
     * Compute clean circular point (Radius = 2.05, centered on track)
     */
    getCircularPoint(angle) {
        const x = this.trackCenter.x + Math.cos(angle) * this.trackRadius;
        const z = this.trackCenter.z + Math.sin(angle) * this.trackRadius;
        return new THREE.Vector3(x, 0.05, z);
    }

    /**
     * Initialize Circular Crowd with Even Spacing
     */
    initCircularQueue() {
        this.passengers = [];
        const count = Math.min(this.maxTrackCapacity, this.reserveQueue.length);

        for (let i = 0; i < count; i++) {
            if (this.reserveQueue.length === 0) break;
            const color = this.reserveQueue.shift();
            const pMesh = window.modelBuilder.createPassenger(color);

            pMesh.userData.slotIndex = i;
            pMesh.userData.isBoarding = false;

            const angle = this.globalTrackAngle + (i / this.maxTrackCapacity) * Math.PI * 2;
            const pos = this.getCircularPoint(angle);
            pMesh.position.copy(pos);
            pMesh.rotation.y = -angle - Math.PI / 2;

            this.scene.add(pMesh);
            this.passengers.push(pMesh);
        }
    }

    /**
     * Add next passenger from reserve to fill an empty slot on the circle
     */
    replenishCircularQueue() {
        if (this.reserveQueue.length === 0) return;
        if (this.passengers.length >= this.maxTrackCapacity) return;

        const color = this.reserveQueue.shift();
        const pMesh = window.modelBuilder.createPassenger(color);
        pMesh.userData.isBoarding = false;

        // Position at top of the circle
        const spawnAngle = this.globalTrackAngle + Math.PI;
        const pos = this.getCircularPoint(spawnAngle);
        pMesh.position.copy(pos);
        pMesh.rotation.y = -spawnAngle - Math.PI / 2;

        this.scene.add(pMesh);
        this.passengers.push(pMesh);
    }

    onBusClicked(bus) {
        if (bus.userData.isMoving || bus.userData.isParked) return;

        // Heli Booster Mode Active
        if (this.isHeliMode) {
            this.isHeliMode = false;
            document.getElementById('btn-booster-heli').classList.remove('active');
            this.boosters.heli = Math.max(0, this.boosters.heli - 1);
            this.updateBoosterUI();
            this.persistSaveData();
            this.moveBusToDockWithHeli(bus);
            return;
        }

        // SAT Collision Check
        const isBlocked = this.checkBusBlocked(bus);
        if (isBlocked) {
            window.soundManager.playBlocked();
            this.wiggleBus(bus);
            this.showToast('Путь заблокирован!');
            return;
        }

        // Find available parking slot
        const freeSlot = this.dockSlots.find(s => s.isUnlocked && !s.occupiedBus);
        if (!freeSlot) {
            window.soundManager.playBlocked();
            this.wiggleBus(bus);
            this.showToast('Все слоты заняты!');
            return;
        }

        this.moveBusToDock(bus, freeSlot);
    }

    /**
     * Precise 2D OBB Collision Check (SAT-based corridor sweep)
     */
    checkBusBlocked(bus) {
        const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), bus.rotation.y).normalize();

        const busW = bus.userData.width * 0.90;
        const busL = bus.userData.length * 0.90;

        for (let t = 0.3; t <= 7.0; t += 0.25) {
            const testCenter = bus.position.clone().add(forward.clone().multiplyScalar(t));

            for (const other of this.buses) {
                if (other === bus || other.userData.isParked) continue;

                const otherW = other.userData.width * 0.90;
                const otherL = other.userData.length * 0.90;

                if (this.testOBBOverlap(testCenter, busW, busL, bus.rotation.y, other.position, otherW, otherL, other.rotation.y)) {
                    return true;
                }
            }
        }
        return false;
    }

    testOBBOverlap(posA, wA, lA, rotA, posB, wB, lB, rotB) {
        const getAxesAndCorners = (pos, w, l, rot) => {
            const cos = Math.cos(rot);
            const sin = Math.sin(rot);
            const ux = { x: cos, z: -sin };
            const uz = { x: -sin, z: -cos };

            const hw = w / 2;
            const hl = l / 2;

            const corners = [
                { x: pos.x + ux.x * hw + uz.x * hl, z: pos.z + ux.z * hw + uz.z * hl },
                { x: pos.x - ux.x * hw + uz.x * hl, z: pos.z - ux.z * hw + uz.z * hl },
                { x: pos.x - ux.x * hw - uz.x * hl, z: pos.z - ux.z * hw - uz.z * hl },
                { x: pos.x + ux.x * hw - uz.x * hl, z: pos.z + ux.z * hw - uz.z * hl }
            ];

            return { axes: [ux, uz], corners: corners };
        };

        const boxA = getAxesAndCorners(posA, wA, lA, rotA);
        const boxB = getAxesAndCorners(posB, wB, lB, rotB);
        const axes = [...boxA.axes, ...boxB.axes];

        for (const axis of axes) {
            let minA = Infinity, maxA = -Infinity;
            for (const c of boxA.corners) {
                const proj = c.x * axis.x + c.z * axis.z;
                minA = Math.min(minA, proj);
                maxA = Math.max(maxA, proj);
            }

            let minB = Infinity, maxB = -Infinity;
            for (const c of boxB.corners) {
                const proj = c.x * axis.x + c.z * axis.z;
                minB = Math.min(minB, proj);
                maxB = Math.max(maxB, proj);
            }

            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
        return true;
    }

    wiggleBus(bus) {
        const initRot = bus.rotation.y;
        new TWEEN.Tween(bus.rotation)
            .to({ y: initRot + 0.12 }, 45)
            .yoyo(true)
            .repeat(3)
            .onComplete(() => {
                bus.rotation.y = initRot;
            })
            .start();
    }

    /**
     * Slower, Natural Cubic Bezier Driving Animation (780ms)
     */
    moveBusToDock(bus, slot) {
        slot.occupiedBus = bus;
        bus.userData.isMoving = true;
        bus.userData.slotIndex = slot.index;

        window.soundManager.playBusStart();

        const P0 = bus.position.clone();
        const P3 = slot.position.clone().add(this.parkingGroup.position);
        P3.y = 0;

        const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), bus.rotation.y).normalize();
        const P1 = P0.clone().add(forward.clone().multiplyScalar(2.4));
        const P2 = new THREE.Vector3(P3.x, 0, P3.z + 1.8);

        const curveState = { t: 0 };

        new TWEEN.Tween(curveState)
            .to({ t: 1 }, 780)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                const t = curveState.t;
                const mt = 1 - t;

                const x = mt*mt*mt*P0.x + 3*mt*mt*t*P1.x + 3*mt*t*t*P2.x + t*t*t*P3.x;
                const z = mt*mt*mt*P0.z + 3*mt*mt*t*P1.z + 3*mt*t*t*P2.z + t*t*t*P3.z;
                bus.position.set(x, 0, z);

                const dx = 3*mt*mt*(P1.x - P0.x) + 6*mt*t*(P2.x - P1.x) + 3*t*t*(P3.x - P2.x);
                const dz = 3*mt*mt*(P1.z - P0.z) + 6*mt*t*(P2.z - P1.z) + 3*t*t*(P3.z - P2.z);

                if (Math.hypot(dx, dz) > 0.01) {
                    const tangentAngle = Math.atan2(-dx, -dz);
                    if (t > 0.75) {
                        const blend = (t - 0.75) / 0.25;
                        bus.rotation.y = THREE.MathUtils.lerp(tangentAngle, 0, blend);
                    } else {
                        bus.rotation.y = tangentAngle;
                    }
                }
            })
            .onComplete(() => {
                bus.position.copy(P3);
                bus.rotation.set(0, 0, 0);
                bus.userData.isMoving = false;
                bus.userData.isParked = true;
                this.checkFailState();
            })
            .start();
    }

    moveBusToDockWithHeli(bus) {
        const slot = this.dockSlots.find(s => s.isUnlocked && !s.occupiedBus);
        if (!slot) return;

        slot.occupiedBus = bus;
        bus.userData.isMoving = true;
        bus.userData.slotIndex = slot.index;

        window.soundManager.playBooster();

        const targetPos = slot.position.clone().add(this.parkingGroup.position);
        targetPos.y = 0;

        const midPos = bus.position.clone().lerp(targetPos, 0.5);
        midPos.y = 3.8;

        new TWEEN.Tween(bus.position)
            .to({ x: midPos.x, y: midPos.y, z: midPos.z }, 450)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                new TWEEN.Tween(bus.position)
                    .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 450)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .onComplete(() => {
                        bus.userData.isMoving = false;
                        bus.userData.isParked = true;
                        bus.rotation.set(0, 0, 0);
                        this.checkFailState();
                    })
                    .start();
            })
            .start();

        new TWEEN.Tween(bus.rotation).to({ y: 0 }, 400).start();
    }

    /**
     * Boarding Trigger: Satisfying Rhythmic Sprint into Bus (220ms)
     */
    triggerPassengerBoarding(passenger, bus) {
        passenger.userData.isBoarding = true;

        bus.userData.capacity--;
        bus.userData.updateCapacity(bus.userData.capacity);
        window.soundManager.playBoard();

        const startPos = passenger.position.clone();
        const targetPos = bus.position.clone().add(new THREE.Vector3(0, 0.35, 0));

        new TWEEN.Tween(passenger.position)
            .to({ x: targetPos.x, y: 0.8, z: targetPos.z }, 220) // Smooth, satisfying hop
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                this.scene.remove(passenger);
                const idx = this.passengers.indexOf(passenger);
                if (idx !== -1) this.passengers.splice(idx, 1);

                this.replenishCircularQueue();

                if (bus.userData.capacity <= 0) {
                    setTimeout(() => {
                        this.busDepart(bus);
                    }, 120);
                }
            })
            .start();
    }

    busDepart(bus) {
        window.soundManager.playBusLeave();

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 25,
                spread: 60,
                origin: { y: 0.6 }
            });
        }

        const slot = this.dockSlots[bus.userData.slotIndex];
        if (slot) slot.occupiedBus = null;

        new TWEEN.Tween(bus.position)
            .to({ x: bus.position.x + 11, z: bus.position.z - 2 }, 380)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => {
                this.scene.remove(bus);
                const idx = this.buses.indexOf(bus);
                if (idx !== -1) this.buses.splice(idx, 1);

                this.checkLevelComplete();
            })
            .start();
    }

    checkFailState() {
        const activeSlots = this.dockSlots.filter(s => s.isUnlocked);
        const allSlotsFull = activeSlots.every(s => s.occupiedBus !== null && s.occupiedBus.userData.isParked);

        if (allSlotsFull && this.passengers.length > 0) {
            const dockedColors = activeSlots.map(s => s.occupiedBus.userData.color);
            const hasMatchOnTrack = this.passengers.some(p => dockedColors.includes(p.userData.color));
            const hasMatchInReserve = this.reserveQueue.some(c => dockedColors.includes(c));

            if (!hasMatchOnTrack && !hasMatchInReserve) {
                setTimeout(() => {
                    const stillFull = activeSlots.every(s => s.occupiedBus !== null);
                    if (stillFull) {
                        document.getElementById('modal-fail').classList.remove('hidden');
                        window.soundManager.playBlocked();
                    }
                }, 800);
            }
        }
    }

    checkLevelComplete() {
        if (this.buses.length === 0 && this.passengers.length === 0 && this.reserveQueue.length === 0) {
            setTimeout(() => {
                const baseReward = 20 + (this.coinBonusLevel - 1) * 10;
                document.getElementById('win-coin-amount').innerText = baseReward;
                this.coins += baseReward;
                this.updateCoinDisplay();
                this.persistSaveData();

                window.soundManager.playWinFanfare();

                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 80,
                        spread: 80,
                        origin: { y: 0.4 }
                    });
                }
                document.getElementById('modal-win').classList.remove('hidden');
            }, 300);
        }
    }

    /**
     * Booster 1: Сорт
     */
    useBoosterSort() {
        if (this.boosters.sort > 0) {
            this.boosters.sort--;
            this.updateBoosterUI();
            this.persistSaveData();
            this.applyQueueSort();
        } else {
            this.openBoosterModal('sort');
        }
    }

    applyQueueSort() {
        window.soundManager.playBooster();

        const dockColors = this.dockSlots
            .filter(s => s.occupiedBus && s.occupiedBus.userData.capacity > 0)
            .map(s => s.occupiedBus.userData.color);

        if (dockColors.length === 0) {
            this.showToast('Сначала припаркуйте автобус!');
            return;
        }

        // Reorder active passengers on track
        const matching = [];
        const nonMatching = [];

        this.passengers.forEach(p => {
            if (dockColors.includes(p.userData.color)) matching.push(p);
            else nonMatching.push(p);
        });

        this.passengers = [...matching, ...nonMatching];

        // Reorder reserve queue as well
        const matchingReserve = [];
        const nonMatchingReserve = [];
        this.reserveQueue.forEach(c => {
            if (dockColors.includes(c)) matchingReserve.push(c);
            else nonMatchingReserve.push(c);
        });
        this.reserveQueue = [...matchingReserve, ...nonMatchingReserve];

        this.showToast('Очередь отсортирована!');
    }

    /**
     * Booster 2: + Место
     */
    useBoosterSlot() {
        const lockedSlot = this.dockSlots.find(s => !s.isUnlocked);
        if (!lockedSlot) {
            this.showToast('Все слоты уже открыты!');
            return;
        }

        if (this.boosters.slot > 0) {
            this.boosters.slot--;
            this.updateBoosterUI();
            this.persistSaveData();
            this.unlockExtraSlot();
        } else {
            this.openBoosterModal('slot');
        }
    }

    unlockExtraSlot() {
        const lockedSlot = this.dockSlots.find(s => !s.isUnlocked);
        if (!lockedSlot) return;

        window.soundManager.playBooster();
        lockedSlot.isUnlocked = true;
        lockedSlot.mesh.material = window.modelBuilder.materials.slotActive;
        lockedSlot.mesh.userData.isUnlocked = true;
        if (lockedSlot.mesh.userData.plusMesh) {
            lockedSlot.mesh.userData.plusMesh.visible = false;
        }

        this.showToast('+1 Парковочное место!');
    }

    /**
     * Booster 3: Полёт
     */
    toggleBoosterHeli() {
        if (this.isHeliMode) {
            this.isHeliMode = false;
            document.getElementById('btn-booster-heli').classList.remove('active');
            return;
        }

        if (this.boosters.heli > 0) {
            this.activateHeliMode();
        } else {
            this.openBoosterModal('heli');
        }
    }

    activateHeliMode() {
        this.isHeliMode = true;
        document.getElementById('btn-booster-heli').classList.add('active');
        this.showToast('Нажмите на любой автобус для эвакуации!');
    }

    animate(now) {
        requestAnimationFrame(this.animate);

        const delta = Math.min((now - this.lastTime) * 0.001, 0.1);
        this.lastTime = now;

        TWEEN.update(now);

        // Advance global track rotation smoothly (0.45 rad/sec)
        this.globalTrackAngle = (this.globalTrackAngle + 0.45 * delta) % (Math.PI * 2);

        // Update positions of passengers on circular track
        const total = this.passengers.length;
        if (total > 0) {
            for (let i = 0; i < total; i++) {
                const p = this.passengers[i];
                if (p.userData.isBoarding) continue;

                // Evenly spaced angles along the circle (Zero clumping)
                const angle = this.globalTrackAngle + (i / total) * Math.PI * 2;
                const pos = this.getCircularPoint(angle);
                p.position.set(pos.x, pos.y, pos.z);
                p.rotation.y = -angle - Math.PI / 2;
            }

            // Hypnotic, Satisfying Boarding Flow (~160ms cadence)
            if (now - this.lastBoardingTime >= this.boardingInterval) {
                const parkedBuses = this.buses.filter(b => b.userData.isParked && !b.userData.isMoving && b.userData.capacity > 0);

                if (parkedBuses.length > 0) {
                    for (const bus of parkedBuses) {
                        const matchingP = this.passengers.find(p => !p.userData.isBoarding && p.userData.color === bus.userData.color);
                        if (matchingP) {
                            this.lastBoardingTime = now;
                            this.triggerPassengerBoarding(matchingP, bus);
                            break;
                        }
                    }
                }
            }
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new BusGame();
});
