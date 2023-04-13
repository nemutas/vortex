uniform sampler2D tDiffuse;
uniform int uKernel; // sampling range
uniform float uSigma; // √(dispersion)
uniform vec2 uDirection;
uniform float uStrength;
uniform float uDirectionalResolution;
varying vec2 vUv;

// https://ja.wikipedia.org/wiki/%E6%AD%A3%E8%A6%8F%E5%88%86%E5%B8%83
// https://github.com/mrdoob/three.js/blob/8988a1c5a31456bc516f6f77296eeb90295d97e2/examples/jsm/postprocessing/UnrealBloomPass.js#L328-L330
float gaussianPdf(in float x, in float sigma) {
  // (1 / (√2*PI * sigma)) * e^{-(x - μ)^2 / (2*σ^2)}
  return (0.39894 / sigma) * exp(-0.5 * x * x / (sigma * sigma));
}

float parabola(float x, float k) {
  return pow(4. * x * (1. - x), k);
}

void main() {
  float weightSum = gaussianPdf(0.0, uSigma);
  vec4 t = texture2D(tDiffuse, vUv);
  vec3 diffuseSum = t.rgb * weightSum;
  float invSize = 1.0 / uDirectionalResolution;

  // float focus = 1.0 - parabola(vUv.y, 8.0);
  float focus = distance(vec2(0.5), vUv);
  focus = smoothstep(0.0, 0.7, focus);

  for (int i = 1; i < uKernel; i++) {
    float x = float(i);
    float w = gaussianPdf(x, uSigma);

    vec2 offset = uDirection * invSize * x * uStrength * focus;
    vec4 sample1 = texture2D(tDiffuse, vUv + offset);
    vec4 sample2 = texture2D(tDiffuse, vUv - offset);
    diffuseSum += (sample1.rgb + sample2.rgb) * w;
    weightSum += 2.0 * w;
  }

  gl_FragColor = vec4(diffuseSum / weightSum, 1.0);
}