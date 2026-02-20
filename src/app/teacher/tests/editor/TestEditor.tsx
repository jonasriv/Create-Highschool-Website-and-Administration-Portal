import { useState } from "react"

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

export default function TestEditor({ user }: Props) {
    const [editingTest, setEditingTest] = useState<Test>({
        teacherId: "",
        title: "",
        subject: "",
        gradeLevel: "VG1",
        durationMinutes: 0,
        instructions: "",
        status: "draft",
        tasks: []
    });

    async function saveNewTest() {
        if (editingTest.title === "" || editingTest.subject === "" || !user?.id) return;

        const savingTitle = editingTest.title;
        const savingSubject = editingTest.subject;
        const savinggradeLevel = editingTest.gradeLevel;
        const savingStatus = editingTest.status;
        const savingTasks = editingTest.tasks;
        const savingDuration = editingTest.durationMinutes || 0;
        const savingInstructions = editingTest.instructions;

        const teacherId = user.id;

        try {
            const res = await fetch("/api/tests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify({
                    teacherId,
                    title: savingTitle,
                    subject: savingSubject,
                    gradeLevel: savinggradeLevel,
                    status: savingStatus,
                    durationMinutes: savingDuration,
                    instructions: savingInstructions,
                    tasks: savingTasks,
                }),
            });

            if (!res.ok) {
                throw new Error("Kunne ikke lagre prøve");
            }
        } catch (err) {
            alert("Noe gikk galt, sånn generelt sett: ");
            console.log(err);
        }
    }

        // teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
        // title: { type: String, required: true },
        // subject: { type: String, required: true },
        // gradeLevel: { type: String, enum: ["VG1", "VG2", "VG3"], required: true },
        // durationMinutes: { type: Number, required: false },
        // instructions: { type: String },
        // status: {
        // type: String,
        // enum: ["draft", "published", "archived"],
        // default: "draft",
        // },
        // tasks: [TaskSchema],
    return(
        <div>
            <h3 className={`w-full border-b border-black text-black uppercase text-center p-2`}>Rediger prøve</h3>
            <form className="flex flex-col my-2">
                {/* ØVerste del: generell info */}
                <div className="rounded-md  grid grid-cols-2 gap-2">
                    {/* Tittel boks */}
                    <div className={`bg-black/20 flex flex-col p-2 rounded-sm`}>
                        <p>Tittel:</p>
                        <input
                            value={editingTest.title}
                            placeholder="Tittel" 
                            type="text"
                            onChange={(e) => setEditingTest({...editingTest, title: e.target.value})}
                            className={`h-8 p-1 mt-1 rounded-sm text-black/80`}
                        />   
                    </div>             
                    {/* Fag boks */}
                    <div className={`bg-black/20 flex flex-col p-2 rounded-sm`}>
                        <p>Fag:</p>                
                        <input
                            value={editingTest.subject}
                            placeholder="Fag" 
                            type="text"
                            onChange={(e) => setEditingTest({...editingTest, subject: e.target.value})}
                            className={`h-8 p-1 mt-1 rounded-sm text-black/80`}
                        />     
                    </div>                                        
                    {/* TRINN boks */}
                    <div className={`bg-black/20 flex flex-col p-2 rounded-sm`}>                    
                        <p>Trinn</p>                                                           
                        <select
                            value={editingTest.gradeLevel}
                            onChange={(e) => {setEditingTest({...editingTest, gradeLevel: e.target.value as Test["gradeLevel"]})}}
                            className={`h-8 p-1 mt-1 rounded-sm text-black/80`}
                        >
                            <option value="VG1">VG1</option>
                            <option value="VG2">VG2</option>
                            <option value="VG3">VG3</option>
                        </select>                                
                    </div>                        
                    {/* STATUS boks */}
                    <div className={`bg-black/20 flex flex-col p-2 rounded-sm`}>                    
                        <p>Status</p>                                                           
                        <select
                            value={editingTest.status}
                            onChange={(e) => {setEditingTest({...editingTest, status: e.target.value as Test["status"]})}}
                            className={`h-8 p-1 mt-1 rounded-sm text-black/80`}
                        >
                            <option value="draft">Utkast</option>
                            <option value="published">Publisert</option>
                            <option value="archived">Arkivert</option>
                        </select>                                
                    </div>                        

                </div>
                {/* Oppgave-del */}
                <div className={``}>
                <p className={`w-full border-b mt-4 border-black text-center text-black uppercase p-2`}>Oppgaver</p>                
                    {/* Show all tasks */}
                    <div className={`mt-2`}>
                        {editingTest?.tasks && editingTest.tasks.length > 0 
                            ? 
                                <p>Ja</p>
                            : 
                                <p>Ingen oppgaver</p>
                        }
                    </div>
                    <button className={`p-2 rounded-sm bg-redish font-bold`}>
                        Legg til oppgave
                    </button>

                </div>

                {/* Save button */}
                <button type="button" onClick={() => saveNewTest()} className={`w-full bg-blue-400 p-4 my-2 rounded-md`}>
                    LAGRE PRØVE
                </button>
            </form>
        </div>

    )
}


// const TestSchema = new Schema<ITest>(
//     {
//         teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
//         title: { type: String, required: true },
//         subject: { type: String, required: true },
//         gradeLevel: { type: String, enum: ["VG1", "VG2", "VG3"], required: true },
//         durationMinutes: { type: Number, required: true },
//         instructions: { type: String },
//         status: {
//         type: String,
//         enum: ["draft", "published", "archived"],
//         default: "draft",
//         },
//         tasks: [TaskSchema],
//     },
//     { timestamps: true }

//     const TaskSchema = new Schema<ITask>(
//     {
//         type: {
//             type: String,
//             enum: ["short", "long", "multipleChoice"],
//             required: true,
//         },
//         prompt: { type: String, required: true },
//         expectedELements: {type: String },
//         points: { type: Number, required: true, default: 0 },
//         rubric: { type: String },
//     },
//     { _id: false }
// );