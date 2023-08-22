import { defineConfig } from 'tsup';
import * as preset from 'tsup-preset-solid';

const preset_options: preset.PresetOptions = {
  entries: [
    {
      entry: 'src/index.ts',
      dev_entry: true,
    },
  ],
  drop_console: true,
  cjs: true,
};

const CI =
  process.env['CI'] === 'true' ||
  process.env['GITHUB_ACTIONS'] === 'true' ||
  process.env['CI'] === '"1"' ||
  process.env['GITHUB_ACTIONS'] === '"1"';

export default defineConfig((config) => {
  const watching = !!config.watch;
  const parsed_options = preset.parsePresetOptions(preset_options, watching);
  if (!watching && !CI) {
    const package_fields = preset.generatePackageExports(parsed_options);
    console.log(`package.json: \n\n${JSON.stringify(package_fields, null, 2)}\n\n`);
    // will update ./package.json with the correct export fields
    preset.writePackageJson(package_fields);
  }
  return preset.generateTsupOptions(parsed_options);
});
