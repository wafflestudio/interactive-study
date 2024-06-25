import * as THREE from 'three';

import TestBlueStage from './example/TestBlueStage';
import TestHomeStage from './example/TestHomeStage';
import TestYellowStage from './example/TestYellowStage';
import StageManager from './util/stage/StageManager';

// DOM
const app = document.querySelector('#app');
const canvas = app?.querySelector('canvas');
if (!app || !(app instanceof HTMLElement) || !canvas)
  throw new Error('Element not found');

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// Stages
const stageManager = StageManager.instance;
const testYellow = new TestYellowStage(renderer, app);
const testBlue = new TestBlueStage(renderer, app);
const testHome = new TestHomeStage(renderer, app, [testYellow, testBlue]);

/* 아마 여기서 preload를 하면 되지 않을까? */

stageManager.setHome(testHome);
