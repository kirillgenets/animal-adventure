'use strict';

const MAX_FRUITS_COUNT_X = 5,
  MAX_STONES_COUNT_X = 3,
  MAX_FRUITS_DISTANCE_Y = 150,
  MAX_STONES_DISTANCE_Y = 200,
  FRUITS_COUNT_Y = 7,
  STONES_COUNT_Y = 4;

const screenStart = document.querySelector('.screen-start'),
  screenGame = document.querySelector('.screen-game'),
  playground = screenGame.querySelector('.playground'),
  startButton = screenStart.querySelector('.start-button');

startButton.addEventListener('click', onStartButtonClick);

// Данные
const settings = {
  isStarted: false,
  speed: 1
}

const characterDefaultData = {
  width: 48.666667,
  height: 49.25,
  spriteWidth: 146,
  spriteHeight: 197,
  backgroundPosX: 0,
  backgroundPosY: -147.75,
  posX: 487,
  posY: 10,
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

const fruitTypesArr = Object.keys(Food);

let characterData = {};
let fruitsData = [];
let stonesData = [];

// Обработчики событий
function onStartButtonClick() {
  screenStart.classList.add('hidden');
  screenGame.classList.remove('hidden');

  initGame();
}

// Функции
function initGame() {
  settings.isStarted = true;
  
  createAllData();
  renderAllObjects();
}

function createAllData() {
  createCharacterData();
  createFruitsData();
  createStonesData();
}

function renderAllObjects() {
  renderCharacter();
  renderAllFruits();
  renderAllStones();
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

    requestAnimationFrame(moveCharacter);
  }

  function changeCharacterPosition() {
    if (characterData.isMoving) {
      if (characterData.directions.back) {
        characterData.posY -= characterData.speed;
      } else if (characterData.directions.left) {
        characterData.posX -= characterData.speed;
      } else if (characterData.directions.right) {
        characterData.posX += characterData.speed;
      } else {
        characterData.posY += characterData.speed;
      }

      if (characterData.posX < 0) {
        characterData.posX = 0;
      }

      if (characterData.posX > playground.clientWidth - characterData.width) {
        characterData.posX = playground.clientWidth - characterData.width;
      }

      if (characterData.posY < 0) {
        characterData.posY = 0;
      }

      if (characterData.posY > playground.clientHeight - characterData.height) {
        characterData.posY = playground.clientHeight - characterData.height;
      }

      characterInstance.move(characterData.posX, characterData.posY);
    }
  }

  function onCharacterKeyDown(evt) {
    switch (evt.key) {
      case 'ArrowUp':
        clearDirections();
        characterData.directions.forward = true;
        characterData.isMoving = true;
        break;
      case 'ArrowDown':
        clearDirections();
        characterData.directions.back = true;
        characterData.isMoving = true;
        break;
      case 'ArrowLeft':
        clearDirections();
        characterData.directions.left = true;
        characterData.isMoving = true;
        break;
      case 'ArrowRight':
        clearDirections();
        characterData.directions.right = true;
        characterData.isMoving = true;
        break;
    }
  }

  function onCharacterKeyUp(evt) {
    switch (evt.key) {
      case 'ArrowUp':
        characterData.isMoving = false;
        break;
      case 'ArrowDown':
        characterData.isMoving = false;
        break;
      case 'ArrowLeft':
        characterData.isMoving = false;
        break;
      case 'ArrowRight':
        characterData.isMoving = false;
        break;
    }
  }

  function clearDirections() {
    for (let key in characterData.directions) {
      characterData.directions[key] = false;
    }
  }
}

function createFruitsData() {
  let y = 0;

  for (let i = 0; i < FRUITS_COUNT_Y; i++) {
    for (let j = 0; j < getRandomObjectsCount(MAX_FRUITS_COUNT_X); j++) {
      const randomFruitData = Object.assign({}, Food[getRandomFruitType()]);
      randomFruitData.posX = getRandomObjectPosition();
      randomFruitData.posY = y;
  
      fruitsData.push(randomFruitData);
    }

    y -= MAX_FRUITS_DISTANCE_Y;
  }
}

function renderAllFruits() {
  fruitsData.forEach(renderFruit);
}

function renderFruit(fruitData) {
  let fruitInstance = new GameObject(fruitData);
  playground.append(fruitInstance.render());

  requestAnimationFrame(moveFruit);

  function moveFruit() {
    if (settings.isStarted && fruitInstance) {
      changeFruitPosition();
      loopFruits();     
    }

    requestAnimationFrame(moveFruit);    
  }

  function changeFruitPosition() {
    fruitData.posY += settings.speed;
    fruitInstance.fall(fruitData.posY);
  }

  function loopFruits() {
    if (fruitData.posY > playground.clientHeight) {
      fruitData.posY = -fruitData.height;
      fruitData.posX = getRandomObjectPosition();
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
      const randomStoneData = Object.assign({}, stonesDefaultData);
      randomStoneData.posX = getRandomObjectPosition();
      randomStoneData.posY = y;
  
      stonesData.push(randomStoneData);
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
      loopStones();     
    }

    requestAnimationFrame(moveStone);    
  }

  function changeStonePosition() {
    stoneData.posY += settings.speed;
    stoneInstance.fall(stoneData.posY);
  }

  function loopStones() {
    if (stoneData.posY > playground.clientHeight) {
      stoneData.posY = -stoneData.height;
      stoneData.posX = getRandomObjectPosition();
    }
  }
}

function getRandomObjectsCount(maxCount) {
  return Math.floor(Math.random() * maxCount);
}

function getRandomObjectPosition() {
  return Math.random() * playground.clientWidth;
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
    if (this._directions.back) {
      this._backgroundPosY = 0;
    } else if (this._directions.left) {
      this._backgroundPosY = -this._height;
    } else if (this._directions.right) {
      this._backgroundPosY = -this._height * 2;
    } else {
      this._backgroundPosY = -this._height * 3;
    }

    this._element.style.backgroundPosition = `${this._backgroundPosX}px ${this._backgroundPosY}px`;
  }

  _animate() {
    this._backgroundPosX += this._width;
    this._element.style.backgroundPosition = `${this._backgroundPosX}px ${this._backgroundPosY}px`;
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
    this._element.style.left = `${newPosX}px`;
    this._element.style.bottom = `${newPosY}px`;
    this._changeDirection();

    requestAnimationFrame(this._animate);
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
    this._element.remove();
    this._element = null;
  }

  fall(newPosY) {
    this._element.style.top = `${newPosY}px`;
  }
}