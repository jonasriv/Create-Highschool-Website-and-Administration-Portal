type Props = {
user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
};
msConnected: boolean;
};


export default function TeacherOther({ user }: Props) {
    return (
        <div>Other for {user?.name}</div>
    )
}