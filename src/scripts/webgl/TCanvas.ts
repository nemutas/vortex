import * as THREE from 'three'
import { gl } from './core/WebGL'
import { effect } from './effects/Effect'
import fragmentShader from './shader/fs.glsl'
import vertexShader from './shader/vs.glsl'
import { controls } from './utils/OrbitControls'
import { gui } from './utils/gui'

export class TCanvas {
  private pointMaterial!: THREE.ShaderMaterial

  constructor(private container: HTMLElement) {
    this.init()
    this.createObjects()
    gl.requestAnimationFrame(this.anime)
  }

  private init() {
    gl.setup(this.container)
    gl.scene.background = new THREE.Color('#000')
    gl.camera.position.set(0.169, 0.305, 0.53)
    gl.camera.lookAt(gl.scene.position)

    gl.setResizeCallback(() => {
      effect.resize()
    })
    // gl.scene.add(new THREE.AxesHelper(0.5))
  }

  private createObjects() {
    const edgeAmount = 100

    const positions: number[] = []
    for (let ix = 0; ix < edgeAmount; ix++) {
      for (let iz = 0; iz < edgeAmount; iz++) {
        positions.push(ix / edgeAmount, 0, iz / edgeAmount)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.center()
    this.pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVortex: { value: 2 },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    })
    const points = new THREE.Points(geometry, this.pointMaterial)
    gl.scene.add(points)

    //
    gui.add(this.pointMaterial.uniforms.uVortex, 'value', 0, 5, 1).name('vortex')
  }

  // ----------------------------------
  // animation
  private anime = () => {
    this.pointMaterial.uniforms.uTime.value += gl.time.delta

    // console.log(gl.camera.position)

    controls.update()
    // gl.render()
    effect.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
