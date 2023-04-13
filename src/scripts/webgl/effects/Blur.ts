import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { gl } from '../core/WebGL'
import vertexShader from '../shader/effectVs.glsl'
import fragmentShader from '../shader/blurFs.glsl'

class Blur {
  private blur1Pass: ShaderPass
  private blur2Pass: ShaderPass

  constructor() {
    this.blur1Pass = this.createPass('h')
    this.blur2Pass = this.createPass('v')
  }

  private createPass(dir: 'h' | 'v') {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        uKernel: { value: 13 },
        uSigma: { value: 5 },
        uDirection: { value: dir === 'h' ? new THREE.Vector2(1, 0) : new THREE.Vector2(0, 1) },
        uStrength: { value: 2.5 },
        uDirectionalResolution: { value: dir === 'h' ? gl.size.width : gl.size.height },
      },
      vertexShader,
      fragmentShader,
    }
    return new ShaderPass(shader)
  }

  addPass(composer: EffectComposer) {
    composer.addPass(this.blur1Pass)
    composer.addPass(this.blur2Pass)
  }

  resize() {
    this.blur1Pass.uniforms.uDirectionalResolution.value = gl.size.width
    this.blur2Pass.uniforms.uDirectionalResolution.value = gl.size.height
  }
}

export const blur = new Blur()
