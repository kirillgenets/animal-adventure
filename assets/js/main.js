'use strict';

const screenStart = document.querySelector('.screen-start'),
  screenGame = document.querySelector('.screen-game'),
  playground = screenGame.querySelector('.playground'),
  startButton = screenStart.querySelector('.start-button');

startButton.addEventListener('click', onStartButtonClick);

// Данные
const settings = {
  isStarted: false
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
    width: 83,
    height: 90,
    image: 'banana.png',
    posX: 0,
    posY: 0
  },
  blackberry: {
    width: 70,
    height: 84,
    image: 'blackberry.png',
    posX: 0,
    posY: 0
  },
  paprika: {
    width: 96,
    height: 120,
    image: 'paprika.png',
    posX: 0,
    posY: 0
  },
  pear: {
    width: 77,
    height: 105,
    image: 'pear.png',
    posX: 0,
    posY: 0
  },
}

let characterData = {};

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
}

function renderAllObjects() {
  renderCharacter();
}

function createCharacterData() {
  characterData = Object.assign({}, characterDefaultData);
  characterData.isMoving = false;
}

function renderCharacter() {
  const character = new Character(characterData);
  playground.append(character.render());

  document.addEventListener('keydown', onCharacterKeyDown);
  document.addEventListener('keyup', onCharacterKeyUp);

  requestAnimationFrame(moveCharacter);

  function moveCharacter() {
    if (settings.isStarted) {
      character.directions = characterData.directions;
      
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

      character.move(characterData.posX, characterData.posY);
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

function createElement(template) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = template;
  wrapper.firstChild.innerHTML = '';

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
    return `<div class="${this._className}"><div/>`
  }

  render() {
    return this._element = createElement(this.template);
  }

  move(newPosX, newPosY) {
    this._element.style.left = `${newPosX}px`;
    this._element.style.bottom = `${newPosY}px`;
    this._changeDirection();

    requestAnimationFrame(this._animate);
  }
}

class Fruit {
  constructor(props) {
    this._width = props.width;
    this._height = props.height;
    this._image = props.image;
    this._posX = props.posX;
    this._posY = props.posY;
  }
}