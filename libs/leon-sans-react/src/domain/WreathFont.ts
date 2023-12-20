import * as PIXI from 'pixi.js'
import { ModelData } from 'leonsans'

export default class WreathFont {
  data: ModelData
  leafContainer: PIXI.Container
  ornamentContainers: PIXI.Container[]

  constructor(data: ModelData) {
    this.data = data
    this.leafContainer = new PIXI.Container()
    this.ornamentContainers = []
  }

  on(stage: PIXI.Container) {
    stage.addChild(this.leafContainer)
  }

  off() {
    this.leafContainer.parent.removeChild(this.leafContainer);
  }

  position(x: number, y: number) {
  }

  draw() {
  }
}