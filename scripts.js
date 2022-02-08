import { updateGround, setupGround } from './ground.js'
import { updateCharacter, setupCharacter, getCharacterRect, setCharacterLose } from './character.js'
import { updatePipe, setupPipe, getPipeRects } from './pipe.js'

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001


const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')
const marioWorld = document.querySelector('[data-mario-world]')
const marioUp = document.querySelector('[data-mario-up]')

setPixeltoWorldScale()
window.addEventListener('resize', setPixeltoWorldScale)
window.addEventListener('keydown', handleStart, {once: true})
window.addEventListener('click', handleStart, {once: true})
window.addEventListener('DOMContentLoaded', textBlink)

let speedScale
let lastTime
let score
function update (time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime
    
    updateGround(delta, speedScale)
    updateCharacter(delta, speedScale)
    updatePipe(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)

    if(checkLose()) return handleLose()
    lastTime = time
    window.requestAnimationFrame(update)
    
}

function textBlink () {
    setInterval(function () {
        startScreenElem.style.visibility = (startScreenElem.style.visibility == 'hidden' ? '' : 'hidden');
    }, 400);
}



function checkLose () {
    const charRect = getCharacterRect()
    return getPipeRects().some(rect => isCollison(rect, charRect))
}
function isCollison (rect1, rect2) {
    return (rect1.left < rect2.right && 
        rect1.top < rect2.bottom && 
        rect1.right > rect2.left && 
        rect1.bottom > rect2.top)
}

function updateSpeedScale (delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

let up = 100
function updateScore(delta) {
    score += delta * .005
    scoreElem.textContent = Math.floor(score)
    if(Math.floor(score) === up) {
        marioUp.play()
        up += 100
    }
}

function handleStart () {
    score = 0
    lastTime = null
    speedScale = 1
    startScreenElem.classList.add('hide')
    
    marioWorld.play()
    setupGround()
    setupCharacter()
    setupPipe()
    window.requestAnimationFrame(update)
}

function handleLose () {
    
    marioWorld.pause()
    marioWorld.load()
    setCharacterLose()
    setTimeout(() => {
        document.addEventListener('keydown', handleStart, {once:true})
        document.addEventListener('click', handleStart, {once:true})
        startScreenElem.classList.remove('hide')
    }, 1000)
}

function setPixeltoWorldScale () {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT

    }

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}