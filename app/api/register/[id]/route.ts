import { generateVerificationToken } from "@/actions/auth/tokens";
import { getUserByEmail, getUserById } from "@/actions/auth/user";
import { currentUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { client } from "@/lib/prisma"
import { ProfileSchema } from "@/schemas/auth.schemas";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { toast } from "sonner";

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    return Response.json(await client.user.findUnique({
        where: { id: params.id },
    }))
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } },
    values: z.infer<typeof ProfileSchema>
) {


    console.log("PATCH",)
    try {

        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params.id) {
            return new NextResponse("Profile ID missing", { status: 400 });
        }

        const dbUser = await getUserById(user.id!);

        if (!dbUser) {
            return { error: "Unauthorized" }
        }
        
         if (values.email && values.email !== user.email) {
          const existingUser = await getUserByEmail(values.email);
        
            if (existingUser && existingUser.id !== user.id) {
              return { error: "Email already in use!" }
            }
        
            const verificationToken = await generateVerificationToken(
              values.email
            );
            await sendVerificationEmail(
              verificationToken.email,
              verificationToken.token,
            );
        
            return { success: "Verification email sent!" };
          }

          if (values.password && values.newPassword && dbUser.password) {
            const passwordsMatch = await bcrypt.compare(
              values.password,
              dbUser.password,
            );
        
            if (!passwordsMatch) {
              return { error: "Incorrect password!" };
            }
        
            const hashedPassword = await bcrypt.hash(
              values.newPassword,
              10,
            );
            values.password = hashedPassword;
            values.newPassword = undefined;
           }
        const profile = await client.user.update({
            where: {
                id: params.id,
            },
            data: {
                ...values,
                updatedAt: new Date()
            }
        });

        return NextResponse.json(profile);

    } catch (error) {
        console.log("[PROFILE_PATCH]", error);
        return new NextResponse("internal Error", { status: 500 });
    }
    
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        return Response.json(await client.user.delete({
            where: { id: params.id },
        }))
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}