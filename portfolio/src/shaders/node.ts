/**
 * 语义节点着色器 — 浅色空间中的“玻璃记忆”。
 *
 * 核心近乎透明的暖白雾芯，轮廓处是版块彩度的菲涅尔光；
 * uActivation（0→1）由悬停/聚焦驱动：加深、提亮、呼吸加快。
 * uFade（0→1）实现空间层次：非当前版块的节点退成淡影。
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

  uniform vec3  uColorCore; // 暖白雾芯
  uniform vec3  uColorRim;  // 版块彩度轮廓
  uniform float uActivation; // 0 静默 · 1 被凝视
  uniform float uFade;       // 0 淡影 · 1 当前版块
  uniform float uTime;
  uniform float uSeed;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 2.0);

    // 呼吸 —— 每个节点相位不同
    float pulse = 0.5 + 0.5 * sin(uTime * 1.3 + uSeed * 6.2831);

    // 浅底上：激活时轮廓色加深而非发白
    vec3 rim = uColorRim * mix(1.0, 0.82, uActivation);
    vec3 col = mix(uColorCore, rim, fresnel * (0.75 + 0.25 * uActivation));

    float alpha = (0.24 + 0.85 * fresnel)
                * (0.72 + 0.28 * uActivation)
                * (0.9 + 0.1 * pulse);
    // 层次：淡影节点几乎融进雾里
    alpha *= mix(0.22, 1.0, uFade);

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;
