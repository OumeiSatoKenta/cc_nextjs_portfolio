import type { Education } from '@/types';

export const educations: Education[] = [
  {
    type: 'degree',
    title: '博士課程後期 満期退学',
    institution: '名古屋大学 大学院',
    date: '2021-03',
    description:
      '修士課程では RHICf 実験におけるデータ取得システムの開発を研究テーマとし、FPGA 内の信号処理ロジックの開発、および米国ブルックヘブン国立研究所での配線作業を含むデータ取得システムの構築・オペレーションを経験。博士課程ではモンテカルロシミュレーションデータから検出効率や他粒子の混入率から補正係数を算出し、実測データを補正する解析を行った。これらの経験がインフラへの興味・素養、プログラミングおよび数値を扱うデータ分析の下地となっている。',
  },
  {
    type: 'publication',
    title:
      'The energy spectrum of forward photons measured by the RHICf experiment in √s = 510 GeV proton-proton collisions',
    institution: 'Proceedings of Science (ICRC2019)',
    date: '2021',
    description:
      '筆頭著者。国際宇宙線会議 ICRC2019 にて RHICf 実験の前方光子エネルギースペクトル測定結果を発表。DOI: 10.22323/1.358.0413',
  },
];
