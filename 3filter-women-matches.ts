// أضف هذه الدالة في ملف matches.server.ts (فوق دالة normalizeMatch)

function isWomenTeam(name: string) {
  return /women|ladies|wfc|\bw\b|نسائي|سيدات|للسيدات|نساء/i.test(name)
}

// ثم أضف هذا السطر داخل دالة normalizeMatch
// بعد التحقق من وجود اسم الفريقين وقبل التحقق من تاريخ المباراة:

// استبعاد مباريات النساء
if (isWomenTeam(home.team.displayName) || isWomenTeam(away.team.displayName)) return null
