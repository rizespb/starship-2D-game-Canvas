import { getRandomInt } from '../utils';

// Астероиды, летящие слева направо
export class AsteroidsRenderer {
  // x, y - текущие координаты астероида
  // initX - начальное положение астероида по горизонтали (совпадает с начальным значением x)
  asteroids = []; // { x: number; y: number; initX: number }

  // template - матрица, содержит информацию о том, как выглядит наш корабль (asteroidTemplates.js)
  constructor(ctx, template, colorsMap, sceneWidth, sceneHeight) {
    this.ctx = ctx;
    this.template = template;
    this.colorsMap = colorsMap;
    this.sceneWidth = sceneWidth;
    // Уменьшаем высоту, чтобы отсечь астероиды, которые выходят за границы сцены по высоте
    this.sceneHeight = sceneHeight - 40;

    this.generateAsteroids();
  }

  generateAsteroids = () => {
    for (let y = 0; y < this.sceneHeight; y++) {
      // Чтобы астероиды сначала ренедрелись справа сразу за пределами канвас-сцены, а потом плавно двигались влево, мы их будем генерировать за пределами сцены справа (от sceneWidth до sceneWidth * 5)
      for (let x = this.sceneWidth; x < this.sceneWidth * 5; x++) {
        // Увеличивая максимальное значение, в пределах которого считаем рандом, будем уменьшать плотность астероидов
        const random = getRandomInt(10000);

        if (random === 100) {
          this.asteroids.push({ x, y, initX: x });
        }
      }
    }
  };

  // Функция отрисовки одного астероида
  // x,y - это положение самой левой верхней точки астероида
  // coef - коэффициент: во сколько раз увеличить астероид при отрисовке
  renderAsteroid = (x, y, coef = 2) => {
    for (let j = 0; j < this.template.length; j++) {
      const row = this.template[j];

      for (let i = 0; i < row.length; i++) {
        const cell = row[i];

        if (cell === 0) continue;

        this.ctx.fillStyle = this.colorsMap[cell];
        this.ctx.fillRect(x + i * coef, y + j * coef, coef, coef);
      }
    }
  };

  moveAsteroids = () => {
    this.asteroids.forEach((asteroid) => {
      // Если астероид ушел влево за сцену на 40px, то перемещаем его вправо за сцену на начальную позицию
      if (asteroid.x === -40) {
        asteroid.x = asteroid.initX;
      } else {
        // Астероиды будут двигаться слева направо чуть быстрее звезд (зведы движутся со скростью star.x -= 1)
        // По-сути, увеличивая это смещение, мы увеличиваем скорость движения астероидов
        asteroid.x -= 2;
      }
      this.renderAsteroid(asteroid.x, asteroid.y, 3);
    });
  };
}
