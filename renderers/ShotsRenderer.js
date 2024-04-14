// Отрисовка выстрелов корабля
export class ShotsRenderer {
  shots = []; // { x, y };

  constructor(ctx, sceneWidth) {
    this.ctx = ctx;

    // Выстрелы будут "улетать" на 10 px дальше вправо за пределы сцены и там будут "застревать" (не будем перерисовывать "улетевшие" выстрелы)
    this.sceneWidth = sceneWidth + 10;
  }

  addShot = (x, y) => {
    this.shots.push({ x, y });
  };

  renderShot = (x, y) => {
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillRect(x, y, 5, 2);
  };

  moveShots = (onMoveShots) => {
    this.shots.forEach((shot) => {
      // Если выстрел в пределах видимой области, то двигаем выстрел по оси x влево на 10px и перерисовывать этот выстрел
      if (shot.x < this.sceneWidth) {
        // По-сути, увеличивая это смещение, мы увеличиваем скорость движения выстрелов
        shot.x += 10;
        this.renderShot(shot.x, shot.y);
      }
    });

    onMoveShots();
  };
}
