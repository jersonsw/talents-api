export const dynamicImport = async (packageName: string) => {
  return new Function(`return import('${packageName}')`)();
};
