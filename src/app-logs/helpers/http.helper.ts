import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpHelper {
  getIP(req: Record<string, any>): string {
    const reqIP = req.ips.length ? req.ips[0] : req.ip;
    const forwardedHeader = req.headers['x-forwarded-for'];
    const originalForwaredHeader = req.headers['x-original-forwarded-for'];

    return originalForwaredHeader || forwardedHeader || reqIP;
  }

  getHeaderOrigin(req: Record<string, any>): string {
    return req.headers.origin || '';
  }
}
