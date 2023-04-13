import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { gl } from '../core/WebGL'
import { blur } from './Blur'
import * as THREE from 'three'

class Effect {
  private composer!: EffectComposer

  constructor() {
    this.init()
  }

  private init() {
    this.composer = new EffectComposer(gl.renderer)
    this.composer.setPixelRatio(window.devicePixelRatio)
    this.composer.renderTarget1.texture.wrapS = THREE.MirroredRepeatWrapping
    this.composer.renderTarget1.texture.wrapT = THREE.MirroredRepeatWrapping

    this.composer.addPass(new RenderPass(gl.scene, gl.camera))
    blur.addPass(this.composer)
  }

  resize() {
    const { width, height } = gl.size
    blur.resize()
    this.composer.setSize(width, height)
  }

  render() {
    this.composer.render()
  }
}

export const effect = new Effect()
