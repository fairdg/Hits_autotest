import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const moduleNames = [
  "data.js",
  "core.js",
  "catalog.js",
  "reviews.js",
  "auth.js",
  "bookings.js",
  "account.js",
  "app.js",
];

const source = moduleNames.map(moduleName => {
  const contents = fs.readFileSync(path.join(root, "src", "js", moduleName), "utf8").trim();
  return `// --- ${moduleName} ---\n${contents}`;
}).join("\n\n");

const defectCases = {
  2: {
    description: "корректный пользователь U1 не может войти",
    changes: [[
      '  const user = state.users.find(item => item.email.toLowerCase() === email && item.password === password);',
      '  const user = state.users.find(item => item.email.toLowerCase() === email && item.password === password && item.id !== "U1");',
    ]],
  },
  3: {
    description: "пользователь U1 может войти с любым паролем",
    changes: [[
      '  const user = state.users.find(item => item.email.toLowerCase() === email && item.password === password);',
      '  const user = state.users.find(item => item.email.toLowerCase() === email && (item.password === password || item.id === "U1"));',
    ]],
  },
  4: {
    description: "поиск игнорирует выбранное направление",
    changes: [[
      '  const result = destination ? allTours().filter(tour => tour.destination === destination) : allTours();',
      '  const result = allTours();',
    ]],
  },
  5: {
    description: "пустой поиск подменяется полным каталогом",
    changes: [[
      '  renderSearchResults(result, destination);',
      '  renderSearchResults(result.length ? result : allTours(), destination);',
    ]],
  },
  6: {
    description: "при выборе T1 открываются данные T2",
    changes: [[
      '  const tour = getTour(id);',
      '  const tour = getTour(id === "T1" ? "T2" : id);',
    ]],
  },
  7: {
    description: "новая бронь всегда создаётся для T2",
    changes: [[
      '    tourId: tour.id,',
      '    tourId: "T2",',
    ]],
  },
  8: {
    description: "отмена брони не сохраняется",
    changes: [[
      '  booking.status = "Отменено";\n  save(STORAGE.bookings, state.bookings);\n  renderBookings();',
      '  booking.status = "Отменено";\n  renderBookings();',
    ]],
  },
  9: {
    description: "успешная оплата не подтверждает бронь",
    changes: [[
      '  booking.status = "Подтверждено";',
      '  booking.status = "Не оплачено";',
    ]],
  },
  10: {
    description: "в кабинете отображаются брони всех пользователей",
    changes: [[
      '  const bookings = state.bookings.filter(booking => booking.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));',
      '  const bookings = state.bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));',
    ]],
  },
  11: {
    description: "отзыв о T1 сохраняется для T2",
    changes: [[
      '      tourId: state.selectedTourId,',
      '      tourId: state.selectedTourId === "T1" ? "T2" : state.selectedTourId,',
    ]],
  },
  12: {
    description: "разрешено создание пустого отзыва",
    changes: [[
      '    if (!text) {',
      '    if (false && !text) {',
    ]],
  },
  13: {
    description: "изменённое имя не сохраняется",
    changes: [[
      '  user.name = name;\n  save(STORAGE.users, state.users);\n  state.reviews.filter',
      '  user.name = name;\n  state.reviews.filter',
    ]],
  },
  14: {
    description: "выход не удаляет сохранённую сессию",
    changes: [[
      '  state.pendingRoute = null;\n  localStorage.removeItem(STORAGE.session);\n  closeDialog(elements.accountDialog);',
      '  state.pendingRoute = null;\n  closeDialog(elements.accountDialog);',
    ]],
  },
  15: {
    description: "прямая ссылка на бронирования обходит авторизацию",
    changes: [[
      '  if (hash.startsWith("tour-")) openTour(hash.replace("tour-", ""));\n  else if (["bookings", "profile", "admin"].includes(hash)) openAccount(hash);',
      '  if (hash.startsWith("tour-")) openTour(hash.replace("tour-", ""));\n  else if (hash === "bookings" && !currentUser()) { state.currentUserId = "U1"; openAccount(hash); }\n  else if (["bookings", "profile", "admin"].includes(hash)) openAccount(hash);',
    ]],
  },
  16: {
    description: "администратор не сохраняет новый тур",
    changes: [[
      '  state.customTours.push(tour);\n  save(STORAGE.tours, state.customTours);\n  addDestinationOption(destination);',
      '  addDestinationOption(destination);',
    ]],
  },
};

function replaceExactlyOnce(contents, search, replacement, caseNumber) {
  const occurrences = contents.split(search).length - 1;
  if (occurrences !== 1) {
    throw new Error(`Тест-кейс ${caseNumber}: ожидалось одно совпадение, найдено ${occurrences}`);
  }
  return contents.replace(search, replacement);
}

function createBundle(caseNumber = null) {
  let contents = source;
  const defect = caseNumber === null ? null : defectCases[caseNumber];
  if (defect) {
    for (const [search, replacement] of defect.changes) {
      contents = replaceExactlyOnce(contents, search, replacement, caseNumber);
    }
  }

  const indented = contents.split("\n").map(line => line ? `  ${line}` : "").join("\n");
  const defectComment = defect
    ? `\n  // Дефект тест-кейса ${caseNumber}: ${defect.description}.\n`
    : "";

  return `// Сгенерировано из src/js командой: node build-js.mjs\n(() => {\n  "use strict";\n${defectComment}\n${indented}\n})();\n`;
}

fs.writeFileSync(path.join(root, "reference", "app.js"), createBundle());
fs.writeFileSync(path.join(root, "testcases", "1", "app.js"), createBundle());

for (const caseNumber of Object.keys(defectCases).map(Number)) {
  fs.writeFileSync(
    path.join(root, "testcases", String(caseNumber), "app.js"),
    createBundle(caseNumber),
  );
}

console.log("Собраны reference/app.js и testcases/1–16/app.js");
