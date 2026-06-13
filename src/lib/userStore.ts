import bcrypt from "bcryptjs";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// In-memory store — resets on server restart. Replace with a DB for production.
const users: StoredUser[] = [];

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<StoredUser> {
  const normalizedEmail = normalizeEmail(email);
  const existing = users.find((u) => u.email === normalizedEmail);
  if (existing) throw new Error("EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(password, 12);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  };
  users.push(user);
  return user;
}

export async function verifyUser(
  email: string,
  password: string,
): Promise<StoredUser | null> {
  const normalizedEmail = normalizeEmail(email);
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}
