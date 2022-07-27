export default function checkEnvironment(): string {
  const envUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : 'https://trello-clone-one.vercel.app';

  return envUrl;
}
