
import { IDatabaseAdapter } from "./adapter";

export class AppwriteAdapter implements IDatabaseAdapter {
  async fetchCollection(collectionName: string): Promise<any[]> {
    throw new Error("Appwrite fetchCollection not implemented");
  }
  async saveItem(collectionName: string, item: any): Promise<boolean> {
    throw new Error("Appwrite saveItem not implemented");
  }
  async deleteItem(collectionName: string, id: string): Promise<boolean> {
    throw new Error("Appwrite deleteItem not implemented");
  }
}
