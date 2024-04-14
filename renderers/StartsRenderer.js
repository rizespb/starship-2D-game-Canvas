import { getRandomInt } from '../utils';

// Генератор звезд для фона
export class StartsRenderer {
  stars = []; // { x: number, y: number; }

  constructor(ctx, sceneWidth, sceneHeight) {
    this.ctx = ctx;
    this.sceneWidth = sceneWidth;
    this.sceneHeight = sceneHeight;

    this.generateStars();
  }

  generateStars = () => {
    this.stars = [];

    for (let y = 0; y < this.sceneHeight; y++) {
      for (let x = 0; x < this.sceneWidth; x++) {
        // Увеличивая максимальное значение, в пределах которого считаем рандом, будем уменьшать плотность астероидов
        const random = getRandomInt(1000);

        if (random === 100) {
          this.stars.push({ x, y });
        }
      }
    }
  };

  // Функция отрисовки одной звезды
  renderStar = (x, y) => {
    this.ctx.fillStyle = '#fff';
    // x,y - координаты откуда начать рисовать
    // 3ий и 4ый аргументы - сколько пикселей закрасить по осям x и y
    this.ctx.fillRect(x, y, 1, 1);
  };

  moveStars = () => {
    this.stars.forEach((star) => {
      if (star.x === 0) {
        star.x = this.sceneWidth;
      } else {
        star.x -= 1;
      }

      this.renderStar(star.x, star.y);
    });
  };
}
