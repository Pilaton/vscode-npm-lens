/* eslint-disable n/no-unpublished-import */
/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable unicorn/prefer-module */
module.exports = (async () => {
  const baseConfig = await import("@pilaton/eslint-config-base");
  const reactConfig = await import("@pilaton/eslint-config-react");

  return [
    { ignores: ["dist", "**/*.d.ts"] },
    ...baseConfig.default,
    ...reactConfig.default,
  ];
})();
