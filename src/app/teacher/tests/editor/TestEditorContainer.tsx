"use client";

import { useEffect, useMemo, useState } from "react";
import { useTeacherStore } from "../../store";
import type { Test } from "../types";
import type { TestDto } from "../dtoTypes";
import { dtoToEditor, emptyTest } from "./editorModel";
import TestEditor from "./TestEditor";

type Props = {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export default function TestEditorContainer({ user }: Props) {
  const editingId = useTeacherStore((s) => s.editingTest); // string | undefined
  const tests = useTeacherStore((s) => s.tests);
  const upsertTest = useTeacherStore((s) => s.actions.upsertTest);

  const dto = useMemo(() => {
    if (!editingId) return undefined;
    return tests.find((t) => t?._id === editingId);
  }, [editingId, tests]);

  const [initial, setInitial] = useState<Test | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // NEW
    if (!editingId) {
      setInitial(emptyTest(user.id));
      return;
    }

    // EDIT (har den i store)
    if (dto) {
      setInitial(dtoToEditor(dto, user.id));
      return;
    }

    // EDIT (må hentes)
    (async () => {
      const res = await fetch(`/api/tests/${editingId}`);
      if (!res.ok) return; // evt: set error state
      const one = (await res.json()) as TestDto;
      upsertTest(one);
      setInitial(dtoToEditor(one, user.id || ""));
    })();
  }, [user?.id, editingId, dto, upsertTest]);

  if (!user?.id) return <div>Mangler bruker</div>;
  if (!initial) return <div>Laster…</div>;

  return <TestEditor user={user} initialTest={initial} onSaved={upsertTest} />;
}