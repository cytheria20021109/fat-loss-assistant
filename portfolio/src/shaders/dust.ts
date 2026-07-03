/**
 * 尘埃着色器 — 空间中缓慢沉浮的微粒，
 * 为“语义星云”提供纵深参照物。
 */

export const dustVertex = /* glsl */ `
  attribute float aPhase;
  attribute float aScale;
  uniform float uTime;
  varying float vFade;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.12 + aPhase * 6.2831) * 0.5;
    p.x += cos(uTime * 0.09 + aPhase * 6.2831) * 0.35;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (140.0 / max(-mv.z, 0.1));
    // 远处的尘埃淡出
    vFade = clamp(1.0 - (-mv.z - 6.0) / 40.0, 0.0, 1.0);
  }
`;

export const dustFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  varying float vFade;

  void main() {
    // 圆形柔和粒子
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.05, d) * 0.28 * vFade;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
