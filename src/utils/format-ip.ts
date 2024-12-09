export const formatIp = (ip: string): string => {
  if (!ip) {
    ip = '12345';
  }

  if (ip.includes('ffff')) {
    ip = ip.toString().replace('::ffff:', '');
  }

  return ip;
};
