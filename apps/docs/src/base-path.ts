export const withBasePath = (basePath: string, path: string) =>
  `${basePath}/${path}`.replace(/\/+/g, '/');
