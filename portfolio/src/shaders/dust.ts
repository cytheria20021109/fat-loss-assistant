/**
 * 光尘着色器 — 逆光中的柔焦光斑 (bokeh)。
 * 每粒有自己的粉彩色与相位：缓慢沉浮、轻微闪烁，
 * 中心微亮、边缘极软，像镜头前失焦的浮尘。
 */

export const dustVertex = /* glsl */ `
  attribute float aPhase;
  attribute float aScale;
  attribute vec3 aColor;
  uniform float uTime;
  varying float vFade;
  varying float vTwinkle;
  varying vec3 vColor;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.1 + aPhase * 6.2831) * 0.55;
    p.x += cos(uTime * 0.08 + aPhase * 6.2831) * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (170.0 / max(-mv.z, 0.1));

    // 远处淡出 + 轻微呼吸闪烁
    vFade = clamp(1.0 - (-mv.z - 6.0) / 40.0, 0.0, 1.0);
    vTwinkle = 0.6 + 0.4 * sin(uTime * 0.5 + aPhase * 12.566);
    vColor = aColor;
  }
`;

export const dustFragment = /* glsl */ `
  precision highp float;
  varying float vFade;
  varying float vTwinkle;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    // 极软的圆盘 + 微亮的芯
    float disc = smoothstep(0.5, 0.12, d);
    float core = smoothstep(0.18, 0.0, d) * 0.35;
    float alpha = (disc * 0.16 + core) * vFade * vTwinkle;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;
