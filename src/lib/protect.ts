import { auth } from "./auth";
import { notFound } from "next/navigation";

/**
 * Vérifie que l'utilisateur est connecté et possède l'un des rôles autorisés.
 * Redirige vers la page 404 si ce n'est pas le cas.
 *
 * @param allowedRoles Liste des rôles autorisés (ex: ["admin", "teacher"])
 * @returns Les informations de l'utilisateur si authentifié et autorisé
 */
export async function requireAuthOr404(allowedRoles?: string[]) {
  const session = await auth();

  if (!session?.user) {
    notFound(); // Non connecté
  }

  const userRoles = session.user.roles || [];

  if (
    allowedRoles &&
    !userRoles.some((r) => allowedRoles.includes(r.name))
  ) {
    notFound(); // Rôle non autorisé
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
    roles: userRoles.map((r) => r.name),
  };
}
