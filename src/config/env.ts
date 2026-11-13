function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Copy .env.example to .env - see README.md "Configuration".`,
    );
  }
  return value;
}

export const env = {
  get baseUrl(): string {
    return requireEnv('ORANGEHRM_BASE_URL');
  },
  get username(): string {
    return requireEnv('ORANGEHRM_USERNAME');
  },
  get password(): string {
    return requireEnv('ORANGEHRM_PASSWORD');
  },
};
