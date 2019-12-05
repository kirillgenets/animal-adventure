'use strict';

const MAX_FRUITS_COUNT_X = 5,
  MAX_STONES_COUNT_X = 5,
  MAX_FRUITS_DISTANCE_Y = 150,
  MAX_STONES_DISTANCE_Y = 200,
  FRUITS_COUNT_Y = 7,
  STONES_COUNT_Y = 5,
  BACKGROUND_SPEED = 0.5,
  MEETING_GAP = 15;

const screenStart = document.querySelector('.screen-start'),
  screenGame = document.querySelector('.screen-game'),
  playground = screenGame.querySelector('.playground'),
  startButton = screenStart.querySelector('.start-button'),
  rulesList = screenStart.querySelector('.rules-list'),
  defaultIndicators = screenGame.querySelectorAll('.panel-score'),
  soundToggler = document.querySelector('.sound-toggler'),
  pauseToggler = screenGame.querySelector('.pause-toggler'),
  gameOverPanel = document.querySelector('.panel-over'),
  scoreValueElement = gameOverPanel.querySelector('.game-score-value'),
  timeValueElement = gameOverPanel.querySelector('.playing-time-value'),
  playAgainButton = gameOverPanel.querySelector('.play-again-button');

// Данные
const settings = {
  isStarted: false,
  isOver: false,
  speed: 2,
  startTime: '',
  pauseTime: '',
  backgroundPosition: 0,
  isSoundActive: true
}

const characterDefaultData = {
  width: 48.666667,
  height: 49.25,
  spriteWidth: 146,
  spriteHeight: 197,
  backgroundPosX: 0,
  backgroundPosY: -147.75,
  posX: 487,
  posY: 720,
  speed: 1.5,
  className: 'character',
  directions: {
    forward: true,
    back: false,
    left: false,
    right: false
  }
}

const Food = {
  banana: {
    name: 'banana',
    width: 25,
    height: 27,
    image: 'banana.png',
    posX: 0,
    posY: 0
  },
  blackberry: {
    name: 'blackberry',
    width: 21,
    height: 25,
    image: 'blackberry.png',
    posX: 0,
    posY: 0
  },
  paprika: {
    name: 'paprika',
    width: 29,
    height: 36,
    image: 'paprika.png',
    posX: 0,
    posY: 0
  },
  pear: {
    name: 'pear',
    width: 23,
    height: 32,
    image: 'pear.png',
    posX: 0,
    posY: 0
  }
}

const stonesDefaultData = {
  name: 'stone',
  width: 54,
  height: 50,
  image: 'stone.png',
  posX: 0,
  posY: 0
}

const indicatorsDefaultData = {
  fruits: {
    type: 'fruits',
    description: 'Очки',
    value: 0
  },
  timer: {
    type: 'timer',
    description: 'Время',
    value: '00:00'
  }
}

const fruitTypesArr = Object.keys(Food);
const indicatorsTypesArr = Object.keys(indicatorsDefaultData);

const sounds = {
  backgroundAudio: new Audio('./assets/sound/background.mp3'),
  clickAudio: new Audio('./assets/sound/click.mp3'),
  countAudio: new Audio('./assets/sound/count.mp3'),
  finishAudio: new Audio('./assets/sound/finish.mp3')
}

let characterData = {};
let fruitsData = [];
let stonesData = [];
let indicatorsData = {};

document.addEventListener('click', onDocumentClick);
startButton.addEventListener('click', onStartButtonClick);
soundToggler.addEventListener('click', onSoundTogglerClick);

// Анимация показа правил игры
rulesList.style.animation = 'show 2s';

// Обработчики событий
function onDocumentClick() {
  sounds.clickAudio.play();
}

function onStartButtonClick() {
  screenStart.classList.add('hidden');
  screenGame.classList.remove('hidden');

  initGame();
}

function onPlayAgainButtonClick() {
  gameOverPanel.classList.add('hidden');
  
  initGame();
}

function onSoundTogglerClick() {
  toggleSoundActivity();
}

function onPauseKeyDown(evt) {
  if (evt.code === 'Space') {
    pauseGame();
  }
}

function onPauseTogglerClick() {
  pauseGame();
}

// Функции
function initGame() {
  settings.isOver = false;
  settings.isStarted = true;
  settings.startTime = Date.now();

  pauseToggler.addEventListener('click', onPauseTogglerClick);
  document.addEventListener('keydown', onPauseKeyDown);

  startButton.removeEventListener('click', onStartButtonClick);
  playAgainButton.removeEventListener('click', onPlayAgainButtonClick);

  sounds.backgroundAudio.loop = true;
  sounds.backgroundAudio.play();

  requestAnimationFrame(moveBackground);

  clearAllData();
  clearAllObjects();
  
  createAllData();
  renderAllObjects();
}

function clearAllData() {
  characterData = {};
  fruitsData = [];
  stonesData = [];
  indicatorsData = {};
}

function clearAllObjects() {
  document.querySelectorAll('.object').forEach(object => { object.remove(); });
}

function overGame() {
  settings.isStarted = false;
  settings.isOver = true;

  stopAudio(sounds.backgroundAudio);
  stopAudio(sounds.countAudio);

  sounds.finishAudio.play();

  gameOverPanel.classList.remove('hidden');
  
  showResults();

  playAgainButton.addEventListener('click', onPlayAgainButtonClick);

  pauseToggler.removeEventListener('click', onPauseTogglerClick);
  document.removeEventListener('keydown', onPauseKeyDown);
}

function showResults() {
  timeValueElement.textContent = indicatorsData.timer.value;
  scoreValueElement.textContent = indicatorsData.fruits.value;
}

function createAllData() {
  createCharacterData();
  createFruitsData();
  createStonesData();
  createIndicatorsData();
}

function renderAllObjects() {
  renderCharacter();
  renderAllFruits();
  renderAllStones();
  renderIndicators();
}

function toggleSoundActivity() {
  settings.isSoundActive = !settings.isSoundActive;
  soundToggler.classList.toggle('inactive');

  for (const key in sounds) {
    sounds[key].volume = settings.isSoundActive ? 1 : 0;
  }  
}

function stopAudio(audio) {
  audio.pause();
  audio.currentTime = 0.0;
}

function pauseGame() {
  pauseToggler.classList.toggle('inactive');

  settings.pauseTime = settings.pauseTime || Date.now();
  settings.isStarted = !settings.isStarted;

  if (settings.isStarted) {
    sounds.backgroundAudio.play();
  } else {
    sounds.backgroundAudio.pause();
  }
}

function moveBackground() {
  if (settings.isStarted && characterData.isMoving) {
    settings.backgroundPosition += characterData.directions.forward ? BACKGROUND_SPEED : 0;
    settings.backgroundPosition -= characterData.directions.back ? BACKGROUND_SPEED : 0;   
  }

  screenGame.style.backgroundPosition = `0 ${settings.backgroundPosition}px`;

  if (!settings.isOver) {
    requestAnimationFrame(moveBackground);
  }  
}

function createCharacterData() {
  characterData = Object.assign({}, characterDefaultData);
  characterData.isMoving = false;
}

function renderCharacter() {
  const characterInstance = new Character(characterData);
  playground.append(characterInstance.render());

  document.addEventListener('keydown', onCharacterKeyDown);
  document.addEventListener('keyup', onCharacterKeyUp);

  requestAnimationFrame(moveCharacter);

  function moveCharacter() {
    if (settings.isStarted) {
      characterInstance.directions = characterData.directions;
      
      changeCharacterPosition();
    }

    if (settings.isOver) {
      characterInstance.unrender();
    }

    if (!settings.isOver) {
      requestAnimationFrame(moveCharacter);
    }      
  }

  function changeCharacterPosition() {
    if (characterData.isMoving) {
      characterData.posY += characterData.directions.back ? characterData.speed : 0;
      characterData.posY -= characterData.directions.forward ? characterData.speed : 0;
      characterData.posX -= characterData.directions.left ? characterData.speed : 0;
      characterData.posX += characterData.directions.right ? characterData.speed : 0;

      characterData.posX = characterData.posX < 0 ? 0 : characterData.posX;
      characterData.posY = characterData.posY < 0 ? 0 : characterData.posY;

      characterData.posX = characterData.posX > playground.clientWidth - characterData.width ? 
        playground.clientWidth - characterData.width : characterData.posX;

      characterData.posY = characterData.posY > playground.clientHeight - characterData.height ? 
        playground.clientHeight - characterData.height : characterData.posY;

      characterInstance.move(characterData.posX, characterData.posY);
    }
  }

  function onCharacterKeyDown(evt) {
    switch (evt.key) {
      case 'ArrowUp':
        changeCharacterDirection('forward');
        break;
      case 'ArrowDown':
        changeCharacterDirection('back');
        break;
      case 'ArrowLeft':
        changeCharacterDirection('left');
        break;
      case 'ArrowRight':
        changeCharacterDirection('right');
        break;
    }
  }

  function onCharacterKeyUp(evt) {
    if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown' || evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') {
      characterData.isMoving = false;
    }
  }

  function clearDirections() {
    for (let key in characterData.directions) {
      characterData.directions[key] = false;
    }
  }

  function changeCharacterDirection(direction) {
    clearDirections();
    characterData.directions[direction] = true;
    characterData.isMoving = true;
  }
}

function isMeetingWithCharacter(objectData) {
  return (characterData.posX + MEETING_GAP <= objectData.posX + objectData.width && 
          characterData.posX - MEETING_GAP + characterData.width >= objectData.posX &&
          characterData.posY + MEETING_GAP <= objectData.posY + objectData.height &&
          characterData.posY - MEETING_GAP + characterData.height >= objectData.posY);
}


function createFruitsData() {
  let y = 0;

  for (let i = 0; i < FRUITS_COUNT_Y; i++) {
    for (let j = 0; j < getRandomObjectsCount(MAX_FRUITS_COUNT_X); j++) {
      const randomFruitData = Object.assign({}, Food[getRandomFruitType()]);
      randomFruitData.posX = getRandomObjectPosition(randomFruitData.width);
      randomFruitData.posY = y;
  
      fruitsData.push(randomFruitData);
    }

    y -= MAX_FRUITS_DISTANCE_Y;
  }
}

function renderAllFruits() {
  fruitsData.forEach(renderFruit);
}

function renderFruit(fruitData, index) {
  let fruitInstance = new GameObject(fruitData);
  playground.append(fruitInstance.render());

  requestAnimationFrame(moveFruit);

  function moveFruit() {
    if (settings.isStarted) {
      changeFruitPosition();
      checkFruitForMeeting();
      loopFruit();     
    }

    if (!settings.isOver) {
      requestAnimationFrame(moveFruit);
    }    
  }

  function changeFruitPosition() {
    fruitData.posY += settings.speed;
    fruitInstance.fall(fruitData.posX, fruitData.posY);
  }

  function loopFruit() {
    if (fruitData.posY > playground.clientHeight) {
      fruitData.posY = -fruitData.height;
      fruitData.posX = getRandomObjectPosition(fruitData.width);
    }
  }

  function checkFruitForMeeting() {
    if (isMeetingWithCharacter(fruitData)) {
      fruitData.posY = playground.clientHeight;
      indicatorsData.fruits.value++;
      sounds.countAudio.play();
    }
  }
}

function getRandomFruitType() {
  return fruitTypesArr[Math.floor(Math.random() * fruitTypesArr.length)];
}

function createStonesData() {
  let y = 0;

  for (let i = 0; i < STONES_COUNT_Y; i++) {
    for (let j = 0; j < getRandomObjectsCount(MAX_STONES_COUNT_X); j++) {
      const stoneData = Object.assign({}, stonesDefaultData);
      stoneData.posX = getRandomObjectPosition(stoneData.width);
      stoneData.posY = y;
  
      stonesData.push(stoneData);
    }

    y -= MAX_STONES_DISTANCE_Y;
  }
}

function renderAllStones() {
  stonesData.forEach(renderStone);
}

function renderStone(stoneData) {
  let stoneInstance = new GameObject(stoneData);
  playground.append(stoneInstance.render());

  requestAnimationFrame(moveStone);

  function moveStone() {
    if (settings.isStarted && stoneInstance) {
      changeStonePosition();
      loopStone();
      checkStoneForMeeting();
    }

    if (!settings.isOver) {
      requestAnimationFrame(moveStone);
    }        
  }

  function changeStonePosition() {
    stoneData.posY += settings.speed;
    stoneInstance.fall(stoneData.posX, stoneData.posY);
  }

  function loopStone() {
    if (stoneData.posY > playground.clientHeight) {
      stoneData.posY = -stoneData.height;
      stoneData.posX = getRandomObjectPosition(stoneData.width);
    }
  }

  function checkStoneForMeeting() {
    if (isMeetingWithCharacter(stoneData)) {
      overGame();
    }
  }
}

function getRandomObjectsCount(maxCount) {
  return Math.floor(Math.random() * maxCount);
}

function getRandomObjectPosition(width) {
  const edge = playground.clientWidth - width; 
  return Math.random() * edge;
}

function createIndicatorsData() {
  indicatorsDefaultData.fruits.value = 0;
  indicatorsData = Object.assign({}, indicatorsDefaultData);
}

function renderIndicators() {
  clearOldIndicators();

  indicatorsTypesArr.forEach(type => {
    const indicatorData = indicatorsData[type];
    const indicatorInstance = new Indicator(indicatorData);

    screenGame.append(indicatorInstance.render());

    if (type === 'fruits') {
      requestAnimationFrame(changeFruitsValue);
    }

    if (type === 'timer') {
      requestAnimationFrame(changeTimerValue);
    }

    function changeFruitsValue() {
      if (settings.isStarted) {
        indicatorInstance.change(indicatorData.value);
      }

      if (!settings.isOver) {
        requestAnimationFrame(changeFruitsValue);
      }
    }

    function changeTimerValue() {
      if (settings.isStarted) {
        if (settings.pauseTime) {
          settings.startTime += Date.now() - settings.pauseTime;
          settings.pauseTime = '';
        }

        indicatorData.value = '';
        const currentTime = (Date.now() - settings.startTime) / 1000;
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);

        indicatorData.value = `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;

        indicatorInstance.change(indicatorData.value);
      }

      if (!settings.isOver) {
        requestAnimationFrame(changeTimerValue);
      }     
    }
  });
}

function clearOldIndicators() {
  defaultIndicators.forEach(indicator => indicator.remove());
}

function createElement(template) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = template;

  return wrapper.firstChild;
}

// Классы
class Character {
  constructor(props) {
    this._className = props.className;
    this._width = props.width;
    this._height = props.height;
    this._posX = props.posX;
    this._posY = props.posY;
    this._backgroundPosX = props.backgroundPosX;
    this._backgroundPosY = props.backgroundPosY;
    this._spriteWidth = props.spriteWidth;
    this._spriteHeight = props.spriteHeight;
    this._directions = props.directions;
    
    this._element = null;

    this._animate = this._animate.bind(this);
  }

  _changeDirection() {
    this._backgroundPosY = this._directions.back ? 0 : this._backgroundPosY;
    this._backgroundPosY = this._directions.forward ? -this._height * 3 : this._backgroundPosY;
    this._backgroundPosY = this._directions.left ? -this._height : this._backgroundPosY;
    this._backgroundPosY = this._directions.right ? -this._height * 2 : this._backgroundPosY;

    this._element.style.backgroundPosition = `${this._backgroundPosX}px ${this._backgroundPosY}px`;
  }

  _animate() {
    if (this._element) {
      this._backgroundPosX += this._width;
      this._element.style.backgroundPosition = `${this._backgroundPosX}px ${this._backgroundPosY}px`;
    }    
  }

  set directions(value) {
    this._directions = value;
  }

  get template() {
    return `<div class="${this._className}"></div>`
  }

  render() {
    return this._element = createElement(this.template);
  }

  unrender() {
    this._element.remove();
    this._element = null;
  }

  move(newPosX, newPosY) {
    if (this._element) {
      this._element.style.left = `${newPosX}px`;
      this._element.style.top = `${newPosY}px`;
      this._changeDirection();

      requestAnimationFrame(this._animate);
    }    
  }
}

class GameObject {
  constructor(props) {
    this._width = props.width;
    this._height = props.height;
    this._image = props.image;
    this._name = props.name;
    this._posX = props.posX;
    this._posY = props.posY;
  }

  get template() {
    return `<img class="object" src="./assets/img/${this._image}" alt="${this._name}">`
  }

  render() {
    this._element = createElement(this.template);
    this._element.style.left = `${this._posX}px`;
    this._element.style.top = `${this._posY}px`;
    this._element.style.width = `${this._width}px`;
    this._element.style.width = `${this._height}px`;

    return this._element;
  }

  unrender() {
    if (this._element) {
      this._element.remove();
      this._element = null;
    }     
  }

  fall(newPosX, newPosY) {
    if (this._element) {
      this._element.style.left = `${newPosX}px`;
      this._element.style.top = `${newPosY}px`;
    }    
  }
}

class Indicator {
  constructor(props) {
    this._type = props.type;
    this._description = props.description;
    this._value = props.value;
  }

  get template() {
    return `<div class="panel-score panel-${this._type}">
              <p class="panel-score-description">${this._description}:</p>
              <p class="panel-score-value ${this._type}-value">${this._value}</p>
            </div>`;
  }

  render() {
    return this._element = createElement(this.template);
  }

  unrender() {
    this._element.remove();
    this._element = null;
  }

  change(value) {
    this._value = value;
    this._element.querySelector('.panel-score-value').textContent = this._value;
  }
}