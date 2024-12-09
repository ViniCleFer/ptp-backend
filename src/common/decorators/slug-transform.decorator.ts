import { Transform } from 'class-transformer';
import slugify from 'slugify';

export function SlugTransform(
  options?: Parameters<typeof slugify>[1],
): PropertyDecorator {
  return Transform(({ value }) => (value ? slugify(value, options) : value));
}
