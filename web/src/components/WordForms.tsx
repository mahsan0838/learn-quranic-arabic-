import type { VerbForms } from '../types';

const LABELS: [keyof VerbForms, string][] = [
  ['past', 'Past'],
  ['present', 'Present'],
  ['imperative', 'Command'],
  ['active_participle', 'Doer'],
  ['verbal_noun', 'Noun'],
];

// The five forms the booklet lists for each verb.
export function WordForms({ forms, compact = false }: { forms: VerbForms; compact?: boolean }) {
  return (
    <dl className={`forms${compact ? ' forms--compact' : ''}`}>
      {LABELS.map(([key, label]) => (
        <div key={key}>
          <dt>{label}</dt>
          <dd className="arabic" lang="ar">
            {forms[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
