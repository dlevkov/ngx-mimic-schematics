export const mimicVersion = loadPackageVersionGracefully('mimic');

/** Loads the full version from the given package gracefully. */
function loadPackageVersionGracefully(packageName: string): string | null {
  try {
    return require(`${packageName}/package.json`).version;
  } catch {
    return null;
  }
}
