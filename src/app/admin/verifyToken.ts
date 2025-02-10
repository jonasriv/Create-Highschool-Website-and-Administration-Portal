import jwt from 'jsonwebtoken';
import { NextRequest } from "next/server";

// Definer en type for decoded-tokenet
interface DecodedToken {
    id: string;
    username: string;
    isAdmin: boolean;
}

export function verifyToken(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        return { error: "Ingen token oppgitt", status: 401};
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        //sjekk om bruker er admin: 
        if (!decoded.isAdmin) {
            return {error: "Ikke autorisert", status: 403};
        }
        return { decoded };
    } catch {
        return { error: "Ugyldig eller utløpt token ", status: 403};
    }
}