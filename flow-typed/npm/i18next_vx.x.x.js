// flow-typed signature: 06a44cec4f958961c7fb085e5b188ea3
// flow-typed version: <<STUB>>/i18next_v19.1.0/flow_v0.105.2

/**
 * This is an autogenerated libdef stub for:
 *
 *   'i18next'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module 'i18next' {
  declare module.exports: {
    t: ((key: string, params?: { returnObjects?: false }) => string) &
      ((key: string, params: {| returnObjects: true |}) => any)
  };
}

/**
 * We include stubs for each file inside this npm package in case you need to
 * require those files directly. Feel free to delete any files that aren't
 * needed.
 */
declare module 'i18next/dist/cjs/i18next' {
  declare module.exports: any;
}

declare module 'i18next/dist/esm/i18next' {
  declare module.exports: any;
}

declare module 'i18next/dist/umd/i18next' {
  declare module.exports: any;
}

declare module 'i18next/dist/umd/i18next.min' {
  declare module.exports: any;
}

declare module 'i18next/i18next' {
  declare module.exports: any;
}

declare module 'i18next/i18next.min' {
  declare module.exports: any;
}

declare module 'i18next/karma.backward.conf' {
  declare module.exports: any;
}

declare module 'i18next/rollup.config' {
  declare module.exports: any;
}

// Filename aliases
declare module 'i18next/dist/cjs/i18next.js' {
  declare module.exports: $Exports<'i18next/dist/cjs/i18next'>;
}
declare module 'i18next/dist/esm/i18next.js' {
  declare module.exports: $Exports<'i18next/dist/esm/i18next'>;
}
declare module 'i18next/dist/umd/i18next.js' {
  declare module.exports: $Exports<'i18next/dist/umd/i18next'>;
}
declare module 'i18next/dist/umd/i18next.min.js' {
  declare module.exports: $Exports<'i18next/dist/umd/i18next.min'>;
}
declare module 'i18next/i18next.js' {
  declare module.exports: $Exports<'i18next/i18next'>;
}
declare module 'i18next/i18next.min.js' {
  declare module.exports: $Exports<'i18next/i18next.min'>;
}
declare module 'i18next/index' {
  declare module.exports: $Exports<'i18next'>;
}
declare module 'i18next/index.js' {
  declare module.exports: $Exports<'i18next'>;
}
declare module 'i18next/karma.backward.conf.js' {
  declare module.exports: $Exports<'i18next/karma.backward.conf'>;
}
declare module 'i18next/rollup.config.js' {
  declare module.exports: $Exports<'i18next/rollup.config'>;
}
