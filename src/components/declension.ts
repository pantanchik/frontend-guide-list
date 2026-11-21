const pluralRules = new Intl.PluralRules('ru-RU')

type WordForms = [one: string, few: string, many: string]

const pluralize = (count: number, [one, few, many]: WordForms): string => {
  const rule = pluralRules.select(Math.abs(count))

  switch (rule) {
    case 'one':
      return one
    case 'few':
      return few
    default:
      return many
  }
}

// склонение "шаг"
export const getStepsLabel = (count: number, wordCase: 1 | 2 = 1): string =>
  wordCase === 1
    ? pluralize(count, ['шаг', 'шага', 'шагов'])
    : pluralize(count, ['шага', 'шагов', 'шагов'])

// склонение "просмотр"
export const getViewsLabel = (count: number): string =>
  pluralize(count, ['просмотр', 'просмотра', 'просмотров'])
