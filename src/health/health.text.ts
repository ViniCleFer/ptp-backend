import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class TextHealthIndicator extends HealthIndicator {
  async writeInfo(
    key: string,
    data: Record<string, any>,
  ): Promise<HealthIndicatorResult> {
    return this.getStatus(key, true, data);
  }
}
