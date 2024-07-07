import { KeyMap } from '../../libs/keyboard/KeyMap';

class Entity {
  position: { x: number; y: number };
  direction: { x: number; y: number };
  prevDirection: { x: number; y: number } = { x: 1, y: 0 };
  speed: number;

  constructor(
    position: { x: number; y: number },
    direction: { x: number; y: number },
    speed: number,
  ) {
    this.position = position;
    this.direction = direction;
    this.speed = speed;
  }

  updatePrevDirection() {
    if (this.direction.x === 0 && this.direction.y === 0) return;
    this.prevDirection.x = this.direction.x;
    this.prevDirection.y = this.direction.y;
  }

  move(deltaTime: number) {
    this.position.x += this.direction.x * this.speed * deltaTime;
    this.position.y += this.direction.y * this.speed * deltaTime;
  }
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;
const triangle = new Entity({ x: 10, y: 10 }, { x: 0, y: 0 }, 0.3);
let needsUpdatePrevDirection = false;

let bullets: Entity[] = [];
const fireInterval = 30;
let isFiring = false;
let lastFireTime = 0;

function drawTriangle(
  context: CanvasRenderingContext2D,
  position: { x: number; y: number },
  direction: { x: number; y: number },
) {
  context.save();
  context.translate(position.x, position.y);
  context.rotate(Math.atan2(direction.y, direction.x));
  const p = new Path2D('M 20 0 L 0 -10 L 6 0 L 0 10 L 20 0');
  context.fill(p);
  context.restore();
}

function drawBullet(
  context: CanvasRenderingContext2D,
  position: { x: number; y: number },
) {
  context.beginPath();
  context.arc(position.x, position.y, 5, 0, Math.PI * 2);
  context.closePath();
  context.fill();
}

let prevTime = Date.now();

requestAnimationFrame(function draw() {
  const now = Date.now();
  const deltaTime = now - prevTime;
  prevTime = now;
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (needsUpdatePrevDirection) {
    triangle.updatePrevDirection();
    needsUpdatePrevDirection = false;
  }

  if (triangle.direction.x !== 0 || triangle.direction.y !== 0) {
    triangle.move(deltaTime);
    triangle.position.x = Math.max(
      0,
      Math.min(canvas.width, triangle.position.x),
    );
    triangle.position.y = Math.max(
      0,
      Math.min(canvas.height, triangle.position.y),
    );
  }

  drawTriangle(context, triangle.position, triangle.prevDirection);

  if (isFiring && now - lastFireTime > fireInterval) {
    lastFireTime = now;
    const bullet = new Entity(
      Object.assign({}, triangle.position),
      Object.assign({}, triangle.prevDirection),
      0.5,
    );
    bullets.push(bullet);
  }

  bullets = bullets.filter((bullet) => {
    bullet.move(deltaTime);
    drawBullet(context, bullet.position);
    return (
      bullet.position.x >= 0 &&
      bullet.position.y >= 0 &&
      bullet.position.x <= canvas.width &&
      bullet.position.y <= canvas.height
    );
  });

  requestAnimationFrame(draw);
});

const keyMap = new KeyMap();

keyMap.bind(
  'ArrowUp',
  () => {
    triangle.direction.y = -1;
    needsUpdatePrevDirection = true;
  },
  () => {
    if (triangle.direction.y === -1) {
      triangle.direction.y = 0;
      needsUpdatePrevDirection = true;
    }
  },
);

keyMap.bind(
  'ArrowDown',
  () => {
    triangle.direction.y = 1;
    needsUpdatePrevDirection = true;
  },
  () => {
    if (triangle.direction.y === 1) {
      triangle.direction.y = 0;
      needsUpdatePrevDirection = true;
    }
  },
);

keyMap.bind(
  'ArrowLeft',
  () => {
    triangle.direction.x = -1;
    needsUpdatePrevDirection = true;
  },
  () => {
    if (triangle.direction.x === -1) {
      triangle.direction.x = 0;
      needsUpdatePrevDirection = true;
    }
  },
);

keyMap.bind(
  'ArrowRight',
  () => {
    triangle.direction.x = 1;
    needsUpdatePrevDirection = true;
  },
  () => {
    if (triangle.direction.x === 1) {
      triangle.direction.x = 0;
      needsUpdatePrevDirection = true;
    }
  },
);

keyMap.bind(
  'Space',
  () => {
    isFiring = true;
  },
  () => {
    isFiring = false;
  },
);

keyMap.activate();
