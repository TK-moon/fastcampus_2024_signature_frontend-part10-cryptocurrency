const SAVED_TICKER_SET_LOCAL_STORAGE_KEY = "SAVED-TICKER-SET";

const serialize = (set: Set<string>): string => {
  return JSON.stringify(Array.from(set));
};

const deserialize = (data: string | null): Set<string> => {
  return new Set<string>(data ? JSON.parse(data) : undefined);
};

function getTickerListFromLocalStorage() {
  try {
    const serialized_set = localStorage.getItem(
      SAVED_TICKER_SET_LOCAL_STORAGE_KEY
    );
    return deserialize(serialized_set);
  } catch (error) {
    console.error(error);
    return new Set<string>();
  }
}

function saveTickerListToLocalStorage(set: Set<string>) {
  try {
    localStorage.setItem(SAVED_TICKER_SET_LOCAL_STORAGE_KEY, serialize(set));
  } catch (error) {
    console.error(error);
  }
}

export function api_saveTicker(ticker: string) {
  const set = getTickerListFromLocalStorage();
  set.add(ticker);
  saveTickerListToLocalStorage(set);
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}

export function api_removeTicker(ticker: string) {
  const set = getTickerListFromLocalStorage();
  set.delete(ticker);
  saveTickerListToLocalStorage(set);
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}

export function api_getSavedTickerList() {
  const set = getTickerListFromLocalStorage();
  return new Promise<Array<string>>((resolve) => {
    setTimeout(() => {
      resolve(Array.from(set));
    }, 100);
  });
}
