varying float vHeight;

void main() {
  if ( length(gl_PointCoord - vec2(0.5)) > 0.5 ) discard;

  float lightness = smoothstep(-0.025, 0.02, vHeight);
  vec3 base = mix(vec3(0, 0.5, 1), vec3(1, 0.5, 1), lightness);
  vec3 color = base * lightness * (1.0 + lightness * base);
  gl_FragColor = vec4(color, 1.0);
}