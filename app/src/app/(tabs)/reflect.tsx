import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ComingSoon } from '@/components/ComingSoon';
import { MonthlyCheckin } from '@/components/MonthlyCheckin';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Segments } from '@/components/ui';

const SECTIONS = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
] as const;
type Section = (typeof SECTIONS)[number]['key'];

export default function Reflect() {
  const params = useLocalSearchParams<{ section?: string }>();
  const [section, setSection] = useState<Section>('weekly');
  useEffect(() => {
    if (params.section === 'monthly' || params.section === 'weekly') setSection(params.section);
  }, [params.section]);
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
        <MonthlyCheckin />
      )}
    </Screen>
  );
}
