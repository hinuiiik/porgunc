import * as migration_20251008_194241_add_pdf_field_to_posts from './20251008_194241_add_pdf_field_to_posts';
import * as migration_20251030_043707_polls_and_posts_separation from './20251030_043707_polls_and_posts_separation';

export const migrations = [
  {
    up: migration_20251008_194241_add_pdf_field_to_posts.up,
    down: migration_20251008_194241_add_pdf_field_to_posts.down,
    name: '20251008_194241_add_pdf_field_to_posts',
  },
  {
    up: migration_20251030_043707_polls_and_posts_separation.up,
    down: migration_20251030_043707_polls_and_posts_separation.down,
    name: '20251030_043707_polls_and_posts_separation'
  },
];
