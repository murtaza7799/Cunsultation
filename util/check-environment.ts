export default function checkEnvironment(): string {
  const envUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.WEB_URL;

  return envUrl;
}
