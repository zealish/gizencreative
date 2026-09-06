import { auth } from "../src/lib/auth";

const email = process.env.ADMIN_EMAIL ?? "admin@gizencreative.com";
const password = process.env.ADMIN_PASSWORD ?? "admin12345";
const name = process.env.ADMIN_NAME ?? "Gizen Admin";

async function seedAdmin() {
  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  console.log(`Admin user created: ${result.user.email}`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
