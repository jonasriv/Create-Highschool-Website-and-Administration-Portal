type Props = {
user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
};
msConnected: boolean;
};


export default function TeacherTests({ user }: Props) {
    return(
        <div>Tests for {user?.name}</div>
    )
}