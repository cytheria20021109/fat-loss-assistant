/**
 * 大气背景着色器 — 「法式清冷」的核心视觉。
 *
 * 全屏四边形（clip-space quad），由四层叠加构成：
 *   1. 垂直冷灰渐变（墨蓝黑 → 雾灰）
 *   2. 缓慢漂移的 fbm 云雾
 *   3. 两团柔光：上方骨白色的“天光”、下方一抹枯木粉的余晖
 *   4. 动态胶片颗粒 + 暗角
 *
 * uScroll 会让光源随相机深入而缓缓下沉，形成“越走越深”的空间暗示。
 */

export const atmosphereVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // 直接输出裁剪空间坐标，永远铺满屏幕、贴在远平面
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const atmosphereFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uResolution;
  uniform vec3  uDeep;   // 墨蓝黑
  uniform vec3  uHaze;   // 雾灰
  uniform vec3  uGlow;   // 骨白天光
  uniform vec3  uRose;   // 枯木粉余晖

  varying vec2 vUv;

  // ---- utilitaires : hash / value-noise / fbm -------------------------
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

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 st = vec2(uv.x * aspect, uv.y);

    // 1 · 垂直冷灰渐变 —— 底部深、顶部微亮
    vec3 col = mix(uDeep, uHaze, smoothstep(0.05, 1.15, uv.y) * 0.5);

    // 2 · 漂移云雾（极慢，几乎察觉不到，只留下“空气在动”的错觉）
    float mist = fbm(st * 1.8 + vec2(uTime * 0.012, -uTime * 0.006));
    mist += 0.5 * fbm(st * 4.2 - vec2(uTime * 0.02, 0.0));
    col = mix(col, uHaze, mist * 0.14);

    // 3a · 天光 —— 随滚动缓缓下沉
    vec2 sun = vec2(0.5 * aspect + 0.05 * sin(uTime * 0.05), 0.78 - uScroll * 0.30);
    float dSun = distance(st, sun);
    col += uGlow * pow(max(1.0 - dSun * 0.85, 0.0), 3.0) * 0.42;

    // 3b · 枯木粉余晖 —— 左下角一抹极淡的暖意
    vec2 ember = vec2(0.16 * aspect, 0.12 + uScroll * 0.10);
    float dEmber = distance(st, ember);
    col += uRose * pow(max(1.0 - dEmber * 1.1, 0.0), 3.0) * 0.20;

    // 4a · 暗角 —— 让视线自然聚向中心
    vec2 c = uv - 0.5;
    col *= 1.0 - dot(c, c) * 0.55;

    // 4b · 胶片颗粒 —— 每帧跳动的粗糙质感
    float grain = hash(uv * uResolution.xy + fract(uTime) * 61.7) - 0.5;
    col += grain * 0.045;

    gl_FragColor = vec4(col, 1.0);
  }
`;
