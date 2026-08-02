
export interface IDatabaseAdapter {
  fetchCollection(collectionName: string): Promise<any[]>;
  saveItem(collectionName: string, item: any): Promise<boolean>;
  deleteItem(collectionName: string, id: string): Promise<boolean>;
}
