import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { Animated } from 'react-native';

import { celebrate } from '@/lib/haptics';
import { useOnboarding } from '@/lib/onboarding';
import { TEST_MODE } from '@/lib/testMode';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { StepShell } from '@/onboarding/StepShell';
import * as Steps from '@/onboarding/steps';
import type { StepProps } from '@/onboarding/steps';

type Step = { key: string; cta: string; hint?: string; dark?: boolean; gated?: boolean; Body: ComponentType<StepProps> };

const STEPS: Step[] = [
  { key: 'welcome', cta: "Let's begin", Body: Steps.Welcome },
  { key: 'name', cta: 'Continue', gated: true, hint: 'Add your name to continue', Body: Steps.Name },
  { key: 'areas', cta: 'Continue', gated: true, hint: 'Pick at least one area', Body: Steps.Areas },
  { key: 'daily', cta: 'Nice, next', gated: true, hint: 'Tap at least one area to try it', Body: Steps.Daily },
  { key: 'score', cta: 'Next', gated: true, hint: 'Tap a number to try it', Body: Steps.Score },
  { key: 'reflect', cta: 'Next', gated: true, hint: 'Tap a card to open it', Body: Steps.Reflect },
  { key: 'wins', cta: 'Next', gated: true, hint: 'Add your first win', Body: Steps.Wins },
  { key: 'dream', cta: 'Next', dark: true, Body: Steps.Dream },
  { key: 'remind', cta: 'Start my dream life ✦', Body: Steps.Remind },
];

export default function Onboarding() {
  const { profile, update, finish } = useOnboarding();
  const [i, setI] = useState(0);
  const [ready, setReadyState] = useState(false);
  const setReady = useCallback((r: boolean) => setReadyState(r), []);
  const fade = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const step = STEPS[i];

  // Each step reports when it has been tried; reset on step change.
  useEffect(() => setReadyState(!STEPS[i].gated), [i]);

  const go = (to: number) => {
    if (reduced) return setI(to);
    Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setI(to);
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    });
  };

  const done = () => {
    celebrate();
    finish();
    router.replace(TEST_MODE ? '/home' : '/sign-up');
  };

  const canNext = !step.gated || ready;
  return (
    <StepShell
      step={i}
      total={STEPS.length}
      dark={step.dark}
      onBack={i > 0 ? () => go(i - 1) : undefined}
      onSkip={i < STEPS.length - 1 ? done : undefined}
      cta={step.cta}
      canNext={canNext}
      hint={canNext ? undefined : step.hint}
      onNext={() => (i === STEPS.length - 1 ? done() : go(i + 1))}
    >
      <Animated.View style={{ flex: 1, gap: 16, opacity: fade }}>
        <step.Body profile={profile} update={update} setReady={setReady} />
      </Animated.View>
    </StepShell>
  );
}
