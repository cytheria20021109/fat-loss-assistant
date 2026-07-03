/**
 * 大气背景着色器 — 「porcelaine」浅色版。
 *
 * 五层叠加：
 *   1. 瓷白垂直渐变（顶部象牙微亮 → 底部略沉的暖灰）
 *   2. 缓慢漂移的 fbm 云雾（浅色调里的空气感）
 *   3. 三团粉彩柔光（玫瑰粉 / 雾蓝 / 褪金）各自缓慢游移 —— “缤纷”所在
 *   4. uAccent 章节光：随穿行渐变为当前版块的颜色，从画面上方晕染下来
 *   5. 极浅的暗角 + 动态胶片颗粒
 */

export const atmosphereVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const atmosphereFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uResolution;
  uniform vec3  uHaut;    // 象牙（顶部）
  uniform vec3  uBas;     // 瓷白偏暖灰（底部）
  uniform vec3  uRose;    // 粉彩·玫瑰
  uniform vec3  uBleu;    // 粉彩·雾蓝
  uniform vec3  uDore;    // 粉彩·褪金
  uniform vec3  uAccent;  // 当前章节的粉彩色（由 JS 端插值）
  uniform vec3  uOmbre;   // 暗角用的冷灰

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.0, -9.0);
      a *= 0.5;
    }
    return v;
  }

  // 柔光团：中心亮、边缘极缓地消散
  float glow(vec2 st, vec2 center, float radius) {
    float d = distance(st, center);
    return pow(max(1.0 - d / radius, 0.0), 2.4);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 st = vec2(uv.x * aspect, uv.y);
    float t = uTime;

    // 1 · 瓷白垂直渐变
    vec3 col = mix(uBas, uHaut, smoothstep(0.0, 1.1, uv.y));

    // 2 · 云雾 —— 以「压深」而非提亮的方式呈现，浅底上更像水彩纸纹
    float mist = fbm(st * 2.0 + vec2(t * 0.014, -t * 0.007));
    col = mix(col, uBas * 0.97, mist * 0.18);

    // 3 · 三团粉彩柔光，各自缓慢游移（缤纷但低饱和）
    vec2 pRose = vec2(0.22 * aspect + 0.06 * sin(t * 0.05),        0.72 + 0.05 * cos(t * 0.043));
    vec2 pBleu = vec2(0.80 * aspect + 0.07 * cos(t * 0.037),       0.46 + 0.06 * sin(t * 0.049));
    vec2 pDore = vec2(0.50 * aspect + 0.08 * sin(t * 0.031 + 2.0), 0.16 + 0.05 * cos(t * 0.041));

    col = mix(col, uRose, glow(st, pRose, 0.85) * 0.5);
    col = mix(col, uBleu, glow(st, pBleu, 0.9)  * 0.45);
    col = mix(col, uDore, glow(st, pDore, 0.8)  * 0.4);

    // 4 · 章节光 —— 随穿行换色，从上方晕染，是空间层次的“天色”
    vec2 pAccent = vec2(0.5 * aspect, 1.05 - uScroll * 0.18);
    col = mix(col, uAccent, glow(st, pAccent, 1.15) * 0.55);

    // 5a · 极浅暗角
    vec2 c = uv - 0.5;
    col = mix(col, uOmbre, dot(c, c) * 0.35);

    // 5b · 胶片颗粒
    float grain = hash(uv * uResolution.xy + fract(t) * 61.7) - 0.5;
    col += grain * 0.028;

    gl_FragColor = vec4(col, 1.0);
  }
`;
