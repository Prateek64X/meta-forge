// slotMachineConfig.js
'use client';

const createSlotMachineConfig = (Phaser) => ({
  type: Phaser.AUTO,
  parent: 'slot-machine-container',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 360,
    height: 640
  },
  scene: [SlotMachine],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
});

export default createSlotMachineConfig;