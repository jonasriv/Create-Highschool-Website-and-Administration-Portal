"use server"

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import TeacherClient from "./TeacherClient";
import { TeacherModel } from '../../models/Teacher';
import dbConnect from "@/lib/mongoose";

export default async function TeacherPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/teacher");

    await dbConnect();

    const email = session.user.email.trim().toLowerCase();
    const isTeacher = await TeacherModel.exists({ email, active: true });
    if (!isTeacher) {
        redirect("/elev");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msConnected = Boolean((session as any).msConnected);

    return (
        <>
        {session.user &&
            <TeacherClient
            user={session.user}
            msConnected={msConnected}
            />
        }
        </>
    );
}
