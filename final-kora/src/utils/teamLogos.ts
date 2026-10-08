export const REAL_TEAM_LOGOS: Record<string, string> = {
  nassr: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Al-Nassr_FC_Logo.svg/1200px-Al-Nassr_FC_Logo.svg.png',
  hilal: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Al_Hilal_SFC_Logo.svg/1200px-Al_Hilal_SFC_Logo.svg.png',
  rm: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
  bar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
  fcb: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
  mci: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
  ars: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png',
  liv: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png',
  ittihad: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Al-Ittihad_Club_%28Jeddah%29_logo.svg/1200px-Al-Ittihad_Club_%28Jeddah%29_logo.svg.png',
  ahli: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Al-Ahli_Saudi_FC_Logo.svg/1200px-Al-Ahli_Saudi_FC_Logo.svg.png',
  int: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png',
  juv: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juventus_FC_2017_icon_%28black%29.svg/1200px-Juventus_FC_2017_icon_%28black%29.svg.png',
  shabab: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Al-Shabab_FC_%28Riyadh%29_logo.svg/1200px-Al-Shabab_FC_%28Riyadh%29_logo.svg.png',
  ettifaq: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Al-Ettifaq_FC_logo.svg/1200px-Al-Ettifaq_FC_logo.svg.png',
  sev: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Sevilla_FC_logo.svg/1200px-Sevilla_FC_logo.svg.png',
  mun: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png',
  mufc: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png',
  'nassr-w': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Al-Nassr_FC_Logo.svg/1200px-Al-Nassr_FC_Logo.svg.png',
  'hilal-w': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Al_Hilal_SFC_Logo.svg/1200px-Al_Hilal_SFC_Logo.svg.png',
  'ittihad-w': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Al-Ittihad_Club_%28Jeddah%29_logo.svg/1200px-Al-Ittihad_Club_%28Jeddah%29_logo.svg.png',
  'ahli-w': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Al-Ahli_Saudi_FC_Logo.svg/1200px-Al-Ahli_Saudi_FC_Logo.svg.png',
};

export function getTeamLogoUrl(teamId: string, fallbackEmoji: string = '⚽'): { isImage: boolean; src: string } {
  const url = REAL_TEAM_LOGOS[teamId.toLowerCase()];
  if (url) {
    return { isImage: true, src: url };
  }
  return { isImage: false, src: fallbackEmoji };
}
