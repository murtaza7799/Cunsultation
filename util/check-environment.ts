import { useRouter } from 'next/router';
export default function checkEnvironment(): string {
  function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
  }
  function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
  }
  const envUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : getURL();

  return envUrl;
}
