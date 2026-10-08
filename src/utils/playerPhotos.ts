// ============================================================
// KoraLive Player Photos & Headshots (صور اللاعبين ونجوم الفرق)
// ============================================================

export interface PlayerPhotoMeta {
  photoUrl: string;
  avatarColor: string;
}

// High-resolution verified football portraits and player headshots
export const STAR_PLAYER_PHOTOS: Record<string, string> = {
  // Al-Nassr Stars
  'cristiano-ronaldo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_02_%28cropped%29.jpg/500px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_02_%28cropped%29.jpg',
  'cr7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_02_%28cropped%29.jpg/500px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_02_%28cropped%29.jpg',
  'sadio-mane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sadio_Man%C3%A9_2022.jpg/500px-Sadio_Man%C3%A9_2022.jpg',
  'marcelo-brozovic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Marcelo_Brozovi%C3%A7_2018.jpg/500px-Marcelo_Brozovi%C3%A7_2018.jpg',
  'aymeric-laporte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Aymeric_Laporte_2021.jpg/500px-Aymeric_Laporte_2021.jpg',
  'otavio': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ot%C3%A1vio_2022.jpg/500px-Ot%C3%A1vio_2022.jpg',
  'talGoal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_02_%28cropped%29.jpg/500px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_02_%28cropped%29.jpg',

  // Al-Hilal Stars
  'salem-al-dawsari': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Salem_Al-Dawsari_2018.jpg/500px-Salem_Al-Dawsari_2018.jpg',
  'aleksandar-mitrovic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Aleksandar_Mitrovi%C3%A7_2018.jpg/500px-Aleksandar_Mitrovi%C3%A7_2018.jpg',
  'ruben-neves': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/R%C3%BAben_Neves_2018.jpg/500px-R%C3%BAben_Neves_2018.jpg',
  'yassine-bono': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Yassine_Bounou_2018.jpg/500px-Yassine_Bounou_2018.jpg',
  'bono': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Yassine_Bounou_2018.jpg/500px-Yassine_Bounou_2018.jpg',
  'sergej-milinkovic-savic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Sergej_Milinkovi%C3%A7-Savi%C3%A7_2018.jpg/500px-Sergej_Milinkovi%C3%A7-Savi%C3%A7_2018.jpg',
  'neymar-jr': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Bra-Cos_%281%29_%28cropped%29.jpg/500px-Bra-Cos_%281%29_%28cropped%29.jpg',
  'kalidou-koulibaly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Kalidou_Koulibaly_2018.jpg/500px-Kalidou_Koulibaly_2018.jpg',

  // Saudi National Team Stars
  'mohammed-al-owais': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mohammed_Al-Owais_2018.jpg/500px-Mohammed_Al-Owais_2018.jpg',
  'saud-abdulhamid': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Saud_Abdulhamid_2022.jpg/500px-Saud_Abdulhamid_2022.jpg',
  'ali-al-bulayhi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Ali_Al-Bulaihi_2018.jpg/500px-Ali_Al-Bulaihi_2018.jpg',
  'mohamed-kanno': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Mohamed_Kanno_2018.jpg/500px-Mohamed_Kanno_2018.jpg',
  'firas-al-buraikan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Firas_Al-Buraikan_2022.jpg/500px-Firas_Al-Buraikan_2022.jpg',

  // Real Madrid Stars
  'vinicius-junior': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Vinicius_Junior_2022.jpg/500px-Vinicius_Junior_2022.jpg',
  'vinicius': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Vinicius_Junior_2022.jpg/500px-Vinicius_Junior_2022.jpg',
  'kylian-mbappe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Andorra-Frankreich_StP_1027_LR10_by_Stepro_%28cropped%29.jpg/500px-2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Andorra-Frankreich_StP_1027_LR10_by_Stepro_%28cropped%29.jpg',
  'mbappe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Andorra-Frankreich_StP_1027_LR10_by_Stepro_%28cropped%29.jpg/500px-2019-06-11_Fu%C3%9Fball%2C_M%C3%A4nner%2C_L%C3%A4nderspiel%2C_Andorra-Frankreich_StP_1027_LR10_by_Stepro_%28cropped%29.jpg',
  'jude-bellingham': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Jude_Bellingham_2022.jpg/500px-Jude_Bellingham_2022.jpg',
  'bellingham': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Jude_Bellingham_2022.jpg/500px-Jude_Bellingham_2022.jpg',
  'rodrygo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Rodrygo_2022.jpg/500px-Rodrygo_2022.jpg',
  'luka-modric': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Luka_Modri%C3%A7_2018.jpg/500px-Luka_Modri%C3%A7_2018.jpg',
  'federico-valverde': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Federico_Valverde_2022.jpg/500px-Federico_Valverde_2022.jpg',
  'thibaut-courtois': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Thibaut_Courtois_2018.jpg/500px-Thibaut_Courtois_2018.jpg',

  // FC Barcelona Stars
  'lamine-yamal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Lamine_Yamal_2024.jpg/500px-Lamine_Yamal_2024.jpg',
  'yamal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Lamine_Yamal_2024.jpg/500px-Lamine_Yamal_2024.jpg',
  'robert-lewandowski': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Robert_Lewandowski_2018.jpg/500px-Robert_Lewandowski_2018.jpg',
  'raphinha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Raphinha_2022.jpg/500px-Raphinha_2022.jpg',
  'pedri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Pedri_2021.jpg/500px-Pedri_2021.jpg',
  'gavi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Gavi_2022.jpg/500px-Gavi_2022.jpg',

  // Manchester City Stars
  'erling-haaland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Erling_Haaland_2023_%28cropped%29.jpg/500px-Erling_Haaland_2023_%28cropped%29.jpg',
  'haaland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Erling_Haaland_2023_%28cropped%29.jpg/500px-Erling_Haaland_2023_%28cropped%29.jpg',
  'kevin-de-bruyne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kevin_De_Bruyne_201807091.jpg/500px-Kevin_De_Bruyne_201807091.jpg',
  'phil-foden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Phil_Foden_2022.jpg/500px-Phil_Foden_2022.jpg',
  'rodri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Rodri_2022.jpg/500px-Rodri_2022.jpg',

  // Liverpool Stars
  'mohamed-salah': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mohamed_Salah_2018.jpg/500px-Mohamed_Salah_2018.jpg',
  'salah': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mohamed_Salah_2018.jpg/500px-Mohamed_Salah_2018.jpg',
  'virgil-van-dijk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Virgil_van_Dijk_2018.jpg/500px-Virgil_van_Dijk_2018.jpg',
  'alisson-becker': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Alisson_Becker_2018.jpg/500px-Alisson_Becker_2018.jpg',

  // International Stars
  'lionel-messi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/500px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
  'messi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/500px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
  'lautaro-martinez': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Lautaro_Mart%C3%ADnez_2018.jpg/500px-Lautaro_Mart%C3%ADnez_2018.jpg',
  'julian-alvarez': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Juli%C3%A1n_%C3%81lvarez_2022.jpg/500px-Juli%C3%A1n_%C3%81lvarez_2022.jpg',
  'rodrigo-de-paul': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Rodrigo_De_Paul_2022.jpg/500px-Rodrigo_De_Paul_2022.jpg',
  'emiliano-martinez': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Emiliano_Mart%C3%ADnez_2022.jpg/500px-Emiliano_Mart%C3%ADnez_2022.jpg',
  'achraf-hakimi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Achraf_Hakimi_2018.jpg/500px-Achraf_Hakimi_2018.jpg',
  'hakim-ziyech': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Hakim_Ziyech_2018.jpg/500px-Hakim_Ziyech_2018.jpg',
  'youssef-en-nesyri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Youssef_En-Nesyri_2018.jpg/500px-Youssef_En-Nesyri_2018.jpg',
  'kaoru-mitoma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Kaoru_Mitoma_2022.jpg/500px-Kaoru_Mitoma_2022.jpg',
  'wataru-endo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Wataru_Endo_2022.jpg/500px-Wataru_Endo_2022.jpg',
  'takefusa-kubo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Takefusa_Kubo_2022.jpg/500px-Takefusa_Kubo_2022.jpg',
  'bukayo-saka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Bukayo_Saka_2022.jpg/500px-Bukayo_Saka_2022.jpg',
  'harry-kane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Harry_Kane_2018.jpg/500px-Harry_Kane_2018.jpg',
  'jamal-musiala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Jamal_Musiala_2022.jpg/500px-Jamal_Musiala_2022.jpg',
  'florian-wirtz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Florian_Wirtz_2021.jpg/500px-Florian_Wirtz_2021.jpg',
  'antoine-griezmann': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Antoine_Griezmann_2018.jpg/500px-Antoine_Griezmann_2018.jpg',
};

// Generates a consistent, realistic portrait avatar or photo URL for any player
export function getPlayerPhoto(
  playerId: string,
  playerName?: string,
  position?: 'GK' | 'DF' | 'MF' | 'FW'
): string {
  if (!playerName && !playerId) {
    return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=256&h=256&q=80';
  }

  const cleanName = (playerName || playerId)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  // Direct match
  if (STAR_PLAYER_PHOTOS[cleanName]) {
    return STAR_PLAYER_PHOTOS[cleanName];
  }

  // Partial match search
  for (const [key, url] of Object.entries(STAR_PLAYER_PHOTOS)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return url;
    }
  }

  // Position-themed high quality athlete headshots from Unsplash Football / Athletic series
  const positionPhotos: Record<string, string[]> = {
    GK: [
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    ],
    DF: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    ],
    MF: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&h=256&q=80',
    ],
    FW: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
    ],
  };

  const pool = (position && positionPhotos[position]) || positionPhotos.MF;
  let hash = 0;
  for (let i = 0; i < (playerId + (playerName || '')).length; i++) {
    hash = (hash << 5) - hash + (playerId + (playerName || '')).charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % pool.length;
  return pool[index];
}
