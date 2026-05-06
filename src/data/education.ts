import type { Education, EducationImage } from '@/types';

/**
 * 学歴セクション最上部に常時表示するヒーロー画像。アコーディオンに隠さず、
 * 研究背景のインパクトを最初に伝えるためトップへ配置する。
 */
export const educationHero: EducationImage[] = [
  {
    src: '/images/projects/collider_experiment_image.png',
    alt: '粒子加速器衝突実験のイメージ図',
    caption: '粒子加速器衝突実験のイメージ図',
  },
  {
    src: '/images/projects/cosmic_ray_air_shower.png',
    alt: '宇宙線空気シャワー',
    caption: '宇宙線が大気中で引き起こす空気シャワーのイメージ',
  },
];

export const educations: Education[] = [
  {
    type: 'degree',
    title: '名古屋大学 理学部 物理学科 卒業',
    institution: '名古屋大学',
    date: '2016-03',
  },
  {
    type: 'degree',
    title: '名古屋大学 大学院 理学研究科 修士課程・博士課程後期',
    institution: '名古屋大学 大学院',
    date: '2021-03',
    description:
      '2018 年 3 月に修士課程修了（理学修士取得）、2021 年 3 月に博士課程後期を満期退学。修士から博士まで一貫して RHICf 実験を研究テーマとし、データ取得システムの開発と実測データの解析を担当。これらの経験がインフラへの興味・素養、プログラミングおよび数値を扱うデータ分析の下地となっている。',
    details:
      '修士課程では RHICf 実験におけるデータ取得システムの開発を研究テーマとし、FPGA 内の信号処理ロジックの開発、および米国ブルックヘブン国立研究所での配線作業を含むデータ取得システムの構築・オペレーションを経験。博士課程ではモンテカルロシミュレーションデータから検出効率や他粒子の混入率から補正係数を算出し、実測データを補正する解析を行った。RHICf 実験は米国ブルックヘブン国立研究所 RHIC で実施された衝突実験で、超高エネルギー宇宙線と大気の相互作用を地上で再現することを目的とする。前方光子のエネルギースペクトル測定を通じて、宇宙線空気シャワーモデルの精密化に貢献。データ取得システムの設計・運用・解析という SRE に直結するスキルセットの原点となった研究活動。',
    publications: [
      {
        title:
          'The energy spectrum of forward photons measured by the RHICf experiment in √s = 510 GeV proton-proton collisions',
        venue: 'Proceedings of Science (ICRC2019)',
        date: '2019',
        description:
          '筆頭著者として国際宇宙線会議 ICRC2019 にて RHICf 実験の前方光子エネルギースペクトル測定結果を発表（Proceedings of Science 掲載: 2021 年）。DOI: 10.22323/1.358.0413',
      },
    ],
  },
];
