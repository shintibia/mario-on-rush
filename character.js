import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const characterElem = document.querySelector('[data-character]')
const marioJump = document.querySelector('[data-mario-jump]')
const marioDeath = document.querySelector('[data-mario-death]')
const JUMP_SPEED = .45
const GRAVITY = .0017
const CHARACTER_FRAME_COUNT = 3
const FRAME_TIME = 100

let isJumping
let characterFrame
let currentFrameTime
let yVelocity
export function setupCharacter () {
    isJumping = false
    characterFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(characterElem, '--bottom', 7)
    setCustomProperty(characterElem, '--height', 30)
    document.removeEventListener('keydown', onJump)
    document.addEventListener('keydown', onJump)
}

export function updateCharacter (delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
    
}

export function getCharacterRect() {
    return characterElem.getBoundingClientRect()
}

export function setCharacterLose() {
    setCustomProperty(characterElem, '--height', 20)
    characterElem.src = `./data/imgs/death1.png`
    marioDeath.play()
}

function handleRun (delta, speedScale) {
    if(isJumping) {
        characterElem.src = `./data/imgs/jumping.png`
        return
    }

    if (currentFrameTime >= FRAME_TIME) {
        characterFrame = (characterFrame + 1) % CHARACTER_FRAME_COUNT
        characterElem.src = `./data/imgs/running-${characterFrame}.png`
        currentFrameTime -= FRAME_TIME
    }

    currentFrameTime += delta * speedScale
}

function handleJump (delta) {
    if (!isJumping) {
        return
    }

    incrementCustomProperty(characterElem, '--bottom', yVelocity * delta)
    if (getCustomProperty(characterElem, '--bottom') <= 0) {
        setCustomProperty(characterElem, '--bottom', 7)
        isJumping = false
        
    }
    
    marioJump.play()
    yVelocity -= GRAVITY * delta
}

function onJump (e) {
    if(e.code !== 'Space' || isJumping) {
        
        return
    }
    
    yVelocity = JUMP_SPEED
    isJumping = true
}