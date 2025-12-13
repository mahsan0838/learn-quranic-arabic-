import { Word, WordCategory, Module } from '../types';

export const MODULES: Module[] = [
  {
    id: 1,
    title: "Foundation & Al-Fatihah",
    description: "The keys to the Quran: Pronouns, Particles, Questions, and the Opening Chapter.",
    color: "bg-emerald-500",
    percentage: 20.0
  },
  {
    id: 2,
    title: "Salah & Short Surahs",
    description: "Learn grammar through the daily Prayers (Salah) and the last 10 Surahs.",
    color: "bg-blue-500",
    percentage: 40.0
  },
  {
    id: 3,
    title: "The World & The Unseen",
    description: "Essential Nouns: Prophets, People, Nature, Time, and the Afterlife.",
    color: "bg-indigo-500",
    percentage: 55.0
  },
  {
    id: 4,
    title: "Quranic Actions (Verbs)",
    description: "The 4 Key Patterns (F-N-D-S) and high-frequency Weak Verbs.",
    color: "bg-amber-500",
    percentage: 70.0
  },
  {
    id: 5,
    title: "Connectors & Core Concepts",
    description: "The glue of sentences: Prepositions of place, Logical particles (If/When), and Core Abstract Nouns.",
    color: "bg-rose-500",
    percentage: 82.6
  }
];

export const VOCABULARY: Word[] = [
  // ==========================================
  // MODULE 1: Foundation & Al-Fatihah
  // ==========================================

  // --- Surah Al-Fatihah ---
  {
    id: 'm1_hamd',
    arabic: 'حَمْد',
    english: 'Praise; Thanks',
    urdu: 'تعریف، شکر',
    category: WordCategory.NOUN,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    frequency: 63,
    exampleVerse: { arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', english: 'All praise is for Allah, Lord of the worlds.', reference: '1:2' }
  },
  {
    id: 'm1_alameen',
    arabic: 'عَالَمِين',
    english: 'Worlds; Universe',
    urdu: 'جہانوں',
    category: WordCategory.NOUN,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    frequency: 73,
    exampleVerse: { arabic: 'رَبِّ ٱلْعَٰلَمِينَ', english: 'Lord of the worlds.', reference: '1:2' }
  },
  {
    id: 'm1_malik',
    arabic: 'مَالِك',
    english: 'Master; Owner',
    urdu: 'مالک',
    category: WordCategory.NOUN,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    frequency: 13,
    exampleVerse: { arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', english: 'Master of the Day of Judgment.', reference: '1:4' }
  },
  {
    id: 'm1_deen',
    arabic: 'دِين',
    english: 'Religion; Judgment',
    urdu: 'دین',
    category: WordCategory.NOUN,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    frequency: 92,
    exampleVerse: { arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', english: 'Master of the Day of Judgment.', reference: '1:4' }
  },
  {
    id: 'm1_iyyaka',
    arabic: 'إِيَّاكَ',
    english: 'You Alone',
    urdu: 'صرف تیری',
    category: WordCategory.PARTICLE,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    frequency: 8,
    exampleVerse: { arabic: 'إِيَّاكَ نَعْبُدُ', english: 'You alone we worship.', reference: '1:5' }
  },
  {
    id: 'm1_ihdina',
    arabic: 'ٱهْدِنَا',
    english: 'Guide us',
    urdu: 'ہمیں ہدایت دے',
    category: WordCategory.VERB,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    root: 'ه د ي',
    frequency: 50,
    exampleVerse: { arabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', english: 'Guide us to the straight path.', reference: '1:6' }
  },
  {
    id: 'm1_sirat',
    arabic: 'صِرَاط',
    english: 'Path',
    urdu: 'راستہ',
    category: WordCategory.NOUN,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    frequency: 45,
    exampleVerse: { arabic: 'ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', english: 'The straight path.', reference: '1:6' }
  },
  {
    id: 'm1_mustaqim',
    arabic: 'مُسْتَقِيم',
    english: 'Straight',
    urdu: 'سیدھا',
    category: WordCategory.NOUN,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    frequency: 37,
    exampleVerse: { arabic: 'إِلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ', english: 'To a straight path.', reference: 'Common' }
  },
  {
    id: 'm1_ghayr',
    arabic: 'غَيْر',
    english: 'Not; Other than',
    urdu: 'علاوہ، غیر',
    category: WordCategory.PARTICLE,
    subCategory: 'Al-Fatihah',
    moduleId: 1,
    frequency: 145,
    exampleVerse: { arabic: 'غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ', english: 'Not of those who have evoked [Your] anger.', reference: '1:7' }
  },

  // --- Pronouns ---
  {
    id: 'm1_he',
    arabic: 'هُوَ',
    english: 'He',
    urdu: 'وہ (ایک مرد)',
    category: WordCategory.PARTICLE,
    subCategory: 'Pronouns',
    moduleId: 1,
    frequency: 481,
    exampleVerse: { arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', english: 'Say, He is Allah, One.', reference: '112:1' }
  },
  {
    id: 'm1_they_m',
    arabic: 'هُمْ',
    english: 'They (masc.)',
    urdu: 'وہ سب (مرد)',
    category: WordCategory.PARTICLE,
    subCategory: 'Pronouns',
    moduleId: 1,
    frequency: 445,
    exampleVerse: { arabic: 'وَأُوْلَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ', english: 'And it is those who are the successful.', reference: '2:5' }
  },
  {
    id: 'm1_you_m',
    arabic: 'أَنْتَ',
    english: 'You (masc.)',
    urdu: 'آپ (ایک مرد)',
    category: WordCategory.PARTICLE,
    subCategory: 'Pronouns',
    moduleId: 1,
    frequency: 81,
    exampleVerse: { arabic: 'أَأَنتَ فَعَلْتَ هَٰذَا', english: 'Did you do this?', reference: '21:62' }
  },
  {
    id: 'm1_you_pl',
    arabic: 'أَنْتُمْ',
    english: 'You all',
    urdu: 'آپ سب',
    category: WordCategory.PARTICLE,
    subCategory: 'Pronouns',
    moduleId: 1,
    frequency: 135,
    exampleVerse: { arabic: 'وَأَنتُمْ تَعْلَمُونَ', english: 'While you know [the truth].', reference: '2:22' }
  },
  {
    id: 'm1_i',
    arabic: 'أَنَا',
    english: 'I',
    urdu: 'میں',
    category: WordCategory.PARTICLE,
    subCategory: 'Pronouns',
    moduleId: 1,
    frequency: 68,
    exampleVerse: { arabic: 'إِنَّنِي أَنَا ٱللَّهُ', english: 'Indeed, I am Allah.', reference: '20:14' }
  },
  {
    id: 'm1_we',
    arabic: 'نَحْنُ',
    english: 'We',
    urdu: 'ہم',
    category: WordCategory.PARTICLE,
    subCategory: 'Pronouns',
    moduleId: 1,
    frequency: 86,
    exampleVerse: { arabic: 'نَحْنُ خَلَقْنَٰكُمْ', english: 'We have created you.', reference: '56:57' }
  },

  // --- Prepositions & Pointers ---
  {
    id: 'm1_bi',
    arabic: 'بِ',
    english: 'With, in, by',
    urdu: 'ساتھ، سے',
    category: WordCategory.PARTICLE,
    subCategory: 'Prepositions',
    moduleId: 1,
    frequency: 1000,
    exampleVerse: { arabic: 'بِسْمِ ٱللَّهِ', english: 'In the name of Allah.', reference: '1:1' }
  },
  {
    id: 'm1_li',
    arabic: 'لِ',
    english: 'For, to',
    urdu: 'کے لیے',
    category: WordCategory.PARTICLE,
    subCategory: 'Prepositions',
    moduleId: 1,
    frequency: 1000,
    exampleVerse: { arabic: 'ٱلْحَمْدُ لِلَّهِ', english: 'All praise is for Allah.', reference: '1:2' }
  },
  {
    id: 'm1_min',
    arabic: 'مِنْ',
    english: 'From',
    urdu: 'سے',
    category: WordCategory.PARTICLE,
    subCategory: 'Prepositions',
    moduleId: 1,
    frequency: 3226,
    exampleVerse: { arabic: 'مِن شَرِّ ٱلْوَسْوَاسِ', english: 'From the evil of the whisperer.', reference: '114:4' }
  },
  {
    id: 'm1_fi',
    arabic: 'فِي',
    english: 'In',
    urdu: 'میں',
    category: WordCategory.PARTICLE,
    subCategory: 'Prepositions',
    moduleId: 1,
    frequency: 1701,
    exampleVerse: { arabic: 'فِى دِينِ ٱللَّهِ', english: 'In the religion of Allah.', reference: '110:2' }
  },
  {
    id: 'm1_ala',
    arabic: 'عَلَى',
    english: 'On, upon',
    urdu: 'پر',
    category: WordCategory.PARTICLE,
    subCategory: 'Prepositions',
    moduleId: 1,
    frequency: 1445,
    exampleVerse: { arabic: 'عَلَىٰ هُدًى', english: 'Upon guidance.', reference: '2:5' }
  },
  {
    id: 'm1_hadha',
    arabic: 'هٰذَا',
    english: 'This',
    urdu: 'یہ',
    category: WordCategory.PARTICLE,
    subCategory: 'Pointers',
    moduleId: 1,
    frequency: 215,
    exampleVerse: { arabic: 'هَٰذَا بَلَٰغٞ', english: 'This is a notification.', reference: '14:52' }
  },
  {
    id: 'm1_dhalika',
    arabic: 'ذٰلِكَ',
    english: 'That',
    urdu: 'وہ',
    category: WordCategory.PARTICLE,
    subCategory: 'Pointers',
    moduleId: 1,
    frequency: 432,
    exampleVerse: { arabic: 'ذَٰلِكَ ٱلْكِتَٰبُ', english: 'That is the Book.', reference: '2:2' }
  },

  // --- Questions & Particles ---
  {
    id: 'm1_ma',
    arabic: 'مَا',
    english: 'What; Not',
    urdu: 'کیا؛ نہیں',
    category: WordCategory.PARTICLE,
    subCategory: 'Questions',
    moduleId: 1,
    frequency: 2187,
    exampleVerse: { arabic: 'وَمَا تِلْكَ بِيَمِينِكَ', english: 'And what is that in your right hand?', reference: '20:17' }
  },
  {
    id: 'm1_man',
    arabic: 'مَنْ',
    english: 'Who',
    urdu: 'کون',
    category: WordCategory.PARTICLE,
    subCategory: 'Questions',
    moduleId: 1,
    frequency: 831,
    exampleVerse: { arabic: 'مَن ذَا ٱلَّذِى يَشْفَعُ', english: 'Who is it that can intercede?', reference: '2:255' }
  },
  {
    id: 'm1_inna',
    arabic: 'إِنَّ',
    english: 'Indeed',
    urdu: 'بے شک',
    category: WordCategory.PARTICLE,
    subCategory: 'Particles',
    moduleId: 1,
    frequency: 1533,
    exampleVerse: { arabic: 'إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ', english: 'Indeed, Allah is with the patient.', reference: '2:153' }
  },


  // ==========================================
  // MODULE 2: Salah & Short Surahs
  // ==========================================

  // --- Adhan & Salah ---
  {
    id: 'm2_akbar',
    arabic: 'أَكْبَر',
    english: 'Greatest',
    urdu: 'سب سے بڑا',
    category: WordCategory.NOUN,
    subCategory: 'Salah (Prayer)',
    moduleId: 2,
    frequency: 23,
    exampleVerse: { arabic: 'ٱللَّهُ أَكْبَرُ', english: 'Allah is the Greatest.', reference: 'Adhan' }
  },
  {
    id: 'm2_ashhadu',
    arabic: 'أَشْهَدُ',
    english: 'I bear witness',
    urdu: 'میں گواہی دیتا ہوں',
    category: WordCategory.VERB,
    subCategory: 'Salah (Prayer)',
    moduleId: 2,
    root: 'ش ه د',
    frequency: 20,
    exampleVerse: { arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّهُ', english: 'I bear witness that there is no god but Allah.', reference: 'Adhan' }
  },
  {
    id: 'm2_subhana',
    arabic: 'سُبْحَانَ',
    english: 'Glory be to',
    urdu: 'پاک ہے',
    category: WordCategory.NOUN,
    subCategory: 'Salah (Prayer)',
    moduleId: 2,
    frequency: 41,
    exampleVerse: { arabic: 'سُبْحَانَ رَبِّيَ ٱلْعَظِيمِ', english: 'Glory be to my Lord, the Most Great.', reference: 'Salah' }
  },
  {
    id: 'm2_azim',
    arabic: 'عَظِيم',
    english: 'Great; Magnificent',
    urdu: 'عظمت والا',
    category: WordCategory.NOUN,
    subCategory: 'Salah (Prayer)',
    moduleId: 2,
    frequency: 107,
    exampleVerse: { arabic: 'وَلَهُمْ عَذَابٌ عَظِيمٌ', english: 'And for them is a great punishment.', reference: '2:7' }
  },
  {
    id: 'm2_ala',
    arabic: 'أَعْلَى',
    english: 'Most High',
    urdu: 'سب سے بلند',
    category: WordCategory.NOUN,
    subCategory: 'Salah (Prayer)',
    moduleId: 2,
    frequency: 9,
    exampleVerse: { arabic: 'سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ', english: 'Glory be to my Lord, the Most High.', reference: 'Salah' }
  },
  {
    id: 'm2_abd',
    arabic: 'عَبْد',
    english: 'Slave; Servant',
    urdu: 'بندہ',
    category: WordCategory.NOUN,
    subCategory: 'Salah (Prayer)',
    moduleId: 2,
    frequency: 120,
    exampleVerse: { arabic: 'عَلَىٰ عِبَادِ ٱللَّهِ ٱلصَّالِحِينَ', english: 'Upon the righteous slaves of Allah.', reference: 'Tashahhud' }
  },

  // --- Short Surahs Words ---
  {
    id: 'm2_khusr',
    arabic: 'خُسْر',
    english: 'Loss',
    urdu: 'خسارہ',
    category: WordCategory.NOUN,
    subCategory: 'Short Surahs',
    moduleId: 2,
    frequency: 1,
    exampleVerse: { arabic: 'إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ', english: 'Indeed, mankind is in loss.', reference: '103:2' }
  },
  {
    id: 'm2_sabr',
    arabic: 'صَبْر',
    english: 'Patience',
    urdu: 'صبر',
    category: WordCategory.NOUN,
    subCategory: 'Short Surahs',
    moduleId: 2,
    frequency: 103,
    exampleVerse: { arabic: 'وَتَوَاصَوْا۟ بِٱلصَّبْرِ', english: 'And advise each other to patience.', reference: '103:3' }
  },
  {
    id: 'm2_nasr',
    arabic: 'نَصْر',
    english: 'Help; Victory',
    urdu: 'مدد',
    category: WordCategory.NOUN,
    subCategory: 'Short Surahs',
    moduleId: 2,
    frequency: 22,
    exampleVerse: { arabic: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ', english: 'When the victory of Allah comes.', reference: '110:1' }
  },
  {
    id: 'm2_fath',
    arabic: 'فَتْح',
    english: 'Opening; Victory',
    urdu: 'فتح',
    category: WordCategory.NOUN,
    subCategory: 'Short Surahs',
    moduleId: 2,
    frequency: 12,
    exampleVerse: { arabic: 'وَرّأَيْتَ ٱلنَّاسَ يَدْخُلُونَ', english: 'And you see the people entering...', reference: '110:2' }
  },
  {
    id: 'm2_ahad',
    arabic: 'أَحَد',
    english: 'One; Unique',
    urdu: 'ایک',
    category: WordCategory.NOUN,
    subCategory: 'Short Surahs',
    moduleId: 2,
    frequency: 85,
    exampleVerse: { arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', english: 'Say, He is Allah, One.', reference: '112:1' }
  },
  {
    id: 'm2_samad',
    arabic: 'صَمَد',
    english: 'Eternal; Self-Sufficient',
    urdu: 'بے نیاز',
    category: WordCategory.NOUN,
    subCategory: 'Short Surahs',
    moduleId: 2,
    frequency: 1,
    exampleVerse: { arabic: 'ٱللَّهُ ٱلصَّمَدُ', english: 'Allah, the Eternal Refuge.', reference: '112:2' }
  },
  {
    id: 'm2_sharr',
    arabic: 'شَرّ',
    english: 'Evil',
    urdu: 'شر',
    category: WordCategory.NOUN,
    subCategory: 'Short Surahs',
    moduleId: 2,
    frequency: 29,
    exampleVerse: { arabic: 'مِن شَرِّ مَا خَلَقَ', english: 'From the evil of that which He created.', reference: '113:2' }
  },


  // ==========================================
  // MODULE 3: The World & The Unseen (Essential Nouns)
  // ==========================================
  
  // --- Allah & Prophets ---
  {
    id: 'm3_allah',
    arabic: 'ٱللَّٰه',
    english: 'Allah',
    urdu: 'اللہ',
    category: WordCategory.NOUN,
    subCategory: 'Allah & Prophets',
    moduleId: 3,
    frequency: 2699,
    exampleVerse: { arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', english: 'Say, He is Allah, One.', reference: '112:1' }
  },
  {
    id: 'm3_rasool',
    arabic: 'رَسُول',
    english: 'Messenger',
    urdu: 'رسول',
    category: WordCategory.NOUN,
    subCategory: 'Allah & Prophets',
    moduleId: 3,
    frequency: 332,
    exampleVerse: { arabic: 'مُحَمَّدٌ رَسُولُ ٱللَّهِ', english: 'Muhammad is the Messenger of Allah.', reference: '48:29' }
  },
  {
    id: 'm3_nabi',
    arabic: 'نَبِيّ',
    english: 'Prophet',
    urdu: 'نبی',
    category: WordCategory.NOUN,
    subCategory: 'Allah & Prophets',
    moduleId: 3,
    frequency: 75,
    exampleVerse: { arabic: 'يَٰٓأَيُّهَا ٱلنَّبِىُّ', english: 'O Prophet!', reference: 'Common' }
  },
  {
    id: 'm3_malaikah',
    arabic: 'مَلَٰٓئِكَة',
    english: 'Angels',
    urdu: 'فرشتے',
    category: WordCategory.NOUN,
    subCategory: 'Allah & Prophets',
    moduleId: 3,
    frequency: 68,
    exampleVerse: { arabic: 'وَٱلْمَلَٰٓئِكَةُ يَدْخُلُونَ', english: 'And the angels will enter.', reference: '13:23' }
  },
  {
    id: 'm3_kitab',
    arabic: 'كِتَٰب',
    english: 'Book',
    urdu: 'کتاب',
    category: WordCategory.NOUN,
    subCategory: 'Core Concepts',
    moduleId: 3,
    frequency: 260,
    exampleVerse: { arabic: 'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ فِيهِ', english: 'This is the Book about which there is no doubt.', reference: '2:2' }
  },
  {
    id: 'm3_quran',
    arabic: 'قُرْءَان',
    english: 'Quran; Reading',
    urdu: 'قرآن',
    category: WordCategory.NOUN,
    subCategory: 'Core Concepts',
    moduleId: 3,
    frequency: 70,
    exampleVerse: { arabic: 'إِنَّا جَعَلْنَٰهُ قُرْءَٰنًا عَرَبِيًّا', english: 'Indeed, We have made it an Arabic Quran.', reference: '43:3' }
  },
  {
    id: 'm3_ayah',
    arabic: 'ءَايَة',
    english: 'Sign; Verse',
    urdu: 'نشانی، آیت',
    category: WordCategory.NOUN,
    subCategory: 'Core Concepts',
    moduleId: 3,
    frequency: 382,
    exampleVerse: { arabic: 'تِلْكَ ءَايَٰتُ ٱللَّهِ', english: 'These are the verses of Allah.', reference: '2:252' }
  },

  // --- People & Groups ---
  {
    id: 'm3_insan',
    arabic: 'إِنسَٰن',
    english: 'Human/Mankind',
    urdu: 'انسان',
    category: WordCategory.NOUN,
    subCategory: 'People',
    moduleId: 3,
    frequency: 65,
    exampleVerse: { arabic: 'خَلَقَ ٱلْإِنسَٰنَ', english: 'Created man.', reference: '96:2' }
  },
  {
    id: 'm3_nas',
    arabic: 'نَاس',
    english: 'People',
    urdu: 'لوگ',
    category: WordCategory.NOUN,
    subCategory: 'People',
    moduleId: 3,
    frequency: 241,
    exampleVerse: { arabic: 'رَبِّ ٱلنَّاسِ', english: 'Lord of the people.', reference: '114:1' }
  },
  {
    id: 'm3_mumin',
    arabic: 'مُؤْمِن',
    english: 'Believer',
    urdu: 'مومن',
    category: WordCategory.NOUN,
    subCategory: 'People',
    moduleId: 3,
    frequency: 229,
    exampleVerse: { arabic: 'قَدْ أَفْلَحَ ٱلْمُؤْمِنُونَ', english: 'Certainly will the believers have succeeded.', reference: '23:1' }
  },
  {
    id: 'm3_kafir',
    arabic: 'كَافِر',
    english: 'Disbeliever',
    urdu: 'کافر',
    category: WordCategory.NOUN,
    subCategory: 'People',
    moduleId: 3,
    frequency: 134,
    exampleVerse: { arabic: 'قُلْ يَٰٓأَيُّهَا ٱلْكَٰفِرُونَ', english: 'Say, O disbelievers.', reference: '109:1' }
  },
  {
    id: 'm3_zalim',
    arabic: 'ظَالِم',
    english: 'Wrongdoer',
    urdu: 'ظالم',
    category: WordCategory.NOUN,
    subCategory: 'People',
    moduleId: 3,
    frequency: 50,
    exampleVerse: { arabic: 'وَٱللَّهُ لَا يَهْدِى ٱلْقَوْمَ ٱلظَّٰلِمِينَ', english: 'And Allah does not guide the wrongdoing people.', reference: '2:258' }
  },

  // --- Nature & Time ---
  {
    id: 'm3_ard',
    arabic: 'أَرْض',
    english: 'Earth',
    urdu: 'زمین',
    category: WordCategory.NOUN,
    subCategory: 'Nature & Time',
    moduleId: 3,
    frequency: 461,
    exampleVerse: { arabic: 'إِنِّي جَاعِلٞ فِي ٱلْأَرْضِ خَلِيفَةً', english: 'Indeed, I will make upon the earth a successive authority.', reference: '2:30' }
  },
  {
    id: 'm3_sama',
    arabic: 'سَمَاء',
    english: 'Sky/Heaven',
    urdu: 'آسمان',
    category: WordCategory.NOUN,
    subCategory: 'Nature & Time',
    moduleId: 3,
    frequency: 310,
    exampleVerse: { arabic: 'خَلَقَ ٱلسَّمَٰوَٰتِ', english: 'Created the heavens.', reference: '31:10' }
  },
  {
    id: 'm3_shams',
    arabic: 'شَمْس',
    english: 'Sun',
    urdu: 'سورج',
    category: WordCategory.NOUN,
    subCategory: 'Nature & Time',
    moduleId: 3,
    frequency: 33,
    exampleVerse: { arabic: 'وَٱلشَّمْسِ وَضُحَىٰهَا', english: 'By the sun and its brightness.', reference: '91:1' }
  },
  {
    id: 'm3_qamar',
    arabic: 'قَمَر',
    english: 'Moon',
    urdu: 'چاند',
    category: WordCategory.NOUN,
    subCategory: 'Nature & Time',
    moduleId: 3,
    frequency: 27,
    exampleVerse: { arabic: 'وَٱلْقَمَرِ إِذَا تَلَىٰهَا', english: 'And the moon when it follows it.', reference: '91:2' }
  },
  {
    id: 'm3_yawm',
    arabic: 'يَوْم',
    english: 'Day',
    urdu: 'دن',
    category: WordCategory.NOUN,
    subCategory: 'Nature & Time',
    moduleId: 3,
    frequency: 475,
    exampleVerse: { arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ', english: 'Master of the Day of Judgment.', reference: '1:4' }
  },
  {
    id: 'm3_layl',
    arabic: 'لَيْل',
    english: 'Night',
    urdu: 'رات',
    category: WordCategory.NOUN,
    subCategory: 'Nature & Time',
    moduleId: 3,
    frequency: 92,
    exampleVerse: { arabic: 'وَٱلَّيْلِ إِذَا يَغْشَىٰ', english: 'By the night when it covers.', reference: '92:1' }
  },
  {
    id: 'm3_nahar',
    arabic: 'نَهَار',
    english: 'Day (Daytime)',
    urdu: 'دن',
    category: WordCategory.NOUN,
    subCategory: 'Nature & Time',
    moduleId: 3,
    frequency: 57,
    exampleVerse: { arabic: 'وَٱلنَّهَارِ إِذَا تَجَلَّىٰ', english: 'And by the day when it appears.', reference: '92:2' }
  },

  // --- Afterlife ---
  {
    id: 'm3_dunya',
    arabic: 'دُنْيَا',
    english: 'World',
    urdu: 'دنیا',
    category: WordCategory.NOUN,
    subCategory: 'Afterlife',
    moduleId: 3,
    frequency: 115,
    exampleVerse: { arabic: 'فِي ٱلدُّنْيَا حَسَنَةً', english: 'Good in this world.', reference: '2:201' }
  },
  {
    id: 'm3_akhirah',
    arabic: 'آخِرَة',
    english: 'Hereafter',
    urdu: 'آخرت',
    category: WordCategory.NOUN,
    subCategory: 'Afterlife',
    moduleId: 3,
    frequency: 115,
    exampleVerse: { arabic: 'وَبِٱلْآخِرَةِ هُمْ يُوقِنُونَ', english: 'And of the Hereafter they are certain.', reference: '2:4' }
  },
  {
    id: 'm3_jannah',
    arabic: 'جَنَّة',
    english: 'Garden; Paradise',
    urdu: 'جنت',
    category: WordCategory.NOUN,
    subCategory: 'Afterlife',
    moduleId: 3,
    frequency: 147,
    exampleVerse: { arabic: 'لَهُمْ جَنَّٰتٌ تَجْرِى', english: 'For them are gardens beneath which rivers flow.', reference: '85:11' }
  },
  {
    id: 'm3_nar',
    arabic: 'نَار',
    english: 'Fire',
    urdu: 'آگ',
    category: WordCategory.NOUN,
    subCategory: 'Afterlife',
    moduleId: 3,
    frequency: 145,
    exampleVerse: { arabic: 'نَارُ ٱللَّهِ ٱلْمُوقَدَةُ', english: 'It is the fire of Allah, fueled.', reference: '104:6' }
  },
  {
    id: 'm3_adhab',
    arabic: 'عَذَاب',
    english: 'Punishment',
    urdu: 'عذاب',
    category: WordCategory.NOUN,
    subCategory: 'Afterlife',
    moduleId: 3,
    frequency: 373,
    exampleVerse: { arabic: 'وَلَهُمْ عَذَابٌ عَظِيمٌ', english: 'And for them is a great punishment.', reference: '2:7' }
  },
  {
    id: 'm3_ajr',
    arabic: 'أَجْر',
    english: 'Reward',
    urdu: 'اجر',
    category: WordCategory.NOUN,
    subCategory: 'Afterlife',
    moduleId: 3,
    frequency: 105,
    exampleVerse: { arabic: 'لَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ', english: 'For them is their reward with their Lord.', reference: '2:62' }
  },


  // ==========================================
  // MODULE 4: Quranic Actions (Verbs)
  // ==========================================

  // --- Pattern F-T-H (Fataha) ---
  {
    id: 'm4_fataha',
    arabic: 'فَتَحَ',
    english: 'He opened',
    urdu: 'اس نے کھولا',
    category: WordCategory.VERB,
    subCategory: 'Pattern F-T-H',
    moduleId: 4,
    root: 'ف ت ح',
    frequency: 38,
    exampleVerse: { arabic: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا', english: 'Indeed, We have given you a clear conquest.', reference: '48:1' }
  },
  {
    id: 'm4_jaala',
    arabic: 'جَعَلَ',
    english: 'He made',
    urdu: 'اس نے بنایا',
    category: WordCategory.VERB,
    subCategory: 'Pattern F-T-H',
    moduleId: 4,
    root: 'ج ع ل',
    frequency: 346,
    exampleVerse: { arabic: 'جَعَلَ لَكُمُ ٱلْأَرْضَ فِرَٰشًا', english: 'Who made for you the earth a bed.', reference: '2:22' }
  },
  {
    id: 'm4_faala',
    arabic: 'فَعَلَ',
    english: 'He did',
    urdu: 'اس نے کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern F-T-H',
    moduleId: 4,
    root: 'ف ع ل',
    frequency: 108,
    exampleVerse: { arabic: 'كَيْفَ فَعَلَ رَبُّكَ', english: 'How your Lord dealt...', reference: '105:1' }
  },
  {
    id: 'm4_zahaba',
    arabic: 'ذَهَبَ',
    english: 'He went',
    urdu: 'وہ گیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern F-T-H',
    moduleId: 4,
    root: 'ذ ه ب',
    frequency: 100, // Approx
    exampleVerse: { arabic: 'ذَهَبَ ٱللَّهُ بِنُورِهِمْ', english: 'Allah took away their light.', reference: '2:17' }
  },

  // --- Pattern N-S-R (Nasara) ---
  {
    id: 'm4_nasara',
    arabic: 'نَصَرَ',
    english: 'He helped',
    urdu: 'اس نے مدد کی',
    category: WordCategory.VERB,
    subCategory: 'Pattern N-S-R',
    moduleId: 4,
    root: 'ن ص ر',
    frequency: 92,
    exampleVerse: { arabic: 'وَلَقَدْ نَصَرَكُمُ ٱللَّهُ', english: 'And Allah had already given you victory.', reference: '3:123' }
  },
  {
    id: 'm4_khalaqa',
    arabic: 'خَلَقَ',
    english: 'He created',
    urdu: 'اس نے پیدا کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern N-S-R',
    moduleId: 4,
    root: 'خ ل ق',
    frequency: 248,
    exampleVerse: { arabic: 'خَلَقَكُم مِّن نَّفْسٍ وَٰحِدَةٍ', english: 'Created you from one soul.', reference: '39:6' }
  },
  {
    id: 'm4_abada',
    arabic: 'عَبَدَ',
    english: 'He worshipped',
    urdu: 'اس نے عبادت کی',
    category: WordCategory.VERB,
    subCategory: 'Pattern N-S-R',
    moduleId: 4,
    root: 'ع ب د',
    frequency: 143,
    exampleVerse: { arabic: 'ٱعْبُدُوا۟ رَبَّكُمُ', english: 'Worship your Lord.', reference: '2:21' }
  },
  {
    id: 'm4_dhakara',
    arabic: 'ذَكَرَ',
    english: 'He remembered',
    urdu: 'اس نے ذکر کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern N-S-R',
    moduleId: 4,
    root: 'ذ ك ر',
    frequency: 292,
    exampleVerse: { arabic: 'فَٱذْكُرُوا۟ ٱللَّهَ', english: 'So remember Allah.', reference: '2:198' }
  },
  {
    id: 'm4_kafara',
    arabic: 'كَفَرَ',
    english: 'He disbelieved',
    urdu: 'اس نے کفر کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern N-S-R',
    moduleId: 4,
    root: 'ك ف ر',
    frequency: 289,
    exampleVerse: { arabic: 'وَمَن يَكْفُرْ بِٱللَّهِ', english: 'And whoever disbelieves in Allah...', reference: '2:256' }
  },

  // --- Pattern D-R-B (Daraba) ---
  {
    id: 'm4_daraba',
    arabic: 'ضَرَبَ',
    english: 'He struck/set forth',
    urdu: 'اس نے مارا/بیان کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern D-R-B',
    moduleId: 4,
    root: 'ض ر ب',
    frequency: 58,
    exampleVerse: { arabic: 'ضَرَبَ ٱللَّهُ مَثَلًا', english: 'Allah presents an example.', reference: '14:24' }
  },
  {
    id: 'm4_zalama',
    arabic: 'ظَلَمَ',
    english: 'He wronged',
    urdu: 'اس نے ظلم کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern D-R-B',
    moduleId: 4,
    root: 'ظ ل م',
    frequency: 266,
    exampleVerse: { arabic: 'وَمَا ظَلَمْنَٰهُمْ', english: 'And We did not wrong them.', reference: '43:76' }
  },
  {
    id: 'm4_sabara',
    arabic: 'صَبَرَ',
    english: 'He was patient',
    urdu: 'اس نے صبر کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern D-R-B',
    moduleId: 4,
    root: 'ص ب ر',
    frequency: 103,
    exampleVerse: { arabic: 'وَٱصْبِرْ عَلَىٰ مَا يَقُولُونَ', english: 'And be patient over what they say.', reference: '73:10' }
  },

  // --- Pattern S-M-A (Samia) ---
  {
    id: 'm4_samia',
    arabic: 'سَمِعَ',
    english: 'He heard',
    urdu: 'اس نے سنا',
    category: WordCategory.VERB,
    subCategory: 'Pattern S-M-A',
    moduleId: 4,
    root: 'س م ع',
    frequency: 185,
    exampleVerse: { arabic: 'سَمِعْنَا وَأَطَعْنَا', english: 'We hear and we obey.', reference: '2:285' }
  },
  {
    id: 'm4_alima',
    arabic: 'عَلِمَ',
    english: 'He knew',
    urdu: 'وہ جان گیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern S-M-A',
    moduleId: 4,
    root: 'ع ل م',
    frequency: 382,
    exampleVerse: { arabic: 'وَٱللَّهُ يَعْلَمُ', english: 'And Allah knows.', reference: '2:220' }
  },
  {
    id: 'm4_amila',
    arabic: 'عَمِلَ',
    english: 'He worked',
    urdu: 'اس نے عمل کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern S-M-A',
    moduleId: 4,
    root: 'ع م ل',
    frequency: 360,
    exampleVerse: { arabic: 'وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ', english: 'And done righteous deeds.', reference: '2:25' }
  },
  {
    id: 'm4_rahima',
    arabic: 'رَحِمَ',
    english: 'He had mercy',
    urdu: 'اس نے رحم کیا',
    category: WordCategory.VERB,
    subCategory: 'Pattern S-M-A',
    moduleId: 4,
    root: 'ر ح م',
    frequency: 339,
    exampleVerse: { arabic: 'إِلَّا مَن رَّحِمَ رَبُّكَ', english: 'Except whom your Lord has given mercy.', reference: '11:119' }
  },

  // --- Weak Verbs & Others ---
  {
    id: 'm4_qala',
    arabic: 'قَالَ',
    english: 'He said',
    urdu: 'اس نے کہا',
    category: WordCategory.VERB,
    subCategory: 'Weak Verbs',
    moduleId: 4,
    root: 'ق و ل',
    frequency: 1722,
    exampleVerse: { arabic: 'قَالَ إِنِّى عَبْدُ ٱللَّهِ', english: 'He said, Indeed, I am the servant of Allah.', reference: '19:30' }
  },
  {
    id: 'm4_kana',
    arabic: 'كَانَ',
    english: 'He was',
    urdu: 'وہ تھا',
    category: WordCategory.VERB,
    subCategory: 'Weak Verbs',
    moduleId: 4,
    root: 'ك و ن',
    frequency: 1358,
    exampleVerse: { arabic: 'وَكَانَ ٱللَّهُ عَلِيمًا', english: 'And Allah is ever Knowing.', reference: '4:17' }
  },
  {
    id: 'm4_taba',
    arabic: 'تَابَ',
    english: 'He repented',
    urdu: 'اس نے توبہ کی',
    category: WordCategory.VERB,
    subCategory: 'Weak Verbs',
    moduleId: 4,
    root: 'ت و ب',
    frequency: 87,
    exampleVerse: { arabic: 'فَتَابَ عَلَيْهِ', english: 'So He accepted his repentance.', reference: '2:37' }
  },
  {
    id: 'm4_zada',
    arabic: 'زَادَ',
    english: 'He increased',
    urdu: 'اس نے زیادہ کیا',
    category: WordCategory.VERB,
    subCategory: 'Weak Verbs',
    moduleId: 4,
    root: 'ز ي د',
    frequency: 49,
    exampleVerse: { arabic: 'فَزَادَهُمُ ٱللَّهُ مَرَضًا', english: 'So Allah increased them in disease.', reference: '2:10' }
  },
  {
    id: 'm4_raa',
    arabic: 'رَأَىٰ',
    english: 'He saw',
    urdu: 'اس نے دیکھا',
    category: WordCategory.VERB,
    subCategory: 'Weak Verbs',
    moduleId: 4,
    root: 'ر أ ي',
    frequency: 328,
    exampleVerse: { arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ', english: 'Have you not seen how your Lord dealt?', reference: '105:1' }
  },
  {
    id: 'm4_shaa',
    arabic: 'شَآءَ',
    english: 'He willed',
    urdu: 'اس نے چاہا',
    category: WordCategory.VERB,
    subCategory: 'Weak Verbs',
    moduleId: 4,
    root: 'ش ي أ',
    frequency: 236,
    exampleVerse: { arabic: 'يَهْدِى مَن يَشَآءُ', english: 'He guides whom He wills.', reference: '2:142' }
  },
  {
    id: 'm4_jaa',
    arabic: 'جَآءَ',
    english: 'He came',
    urdu: 'وہ آیا',
    category: WordCategory.VERB,
    subCategory: 'Weak Verbs',
    moduleId: 4,
    root: 'ج ي أ',
    frequency: 278,
    exampleVerse: { arabic: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ', english: 'When the victory of Allah comes.', reference: '110:1' }
  },

  // ==========================================
  // MODULE 5: Connectors & Core Concepts
  // ==========================================

  // --- Prepositions of Place/Time ---
  {
    id: 'm5_ma',
    arabic: 'مَعَ',
    english: 'With',
    urdu: 'ساتھ',
    category: WordCategory.PARTICLE,
    subCategory: 'Place & Time',
    moduleId: 5,
    frequency: 160,
    exampleVerse: { arabic: 'إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ', english: 'Indeed, Allah is with the patient.', reference: '2:153' }
  },
  {
    id: 'm5_inda',
    arabic: 'عِندَ',
    english: 'With/At/Near',
    urdu: 'پاس',
    category: WordCategory.PARTICLE,
    subCategory: 'Place & Time',
    moduleId: 5,
    frequency: 200,
    exampleVerse: { arabic: 'لَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ', english: 'For them is their reward with their Lord.', reference: '2:62' }
  },
  {
    id: 'm5_qabla',
    arabic: 'قَبْلَ',
    english: 'Before',
    urdu: 'پہلے',
    category: WordCategory.PARTICLE,
    subCategory: 'Place & Time',
    moduleId: 5,
    frequency: 240,
    exampleVerse: { arabic: 'مِن قَبْلِكُمْ', english: 'From before you.', reference: '2:21' }
  },
  {
    id: 'm5_baada',
    arabic: 'بَعْدَ',
    english: 'After',
    urdu: 'بعد',
    category: WordCategory.PARTICLE,
    subCategory: 'Place & Time',
    moduleId: 5,
    frequency: 230,
    exampleVerse: { arabic: 'مِنۢ بَعْدِ مَا جَآءَتْهُمُ', english: 'After there came to them...', reference: '2:213' }
  },
  {
    id: 'm5_bayna',
    arabic: 'بَيْنَ',
    english: 'Between',
    urdu: 'درمیان',
    category: WordCategory.PARTICLE,
    subCategory: 'Place & Time',
    moduleId: 5,
    frequency: 150,
    exampleVerse: { arabic: 'بَيْنَ أَيْدِيهِمْ', english: 'Between their hands (before them).', reference: '2:255' }
  },
  {
    id: 'm5_tahta',
    arabic: 'تَحْتَ',
    english: 'Under',
    urdu: 'نیچے',
    category: WordCategory.PARTICLE,
    subCategory: 'Place & Time',
    moduleId: 5,
    frequency: 50,
    exampleVerse: { arabic: 'تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ', english: 'Rivers flow beneath them.', reference: '2:25' }
  },

  // --- Logical Particles ---
  {
    id: 'm5_in',
    arabic: 'إِنْ',
    english: 'If (or Not)',
    urdu: 'اگر (یا نہیں)',
    category: WordCategory.PARTICLE,
    subCategory: 'Logical Particles',
    moduleId: 5,
    frequency: 600,
    exampleVerse: { arabic: 'إِن كُنتُمْ صَٰدِقِينَ', english: 'If you are truthful.', reference: '2:23' }
  },
  {
    id: 'm5_idha',
    arabic: 'إِذَا',
    english: 'When/If',
    urdu: 'جب',
    category: WordCategory.PARTICLE,
    subCategory: 'Logical Particles',
    moduleId: 5,
    frequency: 400,
    exampleVerse: { arabic: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ', english: 'When the victory of Allah comes.', reference: '110:1' }
  },
  {
    id: 'm5_anna',
    arabic: 'أَنَّ',
    english: 'That',
    urdu: 'کہ بے شک',
    category: WordCategory.PARTICLE,
    subCategory: 'Logical Particles',
    moduleId: 5,
    frequency: 350,
    exampleVerse: { arabic: 'وَٱعْلَمُوٓا۟ أَنَّ ٱللَّهَ', english: 'And know that Allah...', reference: '2:231' }
  },
  {
    id: 'm5_lam',
    arabic: 'لَمْ',
    english: 'Did not',
    urdu: 'نہیں (ماضی)',
    category: WordCategory.PARTICLE,
    subCategory: 'Logical Particles',
    moduleId: 5,
    frequency: 300,
    exampleVerse: { arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', english: 'He did not beget and was not begotten.', reference: '112:3' }
  },
  {
    id: 'm5_lan',
    arabic: 'لَنْ',
    english: 'Will not',
    urdu: 'ہرگز نہیں',
    category: WordCategory.PARTICLE,
    subCategory: 'Logical Particles',
    moduleId: 5,
    frequency: 100,
    exampleVerse: { arabic: 'لَن يَدْخُلَ ٱلْجَنَّةَ', english: 'Will never enter Paradise.', reference: '2:111' }
  },
  {
    id: 'm5_illa',
    arabic: 'إِلَّا',
    english: 'Except',
    urdu: 'مگر / سوائے',
    category: WordCategory.PARTICLE,
    subCategory: 'Logical Particles',
    moduleId: 5,
    frequency: 650,
    exampleVerse: { arabic: 'وَمَا يُضِلُّونَ إِلَّآ أَنفُسَهُمْ', english: 'And they do not mislead except themselves.', reference: '3:69' }
  },

  // --- Abstract Nouns & Body ---
  {
    id: 'm5_kull',
    arabic: 'كُلّ',
    english: 'All; Every',
    urdu: 'سب؛ ہر',
    category: WordCategory.NOUN,
    subCategory: 'General Nouns',
    moduleId: 5,
    frequency: 350,
    exampleVerse: { arabic: 'وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ', english: 'And He is over all things competent.', reference: '67:1' }
  },
  {
    id: 'm5_haqq',
    arabic: 'حَقّ',
    english: 'Truth; Right',
    urdu: 'حق',
    category: WordCategory.NOUN,
    subCategory: 'General Nouns',
    moduleId: 5,
    frequency: 247,
    exampleVerse: { arabic: 'ذَٰلِكَ بِأَنَّ ٱللَّهَ هُوَ ٱلْحَقُّ', english: 'That is because Allah is the Truth.', reference: '22:6' }
  },
  {
    id: 'm5_qalb',
    arabic: 'قَلْب',
    english: 'Heart',
    urdu: 'دل',
    category: WordCategory.NOUN,
    subCategory: 'Body & Soul',
    moduleId: 5,
    frequency: 130,
    exampleVerse: { arabic: 'خَتَمَ ٱللَّهُ عَلَىٰ قُلُوبِهِمْ', english: 'Allah has set a seal upon their hearts.', reference: '2:7' }
  },
  {
    id: 'm5_nafs',
    arabic: 'نَفْس',
    english: 'Soul; Self',
    urdu: 'جان؛ نفس',
    category: WordCategory.NOUN,
    subCategory: 'Body & Soul',
    moduleId: 5,
    frequency: 295,
    exampleVerse: { arabic: 'وَلَا تُكَلَّفُ نَفْسٌ', english: 'And no soul is burdened.', reference: '2:233' }
  },
  {
    id: 'm5_amr',
    arabic: 'أَمْر',
    english: 'Command; Matter',
    urdu: 'حکم؛ معاملہ',
    category: WordCategory.NOUN,
    subCategory: 'General Nouns',
    moduleId: 5,
    frequency: 170,
    exampleVerse: { arabic: 'أَلَآ إِلَى ٱللَّهِ تَصِيرُ ٱلْأُمُورُ', english: 'Unquestionably, to Allah do [all] matters evolve.', reference: '42:53' }
  }
];