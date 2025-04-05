'use client';
import * as Phaser from 'phaser';

export default class SlotMachine extends Phaser.Scene {
  constructor() {
    super('SlotMachine');
  }

    preload() {
        // Load symbols
        this.load.image('cherry', 'https://play.rosebud.ai/assets/cherry.png?PTSV');
        this.load.image('seven', 'https://play.rosebud.ai/assets/seven.png?jEqO');
        this.load.image('bar', 'https://play.rosebud.ai/assets/bar.png?b1GY');
        this.load.image('bell', 'https://play.rosebud.ai/assets/bell.png?boEA');
        this.load.image('strawberry', 'https://play.rosebud.ai/assets/strawberry_8269784.png?6OfW');
        this.load.image('melon', 'https://play.rosebud.ai/assets/melon_11709875.png?NPap');
        this.load.image('chips', 'https://play.rosebud.ai/assets/casino-chips.png?x8yP');
        this.load.image('sloticon', 'https://play.rosebud.ai/assets/slots.png?vPW8');
        // Load background
        this.load.image('background', 'https://play.rosebud.ai/assets/neon-brick-wall-background-concept_1028938-502569.jpg?pVB5');
    }

    create() {
        const { width, height } = this.scale;

        // Add background
        this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        // Initialize game variables
        this.symbolWidth = 80;
        this.symbolHeight = 70;
        this.symbolSpacing = 15;
        this.reelCount = 3;
        this.rowCount = 3;
        this.spinning = false;
        this.paylines = [
            [1, 1, 1], // Middle horizontal
            [0, 0, 0], // Top horizontal
            [2, 2, 2], // Bottom horizontal
            [0, 1, 2], // Diagonal from top left to bottom right
            [2, 1, 0]  // Diagonal from bottom left to top right
        ];

        // Create main slot machine frame
        const frameWidth = (this.symbolWidth + 20) * this.reelCount + 60;
        const frameHeight = (this.symbolHeight + 10) * this.rowCount + 120;

        // Add semi-transparent dark background for reels area
        const reelsBackground = this.add.graphics();
        reelsBackground.fillStyle(0x000000, 0.6);
        reelsBackground.fillRoundedRect(
            width / 2 - frameWidth / 2 + 4,
            height / 2 - frameHeight / 2 - 36,
            frameWidth - 8,
            frameHeight - 8,
            14
        );

        // Calculate positions for 3 reels with adjusted spacing
        const spacing = 40;
        const totalWidth = (this.symbolWidth * this.reelCount) + (spacing * (this.reelCount - 1));
        const startX = width / 2 - totalWidth / 2 + this.symbolWidth / 2;
        const startY = height / 2 - ((this.symbolHeight + this.symbolSpacing) * 1.5);
        this.startY = startY;

        // Add vertical separating lines with neon effect
        const separatorGraphics = this.add.graphics();
        for (let i = 1; i < this.reelCount; i++) {
            const lineX = startX + (i * (this.symbolWidth + spacing)) - spacing - 15;

            // Add glow effect
            separatorGraphics.lineStyle(4, 0x4040ff, 0.2);
            separatorGraphics.lineBetween(
                lineX,
                height / 2 - frameHeight / 2,
                lineX,
                height / 2 + frameHeight / 2 - 40
            );

            // Add main line
            separatorGraphics.lineStyle(2, 0x6060ff, 0.8);
            separatorGraphics.lineBetween(
                lineX,
                height / 2 - frameHeight / 2 + 20,
                lineX,
                height / 2 + frameHeight / 2 - 20
            );
        }

        // Add outer frame with gradient
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xf0c040);
        graphics.lineGradientStyle(4, 0xf0c040, 0xffd700, 0xf0c040, 0xffd700);
        graphics.strokeRoundedRect(
            width / 2 - frameWidth / 2,
            height / 2 - frameHeight / 2 - 40,
            frameWidth,
            frameHeight,
            16
        );

        // Add inner frame with darker color
        graphics.lineStyle(2, 0x000000, 0.3);
        graphics.strokeRoundedRect(
            width / 2 - frameWidth / 2 + 4,
            height / 2 - frameHeight / 2 - 36,
            frameWidth - 8,
            frameHeight - 8,
            14
        );

        // Create reels container
        this.reels = [];
        this.symbols = [
            'seven', 'seven', 'seven',
            'sloticon', 'sloticon',
            'cherry', 'cherry', 'cherry',
            'bar', 'bar',
            'bell', 'bell',
            'strawberry', 'strawberry',
            'melon', 'melon',
            'chips', 'chips',
            'cherry',
            'seven',
            'sloticon'
        ];

        // Create reels and symbols
        for (let i = 0; i < this.reelCount; i++) {
            let reel = [];
            for (let j = 0; j < this.rowCount; j++) {
                const symbol = this.add.image(
                    startX + (i * (this.symbolWidth + spacing)),
                    startY + (j * (this.symbolHeight + this.symbolSpacing)),
                    this.symbols[Phaser.Math.Between(0, this.symbols.length - 1)]
                ).setDisplaySize(this.symbolWidth, this.symbolHeight);
                reel.push(symbol);
            }
            this.reels.push(reel);
        }

        // Create spin button
        const buttonGraphics = this.add.graphics();
        buttonGraphics.lineStyle(2, 0xf0c040);
        buttonGraphics.fillStyle(0x333333);
        buttonGraphics.fillRoundedRect(width / 2 - 60, height - 100, 120, 40, 20);
        buttonGraphics.lineGradientStyle(2, 0xf0c040, 0xffd700, 0xf0c040, 0xffd700);
        buttonGraphics.strokeRoundedRect(width / 2 - 60, height - 100, 120, 40, 20);

        const spinButton = this.add.rectangle(
            width / 2,
            height - 80,
            120,
            40
        ).setInteractive();

        spinButton.setAlpha(0.01);
        this.add.text(width / 2, height - 80, 'SPIN', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        spinButton.on('pointerdown', () => {
            if (!this.spinning) {
                this.spinning = true;
                this.spinReels();
            }
        });

        // Create payline graphics container
        this.paylineGraphics = this.add.graphics();
        this.drawPaylines();
        this.paylineGraphics.setAlpha(0);
    }

    drawPaylines() {
        this.paylineGraphics.clear();
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00];

        this.paylines.forEach((payline, index) => {
            const color = colors[index % colors.length];
            this.paylineGraphics.lineStyle(3, color, 0.8);

            const points = payline.map((row, col) => ({
                x: this.reels[col][0].x,
                y: this.reels[col][0].y + (row * (this.symbolHeight + this.symbolSpacing))
            }));

            this.paylineGraphics.beginPath();
            this.paylineGraphics.moveTo(points[0].x - this.symbolWidth / 2, points[0].y);

            points.forEach((point, i) => {
                if (i > 0) {
                    this.paylineGraphics.lineTo(point.x, point.y);
                }
            });

            this.paylineGraphics.lineTo(points[points.length - 1].x + this.symbolWidth / 2, points[points.length - 1].y);
            this.paylineGraphics.strokePath();
        });
    }

    spinReels() {
        const { height } = this.scale;
        let delay = 0;
        const spinDuration = 800;
        const spinSpacing = 80;
        const frameHeight = (this.symbolHeight + 10) * this.rowCount + 60;

        for (let i = 0; i < this.reelCount; i++) {
            const reelDelay = delay + (i * spinSpacing);
            const currentReel = this.reels[i];

            // Set up mask for this reel
            const maskGraphics = this.add.graphics();
            const reelX = currentReel[0].x - this.symbolWidth / 2 - 5;
            const reelY = height / 2 - frameHeight / 2 - 20;
            maskGraphics.fillStyle(0xffffff, 0);
            maskGraphics.fillRect(reelX, reelY, this.symbolWidth + 10, frameHeight - 40);

            const mask = new Phaser.Display.Masks.GeometryMask(this, maskGraphics);
            currentReel.forEach(symbol => symbol.setMask(mask));

            // Create extra symbols for continuous motion
            const extraSymbols = [];
            const symbolCount = 12;
            for (let k = 0; k < symbolCount; k++) {
                const symbolY = currentReel[0].y - ((k + 1) * (this.symbolHeight + this.symbolSpacing));
                const extraSymbol = this.add.image(
                    currentReel[0].x,
                    symbolY,
                    this.symbols[Phaser.Math.Between(0, this.symbols.length - 1)]
                ).setDisplaySize(this.symbolWidth, this.symbolHeight).setMask(mask);
                extraSymbols.push(extraSymbol);
            }

            const allSymbols = [...extraSymbols, ...currentReel];

            this.tweens.add({
                targets: allSymbols,
                y: `+=${symbolCount * (this.symbolHeight + this.symbolSpacing)}`,
                duration: spinDuration,
                delay: reelDelay,
                ease: 'Power2.easeOut',
                repeat: 0,
                onComplete: () => {
                    extraSymbols.forEach(symbol => symbol.destroy());

                    if (i === this.reelCount - 1) {
                        this.paylineGraphics.setAlpha(1);
                        this.tweens.add({
                            targets: this.paylineGraphics,
                            alpha: 0,
                            duration: 1000,
                            ease: 'Sine.easeOut',
                            delay: 500
                        });
                    }

                    currentReel.forEach((symbol, j) => {
                        symbol.y = this.startY + (j * (this.symbolHeight + this.symbolSpacing));
                        symbol.setTexture(this.symbols[Phaser.Math.Between(0, this.symbols.length - 1)]);
                    });

                    // Settling animation
                    this.tweens.add({
                        targets: currentReel,
                        y: `+=${0.9}`,
                        duration: 150,
                        ease: 'Power2.easeOut',
                        onComplete: () => {
                            this.tweens.add({
                                targets: currentReel,
                                y: `-=${0.6}`,
                                duration: 120,
                                ease: 'Sine.easeOut',
                                onComplete: () => {
                                    this.tweens.add({
                                        targets: currentReel,
                                        y: `+=${0.3}`,
                                        duration: 100,
                                        ease: 'Sine.easeOut',
                                        onComplete: () => {
                                            this.tweens.add({
                                                targets: currentReel,
                                                y: `-=${0.15}`,
                                                duration: 80,
                                                yoyo: true,
                                                ease: 'Quad.easeOut'
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });

                    if (i === this.reelCount - 1) {
                        this.spinning = false;
                    }

                    maskGraphics.clear();
                    maskGraphics.fillStyle(0xffffff, 0);
                    maskGraphics.fillRect(reelX, reelY, this.symbolWidth + 10, frameHeight - 40);
                }
            });

            delay += spinSpacing;
        }
    }
}