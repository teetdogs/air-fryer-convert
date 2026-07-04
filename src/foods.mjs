// Every food gets its own generated page (/foods/<slug>/) plus a row in the
// cheat-sheet table. Temps are °F for a standard basket air fryer; times are
// ranges because basket size and food thickness vary.
export default [
  // ── Frozen favorites ────────────────────────────────────────────────
  { slug: "frozen-french-fries", name: "Frozen French Fries", cat: "Frozen Favorites", tempF: 400, lo: 15, hi: 20, note: "Shake the basket every 5 minutes for even crisping. No oil needed.", flip: "shake" },
  { slug: "frozen-tater-tots", name: "Frozen Tater Tots", cat: "Frozen Favorites", tempF: 400, lo: 15, hi: 18, note: "Single layer, shake twice. They should rattle when done.", flip: "shake" },
  { slug: "frozen-chicken-nuggets", name: "Frozen Chicken Nuggets", cat: "Frozen Favorites", tempF: 400, lo: 10, hi: 12, note: "No thawing needed. Flip once halfway through.", flip: "flip", internal: 165 },
  { slug: "frozen-chicken-tenders", name: "Frozen Chicken Tenders", cat: "Frozen Favorites", tempF: 400, lo: 12, hi: 14, note: "Straight from the freezer, single layer.", flip: "flip", internal: 165 },
  { slug: "frozen-mozzarella-sticks", name: "Frozen Mozzarella Sticks", cat: "Frozen Favorites", tempF: 390, lo: 6, hi: 8, note: "Pull them the moment cheese starts peeking out — one extra minute and they burst.", flip: "none" },
  { slug: "frozen-pizza-rolls", name: "Frozen Pizza Rolls", cat: "Frozen Favorites", tempF: 380, lo: 6, hi: 8, note: "Let them rest 2 minutes after cooking — the filling is lava.", flip: "shake" },
  { slug: "frozen-egg-rolls", name: "Frozen Egg Rolls", cat: "Frozen Favorites", tempF: 390, lo: 10, hi: 12, note: "Flip halfway for an even shell.", flip: "flip" },
  { slug: "frozen-fish-sticks", name: "Frozen Fish Sticks", cat: "Frozen Favorites", tempF: 400, lo: 10, hi: 12, note: "Crispier than the oven ever made them. Flip once.", flip: "flip" },
  { slug: "frozen-onion-rings", name: "Frozen Onion Rings", cat: "Frozen Favorites", tempF: 400, lo: 8, hi: 10, note: "Single layer — stacking makes them steam instead of crisp.", flip: "flip" },
  { slug: "frozen-hash-brown-patties", name: "Frozen Hash Brown Patties", cat: "Frozen Favorites", tempF: 380, lo: 10, hi: 12, note: "Flip halfway. No oil needed for the patty style.", flip: "flip" },
  { slug: "frozen-burrito", name: "Frozen Burrito", cat: "Frozen Favorites", tempF: 350, lo: 12, hi: 15, note: "Flip halfway so both sides crisp. Check the center is hot before serving.", flip: "flip" },
  { slug: "frozen-corn-dogs", name: "Frozen Corn Dogs", cat: "Frozen Favorites", tempF: 370, lo: 8, hi: 10, note: "Turn once. The batter browns faster than the oven version.", flip: "flip" },

  // ── Chicken & poultry ───────────────────────────────────────────────
  { slug: "chicken-breast", name: "Chicken Breast", cat: "Chicken & Poultry", tempF: 375, lo: 18, hi: 22, note: "Pat dry, rub with a little oil and seasoning. Thinner cutlets finish closer to 12 minutes.", flip: "flip", internal: 165 },
  { slug: "chicken-thighs", name: "Chicken Thighs (bone-in)", cat: "Chicken & Poultry", tempF: 380, lo: 22, hi: 25, note: "Start skin-side down, flip halfway. Skin comes out shatter-crisp.", flip: "flip", internal: 165 },
  { slug: "chicken-wings", name: "Chicken Wings", cat: "Chicken & Poultry", tempF: 400, lo: 20, hi: 25, note: "Flip every 8 minutes. Toss in sauce after cooking, not before.", flip: "flip", internal: 165 },
  { slug: "chicken-drumsticks", name: "Chicken Drumsticks", cat: "Chicken & Poultry", tempF: 390, lo: 20, hi: 25, note: "Turn twice for even browning.", flip: "flip", internal: 165 },
  { slug: "whole-chicken", name: "Whole Chicken (4 lb)", cat: "Chicken & Poultry", tempF: 360, lo: 55, hi: 65, note: "Breast-side down for the first 30 minutes, then flip. Check the thigh, not the breast.", flip: "flip", internal: 165 },
  { slug: "chicken-tenders", name: "Chicken Tenders (breaded, fresh)", cat: "Chicken & Poultry", tempF: 400, lo: 10, hi: 12, note: "Spray the breading lightly with oil or it stays pale.", flip: "flip", internal: 165 },
  { slug: "turkey-breast", name: "Turkey Breast (3 lb)", cat: "Chicken & Poultry", tempF: 350, lo: 40, hi: 50, note: "Rest 10 minutes before slicing. Temp will carry over a few degrees.", flip: "flip", internal: 165 },

  // ── Beef & pork ─────────────────────────────────────────────────────
  { slug: "burgers", name: "Burgers (½ lb patties)", cat: "Beef & Pork", tempF: 375, lo: 10, hi: 14, note: "Flip halfway. Add cheese for the last minute with the fryer off.", flip: "flip", internal: 160 },
  { slug: "steak", name: "Steak (1-inch)", cat: "Beef & Pork", tempF: 400, lo: 8, hi: 12, note: "8–10 min for medium-rare, 10–12 for medium. Rest 5 minutes before cutting.", flip: "flip", internal: 135 },
  { slug: "meatballs", name: "Meatballs", cat: "Beef & Pork", tempF: 380, lo: 10, hi: 12, note: "Shake once. Finish in sauce on the stove if you want them saucy.", flip: "shake", internal: 165 },
  { slug: "pork-chops", name: "Pork Chops (1-inch)", cat: "Beef & Pork", tempF: 380, lo: 12, hi: 15, note: "Brine or marinate first — the air fryer is fast but drying.", flip: "flip", internal: 145 },
  { slug: "bacon", name: "Bacon", cat: "Beef & Pork", tempF: 350, lo: 8, hi: 10, note: "Lay flat, no overlap. Pour off grease between batches to avoid smoke.", flip: "none" },
  { slug: "pork-tenderloin", name: "Pork Tenderloin", cat: "Beef & Pork", tempF: 400, lo: 20, hi: 25, note: "Rest 5–10 minutes. A little pink at 145°F is correct and juicy.", flip: "flip", internal: 145 },
  { slug: "sausages", name: "Sausages (fresh links)", cat: "Beef & Pork", tempF: 370, lo: 10, hi: 13, note: "Prick once or twice so they don't split. Turn halfway.", flip: "flip", internal: 160 },
  { slug: "hot-dogs", name: "Hot Dogs", cat: "Beef & Pork", tempF: 390, lo: 5, hi: 7, note: "Score diagonally for the crispy-edged diner look. Toast buns for the last minute.", flip: "none" },
  { slug: "ribs", name: "Baby Back Ribs (sectioned)", cat: "Beef & Pork", tempF: 375, lo: 25, hi: 30, note: "Cut the rack into 3–4 rib sections to fit. Sauce for the last 5 minutes only.", flip: "flip" },
  { slug: "meatloaf", name: "Meatloaf (1½ lb)", cat: "Beef & Pork", tempF: 350, lo: 30, hi: 40, note: "Use a small loaf pan or shape a free-form loaf. Glaze at the 25-minute mark.", flip: "none", internal: 160 },

  // ── Seafood ─────────────────────────────────────────────────────────
  { slug: "salmon", name: "Salmon Fillets", cat: "Seafood", tempF: 390, lo: 8, hi: 10, note: "Skin-side down, don't flip. Done when it flakes with a fork.", flip: "none", internal: 145 },
  { slug: "shrimp", name: "Shrimp", cat: "Seafood", tempF: 400, lo: 6, hi: 8, note: "Toss with oil and seasoning. They're done the moment they curl and turn pink.", flip: "shake" },
  { slug: "scallops", name: "Scallops", cat: "Seafood", tempF: 400, lo: 6, hi: 8, note: "Pat very dry first. Overcooked scallops turn rubbery fast — err short.", flip: "flip" },
  { slug: "crab-cakes", name: "Crab Cakes", cat: "Seafood", tempF: 375, lo: 8, hi: 10, note: "Chill them 15 minutes before cooking so they hold together. Flip gently.", flip: "flip" },
  { slug: "tilapia", name: "Tilapia / White Fish", cat: "Seafood", tempF: 380, lo: 8, hi: 12, note: "Thin fillets cook fast — start checking at 8 minutes.", flip: "none", internal: 145 },
  { slug: "breaded-fish-fillets", name: "Breaded Fish Fillets (fresh)", cat: "Seafood", tempF: 400, lo: 10, hi: 12, note: "Spray the breading with oil. Flip once, carefully.", flip: "flip", internal: 145 },

  // ── Vegetables ──────────────────────────────────────────────────────
  { slug: "brussels-sprouts", name: "Brussels Sprouts", cat: "Vegetables", tempF: 375, lo: 12, hi: 15, note: "Halve them, toss with oil, cut-side down. The loose leaves turn into chips.", flip: "shake" },
  { slug: "broccoli", name: "Broccoli", cat: "Vegetables", tempF: 380, lo: 8, hi: 10, note: "Toss with oil and shake once. Charred tips are the whole point.", flip: "shake" },
  { slug: "cauliflower", name: "Cauliflower", cat: "Vegetables", tempF: 390, lo: 12, hi: 15, note: "Cut into even florets. Shake twice for all-over browning.", flip: "shake" },
  { slug: "asparagus", name: "Asparagus", cat: "Vegetables", tempF: 390, lo: 6, hi: 9, note: "Thin spears take 6 minutes, thick ones 9. Trim the woody ends first.", flip: "none" },
  { slug: "zucchini", name: "Zucchini", cat: "Vegetables", tempF: 390, lo: 10, hi: 12, note: "Half-moons or fries. Salt after cooking, not before, to keep them from going soggy.", flip: "shake" },
  { slug: "green-beans", name: "Green Beans", cat: "Vegetables", tempF: 375, lo: 8, hi: 10, note: "Toss with oil and garlic. Shake once. They blister like restaurant green beans.", flip: "shake" },
  { slug: "carrots", name: "Carrots", cat: "Vegetables", tempF: 380, lo: 15, hi: 18, note: "Cut into even coins or sticks. A drizzle of honey for the last 3 minutes is great.", flip: "shake" },
  { slug: "baked-potato", name: "Baked Potato", cat: "Vegetables", tempF: 400, lo: 35, hi: 45, note: "Rub with oil and salt, prick with a fork. Squeeze to check doneness.", flip: "flip" },
  { slug: "sweet-potato-fries", name: "Sweet Potato Fries (fresh)", cat: "Vegetables", tempF: 380, lo: 15, hi: 18, note: "Don't crowd the basket — cook in batches. A little cornstarch toss makes them crispier.", flip: "shake" },
  { slug: "corn-on-the-cob", name: "Corn on the Cob", cat: "Vegetables", tempF: 380, lo: 12, hi: 15, note: "Butter after, not before. Turn once halfway.", flip: "flip" },
  { slug: "mushrooms", name: "Mushrooms", cat: "Vegetables", tempF: 380, lo: 10, hi: 12, note: "Halve or quarter. They shrink a lot — start with more than you think.", flip: "shake" },
  { slug: "bell-peppers", name: "Bell Peppers", cat: "Vegetables", tempF: 380, lo: 10, hi: 13, note: "Strips for fajitas. Shake once. Edges should blister and char slightly.", flip: "shake" },
  { slug: "butternut-squash", name: "Butternut Squash (cubed)", cat: "Vegetables", tempF: 400, lo: 18, hi: 20, note: "1-inch cubes, tossed with oil. Shake twice.", flip: "shake" },

  // ── Snacks & sides ──────────────────────────────────────────────────
  { slug: "homemade-french-fries", name: "French Fries (fresh-cut)", cat: "Snacks & Sides", tempF: 380, lo: 15, hi: 20, note: "Soak cut potatoes in cold water 30 minutes, dry well, toss with oil.", flip: "shake" },
  { slug: "crispy-chickpeas", name: "Crispy Chickpeas", cat: "Snacks & Sides", tempF: 390, lo: 12, hi: 15, note: "Dry the chickpeas thoroughly first. Season immediately after cooking.", flip: "shake" },
  { slug: "kale-chips", name: "Kale Chips", cat: "Snacks & Sides", tempF: 300, lo: 5, hi: 7, note: "Low and fast — they go from perfect to burnt in about 60 seconds. Watch closely.", flip: "shake" },
  { slug: "tofu", name: "Tofu (cubed)", cat: "Snacks & Sides", tempF: 400, lo: 12, hi: 15, note: "Press it first, toss with cornstarch and oil. Shake every 5 minutes.", flip: "shake" },
  { slug: "falafel", name: "Falafel", cat: "Snacks & Sides", tempF: 380, lo: 12, hi: 14, note: "Spray with oil for a deep-fried finish. Flip halfway.", flip: "flip" },
  { slug: "quesadilla", name: "Quesadilla", cat: "Snacks & Sides", tempF: 350, lo: 6, hi: 8, note: "Weigh it down with a small rack or toothpick it shut so the top doesn't blow open.", flip: "flip" },
  { slug: "grilled-cheese", name: "Grilled Cheese", cat: "Snacks & Sides", tempF: 370, lo: 6, hi: 8, note: "Butter the outside, flip halfway. Toothpick the top slice down if it slides.", flip: "flip" },
  { slug: "hard-boiled-eggs", name: "Hard-Boiled Eggs", cat: "Snacks & Sides", tempF: 270, lo: 15, hi: 17, note: "Yes, really — straight in the basket, no water. Ice bath after for easy peeling.", flip: "none" },
  { slug: "garlic-bread", name: "Garlic Bread", cat: "Snacks & Sides", tempF: 350, lo: 5, hi: 7, note: "Watch the last minute — the edges toast fast.", flip: "none" },
  { slug: "apple-chips", name: "Apple Chips", cat: "Snacks & Sides", tempF: 300, lo: 12, hi: 15, note: "Slice paper-thin, single layer. They crisp as they cool.", flip: "flip" },

  // ── Breakfast & baking ──────────────────────────────────────────────
  { slug: "cinnamon-rolls", name: "Cinnamon Rolls (canned)", cat: "Breakfast & Baking", tempF: 320, lo: 8, hi: 10, note: "Space them out — they expand. Ice while warm.", flip: "none" },
  { slug: "biscuits", name: "Biscuits (canned)", cat: "Breakfast & Baking", tempF: 330, lo: 8, hi: 10, note: "Parchment liner helps. Golden top = done.", flip: "none" },
  { slug: "cookies", name: "Cookies (drop dough)", cat: "Breakfast & Baking", tempF: 300, lo: 8, hi: 10, note: "Bake on parchment, a few at a time. They'll look underdone — they set as they cool.", flip: "none" },
  { slug: "biscuit-donuts", name: "Donuts (from canned biscuits)", cat: "Breakfast & Baking", tempF: 350, lo: 5, hi: 6, note: "Cut a hole, air fry, then dunk in melted butter and cinnamon sugar.", flip: "flip" },

  // ── Reheating ───────────────────────────────────────────────────────
  { slug: "reheat-pizza", name: "Reheating Pizza", cat: "Reheating", tempF: 350, lo: 3, hi: 5, note: "Better than any microwave or oven method — crisp crust, melted cheese.", flip: "none" },
  { slug: "reheat-fried-chicken", name: "Reheating Fried Chicken", cat: "Reheating", tempF: 375, lo: 6, hi: 8, note: "Brings the crust all the way back. Let it sit 2 minutes after.", flip: "flip", internal: 165 },
  { slug: "reheat-french-fries", name: "Reheating French Fries", cat: "Reheating", tempF: 375, lo: 3, hi: 5, note: "The only method that actually revives fries. Shake once.", flip: "shake" },
];
