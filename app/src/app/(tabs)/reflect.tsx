import { useState } from 'react';

import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Segments } from '@/components/ui';

const SECTIONS = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
] as const;
type Section = (typeof SECTIONS)[number]['key'];

export default function Reflect() {
  const [section, setSection] = useState<Section>('weekly');
  return (
    <Screen top={<Segments options={SECTIONS} value={section} onChange={setSection} />}>
      {section === 'weekly' ? (
        <>
          <SectionHeader
            eyebrow={'03 / Weekly'}
            before="weekly "
            highlight="reset"
            after="."
            sub="Once a week, look back and ask: did I do what I set out to do? Then set your top 3 for next week."
          />
          <ComingSoon items={['Score your week 1 to 10', 'Win of the week and what got in the way', 'Top 3 for next week', 'Weekly score trend']} />
        </>
      ) : (
        <>
          <SectionHeader
            eyebrow={'04 / Monthly'}
            before="monthly "
            highlight="check-in"
            after="."
            sub="Score each area from 1 (struggling) to 10 (thriving). Be honest, nobody's grading you :)"
          />
          <ComingSoon items={['Score all 10 areas', 'Biggest win and where I saw God move', 'Focus for next month', 'The receipts: every month, color-coded']} />
        </>
      )}
    </Screen>
  );
}
