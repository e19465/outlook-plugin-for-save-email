class LocalStorageService {
  /**
   * Retrieves the value associated with the specified key from the browser's local storage.
   *
   * @param key - The key whose value should be retrieved from local storage.
   * @returns The value associated with the given key, or `null` if the key does not exist.
   */
  getItemFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Stores a key-value pair in the browser's local storage.
   *
   * @param key - The key under which the value will be stored.
   * @param value - The string value to store in local storage.
   */
  setItemToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Removes the specified item from the browser's local storage.
   *
   * @param key - The key of the item to remove from local storage.
   */
  removeItemFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears all key/value pairs from the browser's local storage.
   *
   * @remarks
   * This operation removes all data stored in local storage for the current origin.
   * Use with caution, as this action is irreversible and will affect all data saved by the application.
   */
  clearLocalStorage(): void {
    localStorage.clear();
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
