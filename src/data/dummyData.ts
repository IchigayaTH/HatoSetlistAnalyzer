import { Member, Song, Event, Setlist } from '@/types';

// ダミーメンバーデータ (16人)
export const dummyMembers: Member[] = [
  {
    id: '1',
    name: 'Mint',
    nameJa: 'ミント',
    birthDate: '2001-03-15',
    joinDate: '2019-06-01',
    status: 'active'
  },
  {
    id: '2',
    name: 'Som',
    nameJa: 'ソム',
    birthDate: '2002-07-22',
    joinDate: '2019-06-01',
    status: 'active'
  },
  {
    id: '3',
    name: 'Ploy',
    nameJa: 'プロイ',
    birthDate: '2003-01-10',
    joinDate: '2020-01-15',
    status: 'active'
  },
  {
    id: '4',
    name: 'Nueng',
    nameJa: 'ヌエン',
    birthDate: '2001-11-28',
    joinDate: '2019-06-01',
    status: 'active'
  },
  {
    id: '5',
    name: 'May',
    nameJa: 'メイ',
    birthDate: '2002-05-12',
    joinDate: '2020-03-10',
    status: 'active'
  },
  {
    id: '6',
    name: 'Ann',
    nameJa: 'アン',
    birthDate: '2003-08-30',
    joinDate: '2020-06-01',
    status: 'active'
  },
  {
    id: '7',
    name: 'Nana',
    nameJa: 'ナナ',
    birthDate: '2002-02-14',
    joinDate: '2021-01-20',
    status: 'active'
  },
  {
    id: '8',
    name: 'Mook',
    nameJa: 'ムック',
    birthDate: '2003-09-05',
    joinDate: '2021-06-01',
    status: 'active'
  },
  {
    id: '9',
    name: 'Jazz',
    nameJa: 'ジャズ',
    birthDate: '2002-12-20',
    joinDate: '2021-09-15',
    status: 'active'
  },
  {
    id: '10',
    name: 'Kung',
    nameJa: 'クン',
    birthDate: '2003-04-08',
    joinDate: '2022-03-01',
    status: 'active'
  },
  {
    id: '11',
    name: 'Tae',
    nameJa: 'テー',
    birthDate: '2001-10-17',
    joinDate: '2022-06-01',
    status: 'active'
  },
  {
    id: '12',
    name: 'Gift',
    nameJa: 'ギフト',
    birthDate: '2002-06-25',
    joinDate: '2022-09-10',
    status: 'active'
  },
  {
    id: '13',
    name: 'Kob',
    nameJa: 'コップ',
    birthDate: '2003-11-03',
    joinDate: '2023-01-15',
    status: 'active'
  },
  {
    id: '14',
    name: 'Boom',
    nameJa: 'ブーム',
    birthDate: '2002-08-11',
    joinDate: '2023-04-01',
    status: 'active'
  },
  {
    id: '15',
    name: 'Champ',
    nameJa: 'チャンプ',
    birthDate: '2003-03-19',
    joinDate: '2023-07-01',
    status: 'active'
  },
  {
    id: '16',
    name: 'Peach',
    nameJa: 'ピーチ',
    birthDate: '2002-09-27',
    joinDate: '2023-10-01',
    status: 'active'
  }
];

// ダミー楽曲データ
export const dummySongs: Song[] = [
  {
    id: 's1',
    title: 'Hato Bito Love',
    titleJa: 'ハトビトラブ',
    releaseDate: '2021-01-15',
    duration: 240,
    defaultSelectMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  },
  {
    id: 's2',
    title: 'Flying Together',
    titleJa: 'フライング トゥゲザー',
    releaseDate: '2021-06-10',
    duration: 220,
    defaultSelectMembers: ['1', '2', '4', '5', '7', '9', '11', '13', '15']
  },
  {
    id: 's3',
    title: 'Neon Dreams',
    titleJa: 'ネオン ドリームズ',
    releaseDate: '2022-02-20',
    duration: 260,
    defaultSelectMembers: ['2', '3', '5', '6', '8', '10', '12', '14', '16']
  },
  {
    id: 's4',
    title: 'Sakura Nights',
    titleJa: 'サクラ ナイツ',
    releaseDate: '2022-08-15',
    duration: 250,
    defaultSelectMembers: ['1', '3', '4', '6', '7', '9', '11', '13', '14']
  },
  {
    id: 's5',
    title: 'Electric Hearts',
    titleJa: 'エレクトリック ハーツ',
    releaseDate: '2023-01-10',
    duration: 230,
    defaultSelectMembers: ['1', '2', '3', '5', '8', '10', '12', '15', '16']
  },
  {
    id: 's6',
    title: 'Midnight Bell',
    titleJa: 'ミッドナイト ベル',
    releaseDate: '2023-06-05',
    duration: 270,
    defaultSelectMembers: ['2', '4', '5', '6', '7', '9', '11', '13', '16']
  },
  {
    id: 's7',
    title: 'Summer Rainbow',
    titleJa: 'サマー レインボー',
    releaseDate: '2023-12-01',
    duration: 245,
    defaultSelectMembers: ['1', '3', '4', '5', '6', '8', '10', '14', '15']
  },
  {
    id: 's8',
    title: 'Eternal Promise',
    titleJa: 'エターナル プロミス',
    duration: 255,
    defaultSelectMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  }
];

// ダミーイベントデータ
export const dummyEvents: Event[] = [
  {
    id: 'e1',
    date: '2024-01-15',
    name: 'Hato Bito Live vol.1',
    venue: 'Bangkok Studio',
    participatingMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
  },
  {
    id: 'e2',
    date: '2024-02-20',
    name: 'Valentine Special',
    venue: 'Thailand Concert Hall',
    participatingMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
  },
  {
    id: 'e3',
    date: '2024-03-10',
    name: 'Spring Showcase',
    venue: 'Bangkok Studio',
    participatingMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
  },
  {
    id: 'e4',
    date: '2024-04-25',
    name: 'Summer Festival',
    venue: 'Central World Plaza',
    participatingMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  {
    id: 'e5',
    date: '2024-05-30',
    name: 'Charity Live',
    venue: 'Bangkok Studio',
    participatingMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
  }
];

// ダミーセットリストデータ
export const dummySetlists: Setlist[] = [
  {
    id: 'sl1',
    eventId: 'e1',
    songs: [
      {
        songId: 's1',
        selectedMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      },
      {
        songId: 's2',
        selectedMembers: ['1', '2', '4', '5', '7', '9', '11', '13', '15']
      },
      {
        songId: 's4',
        selectedMembers: ['1', '3', '4', '6', '7', '9', '11', '13', '14']
      },
      {
        songId: 's5',
        selectedMembers: ['1', '2', '3', '5', '8', '10', '12', '15', '16']
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'sl2',
    eventId: 'e2',
    songs: [
      {
        songId: 's1',
        selectedMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      },
      {
        songId: 's3',
        selectedMembers: ['2', '3', '5', '6', '8', '10', '12', '14'],
        notes: 'Mint出演'
      },
      {
        songId: 's6',
        selectedMembers: ['2', '4', '5', '6', '7', '9', '11', '13', '16']
      },
      {
        songId: 's7',
        selectedMembers: ['1', '3', '4', '5', '6', '8', '10', '14', '15']
      }
    ],
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 'sl3',
    eventId: 'e3',
    songs: [
      {
        songId: 's2',
        selectedMembers: ['1', '2', '4', '5', '7', '9', '11', '13', '15']
      },
      {
        songId: 's4',
        selectedMembers: ['1', '3', '4', '6', '7', '9', '11', '13', '14']
      },
      {
        songId: 's5',
        selectedMembers: ['1', '2', '3', '5', '8', '10', '12', '15', '16']
      },
      {
        songId: 's8',
        selectedMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      }
    ],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 'sl4',
    eventId: 'e4',
    songs: [
      {
        songId: 's1',
        selectedMembers: ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      },
      {
        songId: 's3',
        selectedMembers: ['2', '3', '5', '6', '8', '10', '12', '14', '16']
      },
      {
        songId: 's5',
        selectedMembers: ['1', '2', '3', '5', '8', '10', '12', '15']
      }
    ],
    createdAt: '2024-04-25T10:00:00Z',
    updatedAt: '2024-04-25T10:00:00Z'
  },
  {
    id: 'sl5',
    eventId: 'e5',
    songs: [
      {
        songId: 's2',
        selectedMembers: ['1', '2', '4', '5', '7', '9', '11', '13', '14']
      },
      {
        songId: 's4',
        selectedMembers: ['1', '3', '4', '6', '7', '9', '11', '12', '14']
      },
      {
        songId: 's6',
        selectedMembers: ['2', '4', '5', '6', '7', '9', '11', '13', '16']
      },
      {
        songId: 's7',
        selectedMembers: ['1', '3', '4', '5', '6', '8', '10', '14', '15']
      }
    ],
    createdAt: '2024-05-30T10:00:00Z',
    updatedAt: '2024-05-30T10:00:00Z'
  }
];
