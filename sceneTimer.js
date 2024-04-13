// fns - массив рендер-фукнций
// getState - функция, которая возвращает текущее состояние игры
// interval -
// Это функция, которая возращает таймер приложения.
// sceneTimer будет отрисовывать приложение покадрово.
//  Если между кадрами анимации на экране времени прошло больше, чем interval, то будет вызван массив колбэков fns
export function getSceneTimer(fns, ctx, getState, interval = 100) {
  let startTime = 0;

  function sceneTimer(timeStamp = 0) {
    const deltaTime = timeStamp - startTime;

    // Если с момента последнего кадра прошло больше interval милисекунд, то надо обновить (перерисовать) сцену
    if (deltaTime >= interval) {
      const currentState = getState();

      startTime = timeStamp;
      fns.forEach((fn) => fn(ctx, currentState));
    }

    // При каждом вызове в sceneTimer будет передано количество милисекунд, прошедших с предыдущего кадра
    requestAnimationFrame(sceneTimer);
  }

  return sceneTimer;
}
