import { useState } from 'react';

import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Segments } from '@/components/ui';

const SECTIONS = [
  { key: 'board', label: 'Win board' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'dump', label: 'The dump' },
] as const;
type Section = (typeof SECTIONS)[number]['key'];

export default function Wins() {
  const [section, setSection] = useState<Section>('board');
  return (
    <Screen top={<Segments options={SECTIONS} value={section} onChange={setSection} />}>
      {section === 'board' && (
        <>
          <SectionHeader
            eyebrow={'06 / Win board'}
            before="the win "
            highlight="board"
            after="."
            sub="Every win in one place, so on the tough days you can see how far you've come."
          />
          <ComingSoon items={['Tough day? Remember this one', 'Add a win', 'Daily, weekly and monthly wins pulled in automatically']} />
        </>
      )}
      {section === 'highlights' && (
        <>
          <SectionHeader
            eyebrow={'07 / Highlights'}
            before="the highlight "
            highlight="reel"
            after="."
            sub="Photos and moments that made you really happy, so you never forget the good stuff."
          />
          <ComingSoon items={['Add a photo and what happened', 'Grouped by month']} />
        </>
      )}
      {section === 'dump' && (
        <>
          <SectionHeader
            eyebrow={'08 / The dump'}
            before="things that no longer "
            highlight="serve me"
            after="."
            sub="Habits, thoughts, patterns, clutter, commitments. Write it down, then let it go."
          />
          <ComingSoon items={['1 Peter 5:7 (KJV)', 'Let it go ✦', 'Released list']} />
        </>
      )}
    </Screen>
  );
}
