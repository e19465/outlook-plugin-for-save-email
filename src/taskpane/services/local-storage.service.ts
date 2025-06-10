class LocalStorageService {
  getItemFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItemToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItemFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
