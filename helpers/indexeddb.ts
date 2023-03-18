function getDB(name: string) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    try {
      const openRequest = indexedDB.open(name);

      openRequest.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
      openRequest.onerror = (event: any) => {
        reject(event.target.error.name);
      };
    } catch (error) {
      reject(error);
    }
  });
}

function makeRequest<T>(request: IDBRequest) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };
    request.onerror = (event: any) => {
      reject(event.target.error.name);
    };
  });
}

async function getStore(dbName: string, storeName: string, mode: IDBTransactionMode) {
  const db = await getDB(dbName);
  return db.transaction(storeName, mode).objectStore(storeName);
}

async function getStates() {
  const store = await getStore("ejs-states", "states", "readonly");

  const keys = await makeRequest<string[]>(store.getAllKeys());
  const values = await makeRequest<Uint8Array[]>(store.getAll());

  return keys.map((key, index): State => {
    const [game, slot] = key.split("_");

    return {
      game,
      slot: Number(slot),
      data: values[index],
    };
  });
}

async function putState(state: State) {
  const store = await getStore("ejs-states", "states", "readwrite");
  await makeRequest(store.put(state.data, `${state.game}-${state.slot}`));
}

export { getStates, putState };
