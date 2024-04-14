import { StarshipRenderer } from './renderers/StarshipRenderer';
import { StartsRenderer } from './renderers/StartsRenderer';
import { SCENE_HEIGHT, SCENE_WIDTH } from './constants';
import { getSceneTimer } from './sceneTimer';
import { STARSHIP_TEMPLATE_COLORS, STARSHIP_TEMPLATE_DEFAULT } from './templates/starshipTemplates';
import { AsteroidsRenderer } from './renderers/AsteroidsRenderer';
import { ASTEROID_TEMPLATE_COLORS, ASTEROID_TEMPLATE_DEFAULT } from './templates/asteroidTemplates';
import { ShotsRenderer } from './renderers/ShotsRenderer';

// input для отлавливания нажатий клавиш управления на клавиатуре
// Будет скрыт и иметь автофокус при старте
const controller = document.getElementById('controller');

// Тег Канвас, в котором будет происходить отрисовка всей игры
const canvasScene = document.getElementById('scene');
// Контекст канваса - используем 2D для 2D игры. Более сложные изображения рисуются с помощью WebGL (Web Graphics Library)
const sceneCtx = canvasScene.getContext('2d');

// Фокус на input-е при клике на сцену
canvasScene.addEventListener('click', () => controller.focus());

// Фокус на input-е при переключении между вкладками
addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    controller.focus();
  }
});

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
      // По-сути, увеличивая это смещение, мы увеличиваем скорость движения корабля
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
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
}

export function initGame() {
  controller.focus();

  // Отрисовщик звезд
  const startsRenderer = new StartsRenderer(sceneCtx, SCENE_WIDTH, SCENE_HEIGHT);

  // Отрисовщик корбаля
  const starshipRenderer = new StarshipRenderer(sceneCtx, STARSHIP_TEMPLATE_DEFAULT, STARSHIP_TEMPLATE_COLORS);

  // Отрисовщик астероидов
  const asteroidsRenderer = new AsteroidsRenderer(
    sceneCtx,
    ASTEROID_TEMPLATE_DEFAULT,
    ASTEROID_TEMPLATE_COLORS,
    SCENE_WIDTH,
    SCENE_HEIGHT
  );

  // Отрисовщик выстрелов
  const shotRenderer = new ShotsRenderer(sceneCtx, SCENE_WIDTH);

  // При НАЖАТИИ клавишы происходит запись следующих состояний
  // Ключи этого объекта - коды клавиш, которые будем доставать из события keyDown
  const keydownActionsMap = {
    ArrowUp: () => {
      controllerState.pressedVerticalKey = 'ArrowUp';
    },
    ArrowDown: () => {
      controllerState.pressedVerticalKey = 'ArrowDown';
    },
    ArrowRight: () => {
      controllerState.pressedHorizontalKey = 'ArrowRight';
    },
    ArrowLeft: () => {
      controllerState.pressedHorizontalKey = 'ArrowLeft';
    },
    // У коробля два бластера, поэтому рисуем два выстрела
    Space: () => {
      shotRenderer.addShot(state.posX + 20, state.posY);

      // Второй выстрел по высоте отрисовывается в самой нижней по оси y точки корабля
      shotRenderer.addShot(state.posX + 20, state.posY + STARSHIP_TEMPLATE_DEFAULT.length * STARSHIP_COEF);
    },
  };

  // Когда ОТПУСКАЕМ кнопку, очищаем состояние
  // Ключи этого объекта - коды клавиш, которые будем доставать из события keyDown
  const keyupActionsMap = {
    ArrowUp: () => {
      controllerState.pressedVerticalKey = '';
    },
    ArrowDown: () => {
      controllerState.pressedVerticalKey = '';
    },
    ArrowRight: () => {
      controllerState.pressedHorizontalKey = '';
    },
    ArrowLeft: () => {
      controllerState.pressedHorizontalKey = '';
    },
  };

  function handleKeyDown(event) {
    keydownActionsMap[event.code]?.();
  }

  function handleKeyUp(event) {
    keyupActionsMap[event.code]?.();
  }

  controller.addEventListener('keydown', handleKeyDown);
  controller.addEventListener('keyup', handleKeyUp);

  // массив рендер-функций - функция, отрисовывающих что-то на экране в каждом новом кадре
  const renderFns = [
    clearScene,
    startsRenderer.moveStars,
    (_, currentState) => starshipRenderer.renderStarship(currentState.posX, currentState.posY, STARSHIP_COEF),
    asteroidsRenderer.moveAsteroids,
    shotRenderer.moveShots,
  ];

  // В итгое игровой таймер будет рекурсивно вызывать сам себя
  const sceneTimer = getSceneTimer(renderFns, sceneCtx, getState, 10);

  sceneTimer();
}
