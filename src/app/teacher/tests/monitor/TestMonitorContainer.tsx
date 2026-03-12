// src/app/teacher/tests/monitor/TestMonitorContainer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useTeacherStore } from "../../store";
import type { TestDto } from "../dtoTypes";
import TestMonitor from "./TestMonitor";

type Props = {
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null };
};

export default function TestMonitorContainer({ user }: Props) {
  const monitoringId = useTeacherStore((s) => s.monitoringTest);
  const tests = useTeacherStore((s) => s.tests); // TestDto[]
  const upsertTest = useTeacherStore((s) => s.actions.upsertTest);

  const dto = useMemo(() => {
    if (!monitoringId) return undefined;
    return tests.find((t) => t?._id === monitoringId);
  }, [monitoringId, tests]);

  const [test, setTest] = useState<TestDto | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    if (!monitoringId) {
      setTest(null);
      return;
    }

    if (dto) {
      setTest(dto);
      return;
    }

    (async () => {
      const res = await fetch(`/api/tests/${monitoringId}`);
      if (!res.ok) return;
      const one = (await res.json()) as TestDto;
      upsertTest(one);
      setTest(one);
    })();
  }, [user?.id, monitoringId, dto, upsertTest]);

  if (!monitoringId) return <div className="opacity-70 text-sm p-2">Velg en prøve å overvåke.</div>;
  if (!test) return <div className="opacity-70 text-sm p-2">Laster prøve…</div>;

  return <TestMonitor test={test} />;
}