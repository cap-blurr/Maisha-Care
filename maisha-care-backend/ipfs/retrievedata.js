import { setupIPFS } from './setupIPFS.js';
import { CID } from 'multiformats/cid';

export async function retrieveDataFromIPFS(cidString) {
  const { jsonStore } = await setupIPFS();
  const cid = CID.parse(cidString);
  const data = await jsonStore.get(cid);
  return data;
}