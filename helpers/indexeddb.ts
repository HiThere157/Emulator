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

async function getStates(): Promise<StateFile[]> {
  const store = await getStore("ejs-states", "states", "readonly");

  const keys = await makeRequest<string[]>(store.getAllKeys());
  const values = await makeRequest<Uint8Array[]>(store.getAll());

  const promises = keys.map(async (key, index): Promise<StateFile> => {
    const [rom_id, slot] = key.split("-");

    return {
      rom_id: parseInt(rom_id),
      slot: parseInt(slot),
      uploaded_by: -1,
      size: values[index].length,
    };
  });

  return Promise.all(promises);
}

async function getState(rom_id: number, slot: number): Promise<Uint8Array> {
  const store = await getStore("ejs-states", "states", "readonly");
  return await makeRequest<Uint8Array>(store.get(`${rom_id}-${slot}`));
}

async function putState(rom_id: number, slot: number, blob: Blob) {
  const store = await getStore("ejs-states", "states", "readwrite");
  await makeRequest(store.put(blob, `${rom_id}-${slot}`));
}

async function deleteState(rom_id: number, slot: number) {
  const store = await getStore("ejs-states", "states", "readwrite");
  await makeRequest(store.delete(`${rom_id}-${slot}`));
}

export { getStates, getState, putState, deleteState };
