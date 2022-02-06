import { setCustomProperty, incrementCustomProperty, getCustomProperty } from "./updateCustomProperty.js"

const SPEED = .05
const PIPE_INTERVAL_MIN = 500
const PIPE_INTERVAL_MAX = 2000
const worldElem = document.querySelector('[data-world]')

let nextPipeTime

export function setupPipe () {
    nextPipeTime = PIPE_INTERVAL_MIN 
    document.querySelectorAll("[data-pipe]").forEach(pipe => {
        pipe.remove()

    })
}

export function updatePipe (delta, speedScale) {
    document.querySelectorAll('[data-pipe]').forEach(pipe => {
        incrementCustomProperty(pipe, '--left', delta * speedScale * SPEED * -1)
        if (getCustomProperty(pipe, '--left') <= -100) {
            pipe.remove()
        }
    })
    if(nextPipeTime <= 0) {
        createPipe()
        nextPipeTime = 
            randomNumberBetween(PIPE_INTERVAL_MIN, PIPE_INTERVAL_MAX) / speedScale
            
    }

    nextPipeTime -= delta
}

export function getPipeRects() {
    return [...document.querySelectorAll("[data-pipe]")].map(pipe => {
      return pipe.getBoundingClientRect()
    })
}

function createPipe () {
    const pipe = document.createElement('img')
    pipe.dataset.pipe = true;
    pipe.src = './data/imgs/pipe.png'
    pipe.classList.add('pipe')
    setCustomProperty(pipe, '--left', 100)
    worldElem.append(pipe)
}

function randomNumberBetween (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
} 
