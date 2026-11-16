export const RETRO_RANKING_TABS = Object.freeze([
  {
    gameId: 'hancom-typing-97',
    tabLabel: '한컴타자',
    fullTitle: '한컴타자연습 97',
    modes: [
      { modeId: 'position', label: '자리연습 (타수)', metric: 'typing_speed', unit: '타/분' },
      { modeId: 'word', label: '낱말연습 (타수)', metric: 'typing_speed', unit: '타/분' },
      { modeId: 'short', label: '짧은글 연습 (타수)', metric: 'typing_speed', unit: '타/분' },
      { modeId: 'long', label: '긴글 연습 (타수)', metric: 'typing_speed', unit: '타/분' },
      { modeId: 'acid-rain', label: '산성비 (최고 점수)', metric: 'score', unit: '점' },
      { modeId: 'invader', label: '침략자 (최고 점수)', metric: 'score', unit: '점' },
    ],
  },
  {
    gameId: 'hanme-typing-30',
    tabLabel: '한메타자',
    fullTitle: '한메타자교사 3.0',
    modes: [
      { modeId: 'venezia', label: '베네치아 게임 (최고 점수)', metric: 'score', unit: '점' },
      { modeId: 'short', label: '단문연습 (타수)', metric: 'typing_speed', unit: '타/분' },
      { modeId: 'long', label: '장문연습 (타수)', metric: 'typing_speed', unit: '타/분' },
      { modeId: 'position', label: '자리연습 (타수)', metric: 'typing_speed', unit: '타/분' },
      { modeId: 'word', label: '낱말연습 (타수)', metric: 'typing_speed', unit: '타/분' },
    ],
  },
  {
    gameId: 'pikachu-volleyball',
    tabLabel: '피카츄배구',
    fullTitle: '피카츄 배구',
    modes: [
      { modeId: 'vs-computer', label: 'AI 대전 (승점/최고점)', metric: 'score', unit: '점' },
      { modeId: 'vs-computer-wins', label: 'AI 대전 (다승 순위)', metric: 'wins', unit: '승' },
    ],
  },
]);

export function formatMetricDisplay(value, unit = '점') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  const num = Number(value);
  return `${Math.round(num).toLocaleString('ko-KR')} ${unit}`;
}

export function formatRecordDate(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
