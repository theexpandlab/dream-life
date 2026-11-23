import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';

export default function Dream() {
  return (
    <Screen>
      <SectionHeader
        eyebrow={'09 / Dream you ✦'}
        before="meet the "
        highlight="dream you"
        after="."
        sub="A space to see the woman you've been dreaming of becoming, 1, 3 and 5 years from now, and a realistic path to get there."
      />
      <ComingSoon items={['Unlock with your name', 'Breathing welcome', 'Vision boards for 1, 3 and 5 years', 'Premium paywall']} />
    </Screen>
  );
}
