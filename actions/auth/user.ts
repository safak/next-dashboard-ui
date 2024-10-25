
import { client } from "@/lib/prisma";


export const getUserByEmail = async (email: string) => {
    try {
        const user = await client.user.findUnique({ where: { email } });

        return user;
    } catch {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await client.user.findUnique({ where: { id } });

        return user;
    } catch {
        return null;
    }
};


export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await client.account.findFirst({
            where: { userId }
        });

        return account;
    } catch {
        return null;
    }
};
