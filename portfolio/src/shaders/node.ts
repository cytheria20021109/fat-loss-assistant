/**
 * 语义节点着色器 — 悬浮的“记忆球体”。
 *
 * 菲涅尔边缘发光：正对相机的中心近乎透明的雾芯，
 * 轮廓处泛起冷light的光晕；uActivation（0→1）由悬停/聚焦驱动，
 * 提亮并加入呼吸脉动。
 */

export const nodeVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const nodeFragment = /* glsl */ `
  precision highp float;

  uniform vec3  uColorCore; // 雾芯色
  uniform vec3  uColorRim;  // 轮廓光色
  uniform float uActivation; // 0 静默 · 1 被凝视
  uniform float uTime;
  uniform float uSeed;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 2.2);

    // 呼吸 —— 每个节点相位不同，星云才像活的
    float pulse = 0.5 + 0.5 * sin(uTime * 1.3 + uSeed * 6.2831);
    float energy = mix(0.95, 1.55, uActivation) * (0.92 + 0.08 * pulse);

    vec3 col = mix(uColorCore, uColorRim, fresnel) * energy;
    // 中心留一点微光，避免球体沦为纯剪影
    col += uColorCore * pow(1.0 - fresnel, 3.0) * 0.3;

    float alpha = clamp((0.34 + 0.8 * fresnel) * (0.78 + 0.22 * uActivation), 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;
