uniform int uVortex;
uniform float uTime;
varying float vHeight;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main() {
  vec3 pos = position;
  float len = length(pos.xz);
  float angle = atan(pos.z, pos.x);
  float center = smoothstep(0.0, 0.1, len) * (1.0 - 0.3) + 0.3;
  pos.y = sin(angle * float(uVortex) + len * 50.0 - uTime * 3.0) * 0.015 * center;
  
  vHeight = pos.y;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_PointSize = (1.0 / -mvPosition.z) * 2.0;
  gl_Position = projectionMatrix * mvPosition;
}