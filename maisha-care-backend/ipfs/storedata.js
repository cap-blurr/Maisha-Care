import { setupIPFS } from './setupIPFS.js';

export async function storeDataOnIPFS(data) {
  const { jsonStore } = await setupIPFS();
  const cid = await jsonStore.add(data);
  return cid.toString();
}