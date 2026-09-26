export const getRequiredApiKey = (envVar: string, errorMsg: string): string => {
  const apiKey = import.meta.env[envVar];
  if (!apiKey) {
    throw new Error(errorMsg);
  }
  return apiKey;
};

export const appendParam = (url: URL, key: string, value: string | null | undefined): void => {
  if (value) {
    url.searchParams.append(key, value);
  }
};

export const toISODate = (dateStr: string): string => dateStr.split("T")[0];

export const toNYTDate = (dateStr: string): string => dateStr.split("T")[0].replace(/-/g, "");
