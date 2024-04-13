import { StarshipRenderer } from './StarshipRenderer';
import { StartsRenderer } from './StartsRenderer';
import { SCENE_HEIGHT, SCENE_WIDTH } from './constants';
import { getSceneTimer } from './sceneTimer';
import { STARSHIP_TEMPLATE_COLORS, STARSHIP_TEMPLATE_DEFAULT } from './starshipTemplates';

// input для отлавливания нажатий клавиш управления на клавиатуре
const controller = document.getElementById('controller');

// Тег Канвас, в котором будет происходить отрисовка всей игры
const canvasScene = document.getElementById('scene');
// Контекст канваса - используем 2D для 2D игры. Более сложные изображения рисуются с помощью WebGL (Web Graphics Library)
const sceneCtx = canvasScene.getContext('2d');

// Стейт для хранений того, какие клавиши были нажаты, чтобы в момент отрисовки следующего кадра рассчитать новую позицию корабля
const controllerState = {
  // Управление по горизонтали
  pressedHorizontalKey: '',
  // Управление по вертикали
  pressedVerticalKey: '',
};

const state = {
  // Позиция корабля на экране
  posX: 100,
  posY: 100,
};

// Коэфициент увеличения корабля относительно заданного в шаблоне
const STARSHIP_COEF = 3;

// Функция для подсчета новой позиции корабля после нажатия клавиш управления
// Если за промежуток между отрисовкой кадров пользователь успеет нажать клавиши управления и по горизонтали, и по вертикали, то произойдет перемещение по диагонали
function getState() {
  switch (controllerState.pressedHorizontalKey) {
    case 'ArrowRight':
      state.posX += 3;
      break;
    case 'ArrowLeft':
      state.posX -= 3;
      break;
  }

  switch (controllerState.pressedVerticalKey) {
    case 'ArrowUp':
      state.posY -= 5;
      break;
    case 'ArrowDown':
      state.posY += 5;
      break;
  }

  return state;
}

// Функция для очистки сцены перед отрисовкой следующего кадра
function clearScene(ctx) {
  console.log('CLEAR');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
}

export function initGame() {
  // Экземпляр отрисовщика звезд
  const startsRenderer = new StartsRenderer(sceneCtx, SCENE_WIDTH, SCENE_HEIGHT);

  // Экземпляр отрисовщика корбаля
  const starshipRenderer = new StarshipRenderer(sceneCtx, STARSHIP_TEMPLATE_DEFAULT, STARSHIP_TEMPLATE_COLORS);

  // массив рендер-функций - функция, отрисовывающих что-то на экране в каждом новом кадре
  const renderFns = [
    clearScene,
    startsRenderer.moveStars,
    () => starshipRenderer.renderStarship(100, 100, STARSHIP_COEF),
  ];

  const sceneTimer = getSceneTimer(renderFns, sceneCtx, getState, 10);

  sceneTimer();
}
