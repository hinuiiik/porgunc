import * as migration_20251030_154608 from './20251030_154608';
import * as migration_20251114_231544 from './20251114_231544';

export const migrations = [
  {
    up: migration_20251030_154608.up,
    down: migration_20251030_154608.down,
    name: '20251030_154608',
  },
  {
    up: migration_20251114_231544.up,
    down: migration_20251114_231544.down,
    name: '20251114_231544'
  },
];
