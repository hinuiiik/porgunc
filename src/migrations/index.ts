import * as migration_20251008_194241_add_pdf_field_to_posts from './20251008_194241_add_pdf_field_to_posts';

export const migrations = [
  {
    up: migration_20251008_194241_add_pdf_field_to_posts.up,
    down: migration_20251008_194241_add_pdf_field_to_posts.down,
    name: '20251008_194241_add_pdf_field_to_posts'
  },
];
