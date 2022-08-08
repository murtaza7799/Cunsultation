export default function checkEnvironment(): string {
  const envUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://cunsultation-hlyvyp88r-murtaza7799.vercel.app/';

  return envUrl;
}
