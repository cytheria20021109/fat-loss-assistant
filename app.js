const TRIP_DATE = new Date("2026-05-29T00:00:00");
const STORE_KEYS = {
  ingredients: "fatLoss.ingredients.v1",
  records: "fatLoss.records.v1",
  training: "fatLoss.training.v1",
  meals: "fatLoss.meals.v1"
};

function makeId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const muscleLabels = {
  glutesLegs: "臀腿",
  back: "背",
  chestShoulder: "胸肩",
  core: "核心",
  fullBody: "全身轻量"
};

const exerciseLibrary = {
  glutesLegs: [
    "深蹲 2 组 x 8-12 次",
    "臀桥 2 组 x 12 次",
    "保加利亚分腿蹲 2 组 x 8 次/侧",
    "侧卧蚌式开合 2 组 x 12 次/侧",
    "台阶踏步 2 组 x 10 次/侧"
  ],
  back: [
    "水瓶俯身划船 2 组 x 10-12 次",
    "弹力带下拉 2 组 x 10-12 次",
    "反向飞鸟 2 组 x 10 次",
    "超人式 2 组 x 20-30 秒",
    "靠墙 Y-T-W 2 组 x 8 次"
  ],
  chestShoulder: [
    "跪姿俯卧撑 2 组 x 6-10 次",
    "水瓶肩推 2 组 x 10 次",
    "侧平举 2 组 x 10-12 次",
    "墙壁俯卧撑 2 组 x 12 次",
    "平板肩触碰 2 组 x 20 秒"
  ],
  core: [
    "平板支撑 2 组 x 20-40 秒",
    "死虫 2 组 x 8 次/侧",
    "鸟狗 2 组 x 8 次/侧",
    "卷腹 2 组 x 10-12 次",
    "侧支撑 2 组 x 20 秒/侧"
  ],
  fullBody: [
    "深蹲到提踵 2 组 x 10 次",
    "跪姿俯卧撑 2 组 x 6-10 次",
    "水瓶划船 2 组 x 10 次",
    "臀桥 2 组 x 12 次",
    "平板支撑 2 组 x 20 秒"
  ]
};

const flavorProfiles = {
  spicy: "辣味：辣椒、醋、蒜末，少盐不重油",
  fresh: "清爽：柠檬汁、黑胡椒、少量酱油或醋",
  japanese: "日式：酱油、芥末、海苔碎，口味轻一点",
  chinese: "中式清炒：葱姜蒜、少量生抽，热锅快炒或焯后拌，油控制在一小勺内",
  pepper: "黑椒：黑胡椒、少量蚝油或酱油，适合牛肉口蘑",
  garlic: "蒜香：蒜末、黑胡椒、少量橄榄油或喷油"
};

const seasoningPresets = {
  none: { label: "不额外计算", kcal: 0, protein: 0 },
  light: { label: "清蒸/凉拌调味", kcal: 20, protein: 0 },
  daily: { label: "日常调味", kcal: 60, protein: 0 },
  stirFry: { label: "清炒/煎用油", kcal: 100, protein: 0 },
  sauce: { label: "酱汁偏多", kcal: 150, protein: 0 }
};

const defaultIngredients = [
  { id: makeId(), name: "虾仁", category: "protein", amount: 80, unit: "100g", kcal: 100, protein: 20, priority: false, rawSafe: false, frozen: true, done: false, avoid: false, note: "按可食重量估算，稳定蛋白" },
  { id: makeId(), name: "牛肉块", category: "protein", amount: 7, unit: "100g", kcal: 220, protein: 24, priority: false, rawSafe: false, frozen: true, done: false, avoid: false, note: "按熟/半成品瘦牛肉估算" },
  { id: makeId(), name: "冷冻三文鱼", category: "protein", amount: 12, unit: "100g", kcal: 210, protein: 22, priority: true, rawSafe: false, frozen: true, done: false, avoid: false, note: "按可食重量估算" },
  { id: makeId(), name: "玉米粒", category: "carb", amount: 1, unit: "100g", kcal: 110, protein: 3.5, priority: false, rawSafe: false, frozen: true, done: false, avoid: false, note: "午餐碳水" },
  { id: makeId(), name: "包菜", category: "vegetable", amount: 1, unit: "100g", kcal: 25, protein: 1.3, priority: false, rawSafe: false, frozen: false, done: false, avoid: false, note: "晚餐增量" },
  { id: makeId(), name: "口蘑片", category: "vegetable", amount: 1, unit: "100g", kcal: 24, protein: 3.1, priority: true, rawSafe: false, frozen: false, done: false, avoid: false, note: "优先吃掉" },
  { id: makeId(), name: "米饭", category: "carb", amount: 1, unit: "100g熟米饭", kcal: 130, protein: 2.5, priority: false, rawSafe: false, frozen: false, done: false, avoid: false, note: "熟重，不是生米" },
  { id: makeId(), name: "罗马生菜", category: "vegetable", amount: 1, unit: "100g", kcal: 17, protein: 1.2, priority: true, rawSafe: true, frozen: false, done: false, avoid: false, note: "生食前洗净" },
  { id: makeId(), name: "巧克力蛋白粉", category: "drink", amount: 1, unit: "1勺", kcal: 120, protein: 24, priority: false, rawSafe: true, frozen: false, done: false, avoid: false, note: "甜味锚点" },
  { id: makeId(), name: "咖啡", category: "drink", amount: 1, unit: "1小杯拿铁", kcal: 60, protein: 3, priority: false, rawSafe: true, frozen: false, done: false, avoid: false, note: "下午 2 点前" }
];

const pantryIngredients = [
  { name: "鸡蛋", category: "protein", amount: 6, unit: "1个", kcal: 70, protein: 6, note: "万能低决策蛋白" },
  { name: "嫩豆腐", category: "protein", amount: 1, unit: "100g", kcal: 60, protein: 5, note: "适合汤/拌/清炒" },
  { name: "希腊酸奶", category: "protein", amount: 1, unit: "100g", kcal: 60, protein: 10, note: "可当甜口底" },
  { name: "鸡胸肉", category: "protein", amount: 1, unit: "100g", kcal: 165, protein: 31, note: "备用蛋白" },
  { name: "土豆", category: "carb", amount: 1, unit: "100g", kcal: 77, protein: 2, note: "比米饭更有饱腹感" },
  { name: "红薯", category: "carb", amount: 1, unit: "100g", kcal: 86, protein: 1.6, note: "甜口碳水" },
  { name: "燕麦", category: "carb", amount: 1, unit: "30g", kcal: 115, protein: 4, note: "早餐/甜品底" },
  { name: "苹果", category: "fruit", amount: 2, unit: "1个中等", kcal: 95, protein: 0.5, rawSafe: true, note: "想甜时优先" },
  { name: "香蕉", category: "fruit", amount: 2, unit: "1根中等", kcal: 105, protein: 1.3, rawSafe: true, note: "运动前后" },
  { name: "蓝莓", category: "fruit", amount: 1, unit: "100g", kcal: 57, protein: 0.7, rawSafe: true, note: "配酸奶/蛋白粉" },
  { name: "草莓", category: "fruit", amount: 1, unit: "100g", kcal: 32, protein: 0.7, rawSafe: true, note: "低热量甜口" },
  { name: "牛油果", category: "fat", amount: 1, unit: "50g", kcal: 80, protein: 1, rawSafe: true, note: "脂肪高，少量用" },
  { name: "杏仁", category: "fat", amount: 1, unit: "10g", kcal: 58, protein: 2.1, rawSafe: true, note: "容易超量，按克数" },
  { name: "养乐多", category: "drink", amount: 5, unit: "1小瓶", kcal: 50, protein: 0.8, rawSafe: true, note: "小甜饮，想喝甜的可以计入" },
  { name: "橄榄油", category: "seasoning", amount: 1, unit: "1小勺", kcal: 45, protein: 0, note: "清炒默认油量" },
  { name: "生抽", category: "seasoning", amount: 1, unit: "1小勺", kcal: 5, protein: 0, note: "注意钠" }
].map((item) => ({
  id: makeId(),
  priority: false,
  rawSafe: false,
  frozen: false,
  done: false,
  avoid: false,
  ...item
}));

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let ingredients = loadArray(STORE_KEYS.ingredients, defaultIngredients);
let records = loadArray(STORE_KEYS.records, []);
let training = loadArray(STORE_KEYS.training, []);
let meals = loadArray(STORE_KEYS.meals, []);
let selectedFlavor = "fresh";
let currentPlan = null;
let comboItems = [];
const swapOffsets = {};

ingredients = mergeDefaultIngredients(normalizeIngredientUnits(ingredients), pantryIngredients);
save(STORE_KEYS.ingredients, ingredients);

function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The app still works without persistence, for example when file:// storage is restricted.
  }
}

function loadArray(key, fallback) {
  const value = load(key, fallback);
  return Array.isArray(value) ? value : fallback;
}

function preferredUnitFor(item) {
  const name = item?.name || "";
  if (name.includes("蛋白粉")) return "1勺";
  if (name.includes("养乐多")) return "1小瓶";
  if (name.includes("咖啡")) return "1小杯拿铁";
  if (name.includes("米饭")) return "100g熟米饭";
  if (name.includes("苹果")) return "1个中等";
  if (name.includes("香蕉")) return "1根中等";
  if (name.includes("杏仁")) return "10g";
  if (name.includes("橄榄油") || name.includes("生抽")) return "1小勺";
  if (name.includes("虾") || name.includes("牛肉") || name.includes("三文鱼") || name.includes("玉米") || name.includes("包菜") || name.includes("口蘑") || name.includes("生菜")) return "100g";
  return item?.category === "drink" ? "1杯" : "100g";
}

function normalizeIngredientUnits(items) {
  if (!Array.isArray(items)) return defaultIngredients;
  return items.filter(Boolean).map((item) => {
    const vagueUnits = ["份", "袋", "罐", "锅/盒"];
    const normalized = { ...item, id: item.id || makeId(), category: item.category || "protein", amount: Number(item.amount) || 1 };
    if (!item.unit || vagueUnits.includes(item.unit)) {
      return { ...normalized, unit: preferredUnitFor(item) };
    }
    return normalized;
  });
}

function mergeDefaultIngredients(current, additions) {
  const names = new Set(current.map((item) => item.name));
  const missing = additions.filter((item) => !names.has(item.name));
  return [...current, ...missing];
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function startOfWeek(dateString = todayString()) {
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function daysUntilTrip(dateString = todayString()) {
  const current = new Date(`${dateString}T00:00:00`);
  return Math.max(0, Math.ceil((TRIP_DATE - current) / 86400000));
}

function getState() {
  return {
    date: $("#date").value || todayString(),
    weight: Number($("#weight").value) || 57.5,
    sleepHours: Number($("#sleepHours").value) || 0,
    bedTime: $("#bedTime").value || "02:00",
    hunger: Number($("#hunger").value),
    stress: Number($("#stress").value),
    energy: Number($("#energy").value),
    exerciseMinutes: Number($("#exerciseMinutes").value),
    flavor: selectedFlavor,
    wantCarb: $("#wantCarb").checked,
    wantSweet: $("#wantSweet").checked,
    wantCoffee: $("#wantCoffee").checked,
    outsideMeal: $("#outsideMeal").checked,
    periodOrUnwell: $("#periodOrUnwell").checked,
    swimBuddy: $("#swimBuddy").checked,
    foodMood: $("#foodMood").value.trim(),
    notes: $("#notes").value.trim()
  };
}

function availableIngredients(category) {
  return ingredients
    .filter((item) => item.category === category && !item.done && !item.avoid && Number(item.amount) > 0)
    .sort((a, b) => Number(b.priority) - Number(a.priority) || a.name.localeCompare(b.name, "zh-Hans-CN"));
}

function pickIngredient(category, state, avoidNames = []) {
  const mood = `${state.foodMood} ${state.notes}`;
  const available = availableIngredients(category).filter((item) => {
    const plainName = item.name.replace("冷冻", "");
    const textAvoided = mood.includes(`不想吃${item.name}`) || mood.includes(`不想吃${plainName}`) || mood.includes(`不想${item.name}`) || mood.includes(`不想${plainName}`);
    return !avoidNames.includes(item.name) && !textAvoided;
  });
  if (!available.length) return null;
  const wanted = available.find((item) => mood.includes(item.name) || mood.includes(item.name.replace("冷冻", "")));
  if (wanted) return wanted;
  return available[0];
}

function salmonCanBeRaw(state) {
  const salmon = ingredients.find((item) => item.name.includes("三文鱼") && !item.done && !item.avoid);
  return Boolean(salmon && salmon.rawSafe && daysUntilTrip(state.date) > 2);
}

function analyzeMode(state) {
  const lateBed = state.bedTime >= "02:00" || state.bedTime <= "05:00";
  const recoveryRisk = state.sleepHours < 6 || state.hunger >= 8 || state.stress >= 8 || state.energy <= 3 || state.periodOrUnwell;
  const lowBloat = daysUntilTrip(state.date) <= 2;
  if (lowBloat) return "旅行前低水肿日";
  if (recoveryRisk) return "恢复防崩日";
  if (state.sleepHours >= 7 && state.energy >= 6 && state.hunger <= 6 && !lateBed) return "积极掉秤日";
  return "稳定控食日";
}

function calorieTarget(mode, state) {
  if (mode === "恢复防崩日") return "1200-1350 kcal";
  if (mode === "旅行前低水肿日") return "1100-1250 kcal";
  if (state.wantCarb && state.hunger >= 6) return "1100-1250 kcal";
  return "1050-1200 kcal";
}

function nutritionFallback(item) {
  const name = item?.name || "";
  if (name.includes("虾")) return { kcal: 120, protein: 24 };
  if (name.includes("牛肉")) return { kcal: 220, protein: 24 };
  if (name.includes("三文鱼")) return { kcal: 210, protein: 22 };
  if (name.includes("米饭")) return { kcal: 130, protein: 2.5 };
  if (name.includes("玉米")) return { kcal: 95, protein: 3 };
  if (name.includes("蛋白粉")) return { kcal: 120, protein: 24 };
  if (name.includes("咖啡")) return { kcal: 60, protein: 3 };
  if (name.includes("苹果")) return { kcal: 95, protein: 0.5 };
  if (name.includes("香蕉")) return { kcal: 105, protein: 1.3 };
  if (name.includes("蓝莓")) return { kcal: 57, protein: 0.7 };
  if (name.includes("草莓")) return { kcal: 32, protein: 0.7 };
  if (item?.category === "protein") return { kcal: 180, protein: 22 };
  if (item?.category === "carb") return { kcal: 120, protein: 3 };
  if (item?.category === "fruit") return { kcal: 70, protein: 1 };
  if (item?.category === "fat") return { kcal: 80, protein: 1 };
  if (item?.category === "drink") return { kcal: 90, protein: 8 };
  if (item?.category === "vegetable") return { kcal: 35, protein: 2 };
  return { kcal: 0, protein: 0 };
}

function nutritionOf(item, portion = 1) {
  if (!item) return { kcal: 0, protein: 0 };
  const fallback = nutritionFallback(item);
  const kcal = Number.isFinite(Number(item.kcal)) && Number(item.kcal) > 0 ? Number(item.kcal) : fallback.kcal;
  const protein = Number.isFinite(Number(item.protein)) && Number(item.protein) > 0 ? Number(item.protein) : fallback.protein;
  return {
    kcal: Math.round(kcal * portion),
    protein: Math.round(protein * portion * 10) / 10
  };
}

function sumNutrition(parts) {
  return parts.reduce((total, part) => ({
    kcal: total.kcal + part.kcal,
    protein: Math.round((total.protein + part.protein) * 10) / 10
  }), { kcal: 0, protein: 0 });
}

function formatNutrition(nutrition) {
  return `约 ${nutrition.kcal} kcal / 蛋白 ${nutrition.protein}g`;
}

function unitOf(item) {
  return item?.unit?.trim() || "100g";
}

function formatAmount(multiplier, item) {
  const rounded = Math.round(multiplier * 100) / 100;
  return `${rounded} × ${unitOf(item)}`;
}

function comboEligibleIngredients() {
  return ingredients
    .filter((item) => !item.done && !item.avoid && Number(item.amount) > 0)
    .sort((a, b) => {
      const categoryOrder = { protein: 1, vegetable: 2, carb: 3, fruit: 4, fat: 5, drink: 6, seasoning: 7 };
      return (categoryOrder[a.category] || 9) - (categoryOrder[b.category] || 9) || a.name.localeCompare(b.name, "zh-Hans-CN");
    });
}

function renderComboOptions() {
  const select = $("#comboIngredient");
  if (!select) return;
  const current = select.value;
  const options = comboEligibleIngredients();
  select.innerHTML = options.map((item) => {
    const nutrition = nutritionOf(item, 1);
    return `<option value="${item.id}">${item.name}｜${categoryLabel(item.category)}｜${nutrition.kcal} kcal/${unitOf(item)}</option>`;
  }).join("");
  if (options.some((item) => item.id === current)) select.value = current;
}

function comboNutrition() {
  const foodNutrition = comboItems.map((entry) => {
    const item = ingredients.find((ingredient) => ingredient.id === entry.id);
    return nutritionOf(item, entry.portion);
  });
  return sumNutrition([...foodNutrition, seasoningNutrition()]);
}

function seasoningNutrition() {
  const key = $("#seasoningPreset")?.value || "daily";
  const preset = seasoningPresets[key] || seasoningPresets.daily;
  return { kcal: preset.kcal, protein: preset.protein };
}

function currentSeasoningPreset() {
  const key = $("#seasoningPreset")?.value || "daily";
  return seasoningPresets[key] || seasoningPresets.daily;
}

function renderCombo() {
  renderComboOptions();
  const title = ($("#comboName")?.value || "这一餐").trim() || "这一餐";
  const total = comboNutrition();
  $("#comboTitle").textContent = title;
  $("#comboKcal").textContent = `${total.kcal} kcal`;
  const seasoning = currentSeasoningPreset();
  $("#comboProtein").textContent = `蛋白 ${total.protein}g｜含${seasoning.label} ${seasoning.kcal} kcal`;

  const list = $("#comboList");
  if (!list) return;
  if (!comboItems.length) {
    list.innerHTML = `<div class="empty-state">还没有加入食材。调味已按“${seasoning.label} ${seasoning.kcal} kcal”预留；先选蛋白质，再加蔬菜和一点碳水，会比较不容易卡住。</div>`;
    return;
  }
  const rows = comboItems.map((entry) => {
    const item = ingredients.find((ingredient) => ingredient.id === entry.id);
    if (!item) return "";
    const nutrition = nutritionOf(item, entry.portion);
    return `
      <article class="combo-row">
        <div class="combo-row-main">
          <strong>${item.name}</strong>
          <span>${categoryLabel(item.category)}｜${formatNutrition(nutrition)}｜每 ${unitOf(item)} ${nutritionOf(item, 1).kcal} kcal / 蛋白 ${nutritionOf(item, 1).protein}g</span>
        </div>
        <div class="combo-row-actions">
          <button class="mini" data-combo-minus="${entry.id}" type="button">-</button>
          <span class="portion-pill">${formatAmount(entry.portion, item)}</span>
          <button class="mini" data-combo-plus="${entry.id}" type="button">+</button>
          <button class="danger" data-combo-remove="${entry.id}" type="button">移除</button>
        </div>
      </article>
    `;
  }).join("");
  const seasoningRow = `
    <article class="combo-row seasoning-row">
      <div class="combo-row-main">
        <strong>自动调味估算</strong>
        <span>${seasoning.label}｜约 ${seasoning.kcal} kcal。用于覆盖油、生抽、酱汁、蒜蓉等，不用逐个添加。</span>
      </div>
      <div class="combo-row-actions">
        <span class="portion-pill">自动计入</span>
      </div>
    </article>
  `;
  list.innerHTML = rows + seasoningRow;
}

function addComboItem() {
  const id = $("#comboIngredient").value;
  const portion = Math.max(0.25, Number($("#comboPortion").value) || 1);
  if (!id) return;
  const existing = comboItems.find((entry) => entry.id === id);
  if (existing) {
    existing.portion = Math.round((existing.portion + portion) * 100) / 100;
  } else {
    comboItems.push({ id, portion });
  }
  renderCombo();
}

function saveComboMeal() {
  if (!comboItems.length) {
    alert("先加入至少一个食材，再保存饮食记录。");
    return;
  }
  const date = $("#date").value || todayString();
  const title = ($("#comboName").value || "这一餐").trim() || "这一餐";
  const nutrition = comboNutrition();
  const seasoning = currentSeasoningPreset();
  const items = comboItems.map((entry) => {
    const item = ingredients.find((ingredient) => ingredient.id === entry.id);
    return {
      id: entry.id,
      name: item?.name || "未知食材",
      unit: unitOf(item),
      portion: entry.portion,
      kcal: nutritionOf(item, entry.portion).kcal,
      protein: nutritionOf(item, entry.portion).protein
    };
  });
  meals.push({
    id: makeId(),
    date,
    title,
    nutrition,
    seasoning,
    items,
    savedAt: new Date().toISOString()
  });
  save(STORE_KEYS.meals, meals);
  renderReview();
  alert(`${title} 已保存为饮食记录。`);
}

function makeMealPlan(state, mode) {
  const proteinA = pickIngredient("protein", state);
  const proteinB = pickIngredient("protein", state, proteinA ? [proteinA.name] : []);
  const vegA = pickIngredient("vegetable", state);
  const vegB = pickIngredient("vegetable", state, vegA ? [vegA.name] : []);
  const carb = state.wantCarb ? pickIngredient("carb", state) : null;
  const flavor = flavorProfiles[state.flavor] || flavorProfiles.fresh;
  const rawSalmon = proteinA?.name.includes("三文鱼") && salmonCanBeRaw(state);

  const lunchCarb = carb ? ` + ${carb.name}小份` : "";
  const dinnerCarb = mode === "恢复防崩日" && carb ? `，如果睡前饿可加半份${carb.name}` : "";
  const lunchProtein = proteinA?.name || "蛋白质食材";
  const dinnerProtein = proteinB?.name || proteinA?.name || "蛋白质食材";
  const lunchVeg = vegA?.name || "蔬菜";
  const dinnerVeg = vegB?.name || vegA?.name || "蔬菜";
  const salmonMethod = rawSalmon ? "切小块做冷碗" : "做熟食版本";
  const carbPortion = state.wantCarb ? (mode === "积极掉秤日" ? 0.65 : 0.8) : 0;
  const lunchNutrition = sumNutrition([
    nutritionOf(proteinA, 1),
    nutritionOf(vegA, 1),
    nutritionOf(carb, carbPortion),
    { kcal: state.flavor === "chinese" ? 45 : 25, protein: 0 }
  ]);
  const dinnerNutrition = sumNutrition([
    nutritionOf(proteinB || proteinA, 1),
    nutritionOf(vegB || vegA, 1.2),
    nutritionOf(mode === "恢复防崩日" ? carb : null, 0.35),
    { kcal: state.flavor === "chinese" ? 45 : 25, protein: 0 }
  ]);

  return {
    lunch: `${lunchProtein}${lunchProtein.includes("三文鱼") ? `（${salmonMethod}）` : ""} + ${lunchVeg}${lunchCarb}。${flavor}。<strong>${formatNutrition(lunchNutrition)}</strong>。午餐保留满足感，避免下午碳水崩。`,
    dinner: `${dinnerProtein}${dinnerProtein.includes("三文鱼") ? "（优先熟食或确认生食安全后冷碗）" : ""} + ${dinnerVeg}，蔬菜量加大${dinnerCarb}。<strong>${formatNutrition(dinnerNutrition)}</strong>。晚餐偏轻，控盐控油。`,
    alternative: `${dinnerProtein}和${lunchProtein}互换，或改成“蛋白粉 + 生菜/包菜热拌 + 少量玉米/米饭”的低决策组合。`,
    crash: "低能量崩溃版：巧克力蛋白饮一杯 + 虾仁/牛肉任一份 + 生菜或包菜一大碗。只完成蛋白质和不暴食即可。",
    nutrition: {
      lunch: lunchNutrition,
      dinner: dinnerNutrition
    }
  };
}

function makeDrinkPlan(state) {
  if (state.wantCoffee && state.wantSweet) {
    return "下午 2 点前喝摩卡蛋白咖啡：咖啡 + 巧克力蛋白粉。今天不再叠加其他甜饮。";
  }
  if (state.wantCoffee) return "小杯拿铁或黑咖啡加奶，安排在下午 2 点前，用来稳食欲。";
  if (state.wantSweet) return "巧克力蛋白粉做冷饮或热饮；晚上版本不加咖啡因。";
  return "饮水稳定即可；如果下午开始想翻零食，优先加一杯蛋白饮。";
}

function drinkNutrition(state) {
  const coffee = ingredients.find((item) => item.name.includes("咖啡"));
  const powder = ingredients.find((item) => item.name.includes("蛋白粉"));
  if (state.wantCoffee && state.wantSweet) return nutritionOf(powder, 1);
  if (state.wantCoffee) return nutritionOf(coffee, 1);
  if (state.wantSweet) return nutritionOf(powder, 1);
  return { kcal: 0, protein: 0 };
}

function weeklyMuscleCounts(dateString = todayString()) {
  const week = startOfWeek(dateString);
  return training
    .filter((item) => item.date >= week)
    .reduce((counts, item) => {
      if (item.status === "done") counts[item.muscle] = (counts[item.muscle] || 0) + 1;
      return counts;
    }, {});
}

function suggestMuscle(state) {
  const counts = weeklyMuscleCounts(state.date);
  if (state.sleepHours < 6 || state.energy <= 3 || state.hunger >= 8 || state.periodOrUnwell) return "fullBody";
  const order = ["glutesLegs", "back", "chestShoulder", "core"];
  const targetCaps = { glutesLegs: 2, back: 1, chestShoulder: 1, core: 3 };
  return order.find((muscle) => (counts[muscle] || 0) < targetCaps[muscle]) || "fullBody";
}

function deterministicExercises(muscle, state, extraOffset = 0) {
  const list = exerciseLibrary[muscle] || exerciseLibrary.fullBody;
  const offset = (new Date(`${state.date}T12:00:00`).getDate() + state.energy + state.hunger + extraOffset) % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)].slice(0, 4);
}

function makeExercisePlan(state, mode) {
  const lowState = mode === "恢复防崩日" || state.exerciseMinutes < 20;
  const muscle = suggestMuscle(state);
  const exercises = deterministicExercises(muscle, state);
  if (lowState) {
    return {
      aerobic: "散步 15-25 分钟 + 拉伸 5 分钟。今天不加压，防止睡眠和食欲崩。",
      muscle,
      strength: ["深呼吸拉伸 5 分钟", "臀桥 1 组 x 12 次", "鸟狗 1 组 x 8 次/侧", "靠墙肩背打开 1 组 x 8 次"],
      intensity: "降级"
    };
  }
  const aerobic = state.swimBuddy
    ? "游泳 20-30 分钟可替代单车；如果临时没有搭子，做单车 20 分钟。"
    : "单车 20 分钟，中等强度微喘 + 饭后散步 15-25 分钟。";
  return {
    aerobic,
    muscle,
    strength: exercises,
    intensity: "正常"
  };
}

function trendAdvice(state) {
  const recent = records.slice(-3);
  if (recent.length < 2) return "记录满 2-3 天后，这里会根据体重、睡眠、饥饿和运动给出趋势建议。";
  const avgSleep = recent.reduce((sum, item) => sum + Number(item.sleepHours || 0), 0) / recent.length;
  const avgHunger = recent.reduce((sum, item) => sum + Number(item.hunger || 0), 0) / recent.length;
  const firstWeight = Number(recent[0].weight);
  const lastWeight = Number(recent[recent.length - 1].weight);
  if (avgSleep < 6) return "最近睡眠偏低：今天优先减少咖啡因、晚餐不要太饿，运动降一点。";
  if (avgHunger >= 7) return "最近饥饿偏高：午餐保留碳水，蛋白质加足，避免连续低热量。";
  if (lastWeight > firstWeight + 0.4) return "体重短期上浮：先看盐分、经期、睡眠和肠道内容物，不急着继续砍热量。";
  if (lastWeight < firstWeight - 0.4) return "体重有明显下降：今天保持节奏，不需要额外惩罚式运动。";
  return "趋势稳定：继续按 1050-1250 kcal 区间和轻运动推进。";
}

function generatePlan() {
  const state = getState();
  const mode = analyzeMode(state);
  const meals = makeMealPlan(state, mode);
  const exercise = makeExercisePlan(state, mode);
  const target = calorieTarget(mode, state);
  const proteinTarget = mode === "恢复防崩日" ? "80-95g" : "75-90g";
  const drink = makeDrinkPlan(state);
  const estimatedNutrition = sumNutrition([meals.nutrition.lunch, meals.nutrition.dinner, drinkNutrition(state)]);
  currentPlan = { state, mode, target, proteinTarget, meals, drink, estimatedNutrition, exercise, trend: trendAdvice(state) };
  renderPlan(currentPlan);
  return currentPlan;
}

function renderPlan(plan) {
  const output = $("#planResult");
  output.innerHTML = "";
  const cards = [
    ["今日分析", `<strong>${plan.mode}</strong>｜目标 ${plan.target}｜蛋白质 ${plan.proteinTarget}<br><strong>今日已规划估算：</strong>${formatNutrition(plan.estimatedNutrition)}。按食材库“每单位 kcal / 蛋白质”计算，调准食材数字后计划会同步变准。<br>${plan.trend}<div class="tag-row"><span class="tag">${daysUntilTrip(plan.state.date)} 天到旅行</span><span class="tag">${plan.exercise.intensity}训练</span>${plan.state.periodOrUnwell ? '<span class="tag warn">身体不适优先恢复</span>' : ""}</div>`],
    ["午餐", plan.meals.lunch],
    ["晚餐", plan.meals.dinner],
    ["饮品", plan.drink],
    ["运动", `${plan.exercise.aerobic}<br><strong>力量部位：</strong>${muscleLabels[plan.exercise.muscle]}<br>${plan.exercise.strength.map((item) => `• ${item}`).join("<br>")}<div class="action-row"><button class="primary" data-complete-strength="${plan.exercise.muscle}">标记力量完成</button><button class="secondary" data-skip-strength="${plan.exercise.muscle}">跳过力量</button></div>`],
    ["替代方案", plan.meals.alternative],
    ["崩溃版", plan.meals.crash],
    ["复制给 Codex", `<textarea class="copy-box" readonly>${copySummary(plan)}</textarea>`]
  ];
  cards.forEach(([title, body], index) => output.appendChild(planCard(title, body, index)));
}

function planCard(title, body, index = 0) {
  const template = $("#planCardTemplate").content.cloneNode(true);
  const card = template.querySelector(".plan-card");
  card.classList.add("is-entering");
  card.style.animationDelay = `${Math.min(index * 45, 280)}ms`;
  template.querySelector("h3").textContent = title;
  template.querySelector(".card-body").innerHTML = body;
  return template;
}

function copySummary(plan) {
  const state = plan.state;
  return [
    `日期：${state.date}`,
    `体重：${state.weight}kg，睡眠：${state.sleepHours}h，入睡：${state.bedTime}`,
    `饥饿${state.hunger}/10，压力${state.stress}/10，精神/体力${state.energy}/10`,
    `模式：${plan.mode}，目标热量：${plan.target}，目标蛋白：${plan.proteinTarget}`,
    `今日计划估算：${formatNutrition(plan.estimatedNutrition)}（按食材库每单位热量/蛋白计算）`,
    `口味：${flavorProfiles[state.flavor]}`,
    `午餐：${plan.meals.lunch}`,
    `晚餐：${plan.meals.dinner}`,
    `饮品：${plan.drink}`,
    `运动：${plan.exercise.aerobic}；力量：${muscleLabels[plan.exercise.muscle]}`
  ].join("\n");
}

function saveRecord() {
  const plan = currentPlan || generatePlan();
  const record = {
    ...plan.state,
    mode: plan.mode,
    calorieTarget: plan.target,
    proteinTarget: plan.proteinTarget,
    exerciseMuscle: plan.exercise.muscle,
    savedAt: new Date().toISOString()
  };
  records = records.filter((item) => item.date !== record.date);
  records.push(record);
  records.sort((a, b) => a.date.localeCompare(b.date));
  save(STORE_KEYS.records, records);
  renderReview();
  alert("今日记录已保存。");
}

function renderIngredients() {
  const list = $("#ingredientList");
  list.innerHTML = "";
  ingredients.forEach((item) => {
    const nutrition = nutritionOf(item, 1);
    const card = document.createElement("article");
    card.className = "ingredient-card";
    card.innerHTML = `
      <header>
        <div>
          <h3>${item.name}</h3>
          <p>${categoryLabel(item.category)}｜库存 ${item.amount} ${unitOf(item)}｜每 ${unitOf(item)} ${nutrition.kcal} kcal / 蛋白 ${nutrition.protein}g${item.note ? `｜${item.note}` : ""}</p>
        </div>
        <span class="tag ${item.done || item.avoid ? "warn" : ""}">${item.done ? "已吃完" : item.avoid ? "今天不想吃" : item.priority ? "优先吃" : "可用"}</span>
      </header>
      <div class="tag-row">
        ${item.rawSafe ? '<span class="tag">适合生食</span>' : ""}
        ${item.frozen ? '<span class="tag coffee">冷冻</span>' : ""}
      </div>
      <div class="ingredient-actions">
        <button class="mini" data-edit="${item.id}">编辑</button>
        <button class="mini" data-toggle-priority="${item.id}">${item.priority ? "取消优先" : "优先吃"}</button>
        <button class="mini" data-toggle-avoid="${item.id}">${item.avoid ? "取消不想吃" : "今天不想吃"}</button>
        <button class="mini" data-toggle-done="${item.id}">${item.done ? "恢复可用" : "已吃完"}</button>
        <button class="danger" data-delete="${item.id}">删除</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function categoryLabel(category) {
  return {
    protein: "蛋白质",
    vegetable: "蔬菜",
    carb: "碳水",
    fruit: "水果",
    fat: "脂肪/坚果",
    drink: "饮品",
    seasoning: "调味"
  }[category] || category;
}

function ingredientFromForm() {
  return {
    id: $("#ingredientId").value || makeId(),
    name: $("#ingredientName").value.trim(),
    category: $("#ingredientCategory").value,
    amount: Number($("#ingredientAmount").value) || 0,
    unit: $("#ingredientUnit").value.trim(),
    kcal: Number($("#ingredientKcal").value) || 0,
    protein: Number($("#ingredientProtein").value) || 0,
    priority: $("#ingredientPriority").checked,
    rawSafe: $("#ingredientRawSafe").checked,
    frozen: $("#ingredientFrozen").checked,
    done: $("#ingredientDone").checked,
    avoid: $("#ingredientAvoid").checked,
    note: $("#ingredientNote").value.trim()
  };
}

function fillIngredientForm(item) {
  $("#ingredientId").value = item.id;
  $("#ingredientName").value = item.name;
  $("#ingredientCategory").value = item.category;
  $("#ingredientAmount").value = item.amount;
  $("#ingredientUnit").value = item.unit;
  $("#ingredientKcal").value = nutritionOf(item, 1).kcal;
  $("#ingredientProtein").value = nutritionOf(item, 1).protein;
  $("#ingredientPriority").checked = item.priority;
  $("#ingredientRawSafe").checked = item.rawSafe;
  $("#ingredientFrozen").checked = item.frozen;
  $("#ingredientDone").checked = item.done;
  $("#ingredientAvoid").checked = item.avoid;
  $("#ingredientNote").value = item.note || "";
}

function resetIngredientForm() {
  $("#ingredientForm").reset();
  $("#ingredientId").value = "";
  $("#ingredientAmount").value = 1;
  $("#ingredientUnit").value = "100g";
  $("#ingredientKcal").value = "";
  $("#ingredientProtein").value = "";
}

function renderTraining(dateString = $("#date").value || todayString()) {
  const counts = weeklyMuscleCounts(dateString);
  const suggested = suggestMuscle(getState());
  const week = $("#muscleWeek");
  week.innerHTML = "";
  Object.entries(muscleLabels).forEach(([key, label]) => {
    const box = document.createElement("div");
    box.className = `muscle-box ${counts[key] ? "is-done" : ""} ${key === suggested ? "is-suggested" : ""}`;
    box.innerHTML = `<strong>${label}</strong><span>${counts[key] ? `本周已练 ${counts[key]} 次` : "本周未练"}${key === suggested ? "｜今日建议" : ""}</span>`;
    week.appendChild(box);
  });
}

function renderStrengthPlan() {
  const state = getState();
  const selected = $("#muscleSelect").value;
  const muscle = selected === "auto" ? suggestMuscle(state) : selected;
  const key = `${state.date}:${muscle}`;
  const exercises = deterministicExercises(muscle, state, swapOffsets[key] || 0);
  $("#strengthPlan").innerHTML = `
    <article class="exercise-card">
      <header>
        <div>
          <h3>${muscleLabels[muscle]}</h3>
          <p>每个动作 2 组，8-12 次或 20-40 秒。动作不舒服就跳过。</p>
        </div>
        <span class="tag">${state.sleepHours < 6 || state.energy <= 3 ? "建议轻量" : "正常强度"}</span>
      </header>
      ${exercises.map((item, index) => `<p><strong>${index + 1}.</strong> ${item}</p>`).join("")}
      <div class="exercise-actions">
        <button class="primary" data-complete-strength="${muscle}">完成</button>
        <button class="secondary" data-skip-strength="${muscle}">跳过</button>
        <button class="secondary" id="swapExercises">换动作</button>
      </div>
    </article>
  `;
}

function addTrainingRecord(muscle, status) {
  const date = $("#date").value || todayString();
  training = training.filter((item) => !(item.date === date && item.muscle === muscle));
  training.push({ date, muscle, status, savedAt: new Date().toISOString() });
  save(STORE_KEYS.training, training);
  renderTraining(date);
  renderReview();
}

function renderReview() {
  const summary = $("#reviewSummary");
  const recent = records.slice(-3);
  const recentMeals = meals.slice(-5);
  const weights = records.map((item) => Number(item.weight)).filter(Boolean);
  const latest = records[records.length - 1];
  const weightChange = weights.length >= 2 ? (weights[weights.length - 1] - weights[0]).toFixed(1) : "--";
  summary.innerHTML = `
    <div class="summary-grid">
      <div class="summary-item"><strong>${records.length}</strong><br>已保存天数</div>
      <div class="summary-item"><strong>${latest ? latest.weight + "kg" : "--"}</strong><br>最近体重</div>
      <div class="summary-item"><strong>${weightChange}</strong><br>总变化 kg</div>
    </div>
    <article class="history-card"><strong>趋势建议：</strong>${trendAdvice(getState())}</article>
  `;

  const list = $("#historyList");
  list.innerHTML = "";
  recentMeals.slice().reverse().forEach((meal) => {
    const card = document.createElement("article");
    card.className = "history-card";
    card.innerHTML = `
      <header>
        <div>
          <h3>${meal.title}</h3>
          <p>${meal.date}｜${formatNutrition(meal.nutrition)}${meal.seasoning ? `｜含${meal.seasoning.label} ${meal.seasoning.kcal} kcal` : ""}</p>
        </div>
        <span class="tag coffee">饮食记录</span>
      </header>
      <p>${meal.items.map((item) => `${item.name} ${item.portion} × ${item.unit}`).join("｜")}</p>
    `;
    list.appendChild(card);
  });
  recent.slice().reverse().forEach((item) => {
    const card = document.createElement("article");
    card.className = "history-card";
    card.innerHTML = `
      <header>
        <div>
          <h3>${item.date}</h3>
          <p>${item.mode || "未生成模式"}｜${item.weight}kg｜睡眠 ${item.sleepHours}h｜饥饿 ${item.hunger}/10｜精神/体力 ${item.energy}/10</p>
        </div>
        <span class="tag">${item.calorieTarget || "未保存热量"}</span>
      </header>
      <p>${item.notes || "无备注"}</p>
    `;
    list.appendChild(card);
  });
}

function initEvents() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((item) => item.classList.remove("is-active"));
      $$(".panel").forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");
      $(`#${tab.dataset.tab}Panel`).classList.add("is-active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  ["hunger", "stress", "energy", "exerciseMinutes"].forEach((id) => {
    const input = $(`#${id}`);
    const label = $(`#${id === "exerciseMinutes" ? "minutes" : id}Value`);
    input.addEventListener("input", () => {
      label.textContent = input.value;
      renderTraining();
    });
  });

  $("#flavorGroup").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    selectedFlavor = button.dataset.value;
    $$("#flavorGroup button").forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });

  $("#generatePlan").addEventListener("click", generatePlan);
  $("#saveRecord").addEventListener("click", saveRecord);
  $("#date").addEventListener("change", () => {
    $("#daysLeft").textContent = daysUntilTrip($("#date").value);
    renderTraining();
  });

  $("#ingredientForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const item = ingredientFromForm();
    if (!item.name) return;
    ingredients = ingredients.filter((existing) => existing.id !== item.id);
    ingredients.push(item);
    save(STORE_KEYS.ingredients, ingredients);
    resetIngredientForm();
    renderIngredients();
    renderCombo();
  });

  $("#resetIngredient").addEventListener("click", resetIngredientForm);

  $("#ingredientList").addEventListener("click", (event) => {
    const action = event.target.dataset;
    const id = action.edit || action.togglePriority || action.toggleAvoid || action.toggleDone || action.delete;
    if (!id) return;
    const item = ingredients.find((entry) => entry.id === id);
    if (!item) return;
    if (action.edit) fillIngredientForm(item);
    if (action.togglePriority) item.priority = !item.priority;
    if (action.toggleAvoid) item.avoid = !item.avoid;
    if (action.toggleDone) item.done = !item.done;
    if (action.delete) ingredients = ingredients.filter((entry) => entry.id !== id);
    comboItems = comboItems.filter((entry) => ingredients.some((ingredient) => ingredient.id === entry.id && !ingredient.done && !ingredient.avoid));
    save(STORE_KEYS.ingredients, ingredients);
    renderIngredients();
    renderCombo();
  });

  $("#comboName").addEventListener("input", renderCombo);
  $("#seasoningPreset").addEventListener("change", renderCombo);
  $("#addComboItem").addEventListener("click", addComboItem);
  $("#saveComboMeal").addEventListener("click", saveComboMeal);
  $("#clearCombo").addEventListener("click", () => {
    comboItems = [];
    renderCombo();
  });
  $("#comboList").addEventListener("click", (event) => {
    const plus = event.target.dataset.comboPlus;
    const minus = event.target.dataset.comboMinus;
    const remove = event.target.dataset.comboRemove;
    const id = plus || minus || remove;
    if (!id) return;
    const entry = comboItems.find((item) => item.id === id);
    if (plus && entry) entry.portion = Math.round((entry.portion + 0.25) * 100) / 100;
    if (minus && entry) entry.portion = Math.max(0.25, Math.round((entry.portion - 0.25) * 100) / 100);
    if (remove) comboItems = comboItems.filter((item) => item.id !== id);
    renderCombo();
  });

  $("#generateStrength").addEventListener("click", renderStrengthPlan);
  document.body.addEventListener("click", (event) => {
    const complete = event.target.dataset.completeStrength;
    const skip = event.target.dataset.skipStrength;
    if (complete) addTrainingRecord(complete, "done");
    if (skip) addTrainingRecord(skip, "skipped");
    if (event.target.id === "swapExercises") {
      const state = getState();
      const selected = $("#muscleSelect").value;
      const muscle = selected === "auto" ? suggestMuscle(state) : selected;
      const key = `${state.date}:${muscle}`;
      swapOffsets[key] = (swapOffsets[key] || 0) + 1;
      renderStrengthPlan();
    }
  });
}

function init() {
  $("#date").value = todayString();
  $("#daysLeft").textContent = daysUntilTrip(todayString());
  initEvents();
  renderIngredients();
  renderCombo();
  renderTraining();
  renderReview();
  generatePlan();
}

init();
