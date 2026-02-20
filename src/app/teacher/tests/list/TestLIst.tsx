import { useEffect, useState } from "react";
import { useTeacherStore } from "../../store";

type Props = {
user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
};
msConnected: boolean;
};

type Task = {
    type?: "long" | "short" | "multipleChoice",
    prompt?: string,
    expectedElements?: string,
    points?: number,
    rubric?: string,
    id?: string,
}

type Test = {
    teacherId?: string,
    title?: string,
    subject?: string,
    gradeLevel?: "VG1" | "VG2" | "VG3",
    durationMinutes?: number,
    instructions?: string,
    status?: string,
    tasks?: Task[]
}

export default function TestList({ user }: Props) {
    const toggleTests = useTeacherStore((s) => s.actions.toggleTests);
    const [tests, setTests] = useState<Test[]>([]);

    useEffect(() => {
        async function getTests() {
            try {
                const res = await fetch("/api/tests");
                if (!res.ok) {
                    alert("kan ikke hente prøver!");
                    return;
                }
                const gotTests = await res.json();
                setTests(gotTests);
            } catch(err) {
                alert("Something went terribly wrong!");
                console.log(err);
            }
        }
        getTests();
    }, [])

    return (
        <div>
            <h3 className={`p-2`} onClick={() => toggleTests()}>{user?.name?.split(" ")[0]}&apos;s prøver</h3>
            <ul className="w-full divide-y divide-black border-y border-black mt-4">
                {tests?.length > 0 
                    ? 
                        tests.map((t, idx) => <li key={idx} className={`w-full px-1 py-2 uppercase text-black`}>{t.title}</li>)
                    : 
                        <p>Ingen prøver</p>
                }
                
                
            </ul>
        </div>
    )
}