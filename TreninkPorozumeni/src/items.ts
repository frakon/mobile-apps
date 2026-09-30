// Data model for the "two pictures, one sentence" comprehension game.
// Requested in _TreninkPorozumeni_SPEC.md (section "Items").
// Asset naming contract: assets/audio/<id>_a.mp3|<id>_b.mp3, assets/images/<id>_a.png|<id>_b.png.

import { AudioSource } from 'expo-audio';
import { ImageSourcePropType } from 'react-native';

export interface ComprehensionItem {
  id: string;
  sentenceA: string;
  sentenceB: string;
  audioA: AudioSource;
  audioB: AudioSource;
  imageA: ImageSourcePropType;
  imageB: ImageSourcePropType;
}

export const comprehensionItems: ComprehensionItem[] = [
  {
    id: 'kosa',
    sentenceA: 'Jel s kosou.',
    sentenceB: 'Jel s kozou.',
    audioA: require('../assets/audio/kosa_a.mp3'),
    audioB: require('../assets/audio/kosa_b.mp3'),
    imageA: require('../assets/images/kosa_a.png'),
    imageB: require('../assets/images/kosa_b.png'),
  },
  {
    id: 'honi',
    sentenceA: 'Bratr honí sestru.',
    sentenceB: 'Sestra honí bratra.',
    audioA: require('../assets/audio/honi_a.mp3'),
    audioB: require('../assets/audio/honi_b.mp3'),
    imageA: require('../assets/images/honi_a.png'),
    imageB: require('../assets/images/honi_b.png'),
  },
  {
    id: 'tlaci',
    sentenceA: 'Medvěd tlačí lva.',
    sentenceB: 'Lev tlačí medvěda.',
    audioA: require('../assets/audio/tlaci_a.mp3'),
    audioB: require('../assets/audio/tlaci_b.mp3'),
    imageA: require('../assets/images/tlaci_a.png'),
    imageB: require('../assets/images/tlaci_b.png'),
  },
  {
    id: 'vysetruje',
    sentenceA: 'Doktor vyšetřuje pacienta.',
    sentenceB: 'Pacient vyšetřuje doktora.',
    audioA: require('../assets/audio/vysetruje_a.mp3'),
    audioB: require('../assets/audio/vysetruje_b.mp3'),
    imageA: require('../assets/images/vysetruje_a.png'),
    imageB: require('../assets/images/vysetruje_b.png'),
  },
  {
    id: 'cese',
    sentenceA: 'Holčička češe maminku.',
    sentenceB: 'Maminka češe holčičku.',
    audioA: require('../assets/audio/cese_a.mp3'),
    audioB: require('../assets/audio/cese_b.mp3'),
    imageA: require('../assets/images/cese_a.png'),
    imageB: require('../assets/images/cese_b.png'),
  },
  {
    id: 'preskakuje',
    sentenceA: 'Kůň přeskakuje krávu.',
    sentenceB: 'Kráva přeskakuje koně.',
    audioA: require('../assets/audio/preskakuje_a.mp3'),
    audioB: require('../assets/audio/preskakuje_b.mp3'),
    imageA: require('../assets/images/preskakuje_a.png'),
    imageB: require('../assets/images/preskakuje_b.png'),
  },
  {
    id: 'fotografuje',
    sentenceA: 'Kluk fotografuje dědečka.',
    sentenceB: 'Dědeček fotografuje kluka.',
    audioA: require('../assets/audio/fotografuje_a.mp3'),
    audioB: require('../assets/audio/fotografuje_b.mp3'),
    imageA: require('../assets/images/fotografuje_a.png'),
    imageB: require('../assets/images/fotografuje_b.png'),
  },
  {
    id: 'skrabe',
    sentenceA: 'Kočka škrábe psa.',
    sentenceB: 'Pes škrábe kočku.',
    audioA: require('../assets/audio/skrabe_a.mp3'),
    audioB: require('../assets/audio/skrabe_b.mp3'),
    imageA: require('../assets/images/skrabe_a.png'),
    imageB: require('../assets/images/skrabe_b.png'),
  },
  {
    id: 'vede',
    sentenceA: 'Policista vede zloděje.',
    sentenceB: 'Zloděj vede policistu.',
    audioA: require('../assets/audio/vede_a.mp3'),
    audioB: require('../assets/audio/vede_b.mp3'),
    imageA: require('../assets/images/vede_a.png'),
    imageB: require('../assets/images/vede_b.png'),
  },
  {
    id: 'zachranuje',
    sentenceA: 'Princ zachraňuje princeznu.',
    sentenceB: 'Princezna zachraňuje prince.',
    audioA: require('../assets/audio/zachranuje_a.mp3'),
    audioB: require('../assets/audio/zachranuje_b.mp3'),
    imageA: require('../assets/images/zachranuje_a.png'),
    imageB: require('../assets/images/zachranuje_b.png'),
  },
  {
    id: 'chvali',
    sentenceA: 'Učitel chválí žáka.',
    sentenceB: 'Žák chválí učitele.',
    audioA: require('../assets/audio/chvali_a.mp3'),
    audioB: require('../assets/audio/chvali_b.mp3'),
    imageA: require('../assets/images/chvali_a.png'),
    imageB: require('../assets/images/chvali_b.png'),
  },
];
