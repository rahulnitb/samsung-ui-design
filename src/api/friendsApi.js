import { initialFriendIds } from '../data/profileData.js';

// Dummy friends API — stands in for a real backend. Module-level arrays act as the
// "server's" stored state, seeded once, so repeated getFriendList() calls reflect
// earlier addFriend/deleteFriend/blockUser/unblockUser calls made during the session.
let serverFriendIds = [...initialFriendIds];
let serverBlockedIds = [];

const LOAD_DELAY_MS = 500;
const MUTATE_DELAY_MS = 400;
const MUTATION_FAIL_RATE = 0.05; // exercises the error/resync path now and then

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const snapshot = () => ({ friendIds: [...serverFriendIds], blockedIds: [...serverBlockedIds] });

async function mutate(apply) {
  await wait(MUTATE_DELAY_MS);
  if (Math.random() < MUTATION_FAIL_RATE) throw new Error('Network request failed');
  apply();
  return snapshot();
}

/** GET /friends */
export async function getFriendList() {
  await wait(LOAD_DELAY_MS);
  return snapshot();
}

/** POST /friends */
export function addFriend(contactId) {
  return mutate(() => {
    if (!serverFriendIds.includes(contactId)) serverFriendIds = [...serverFriendIds, contactId];
  });
}

/** DELETE /friends/:contactId */
export function deleteFriend(contactId) {
  return mutate(() => {
    serverFriendIds = serverFriendIds.filter((id) => id !== contactId);
  });
}

/** POST /friends/:contactId/block */
export function blockUser(contactId) {
  return mutate(() => {
    serverFriendIds = serverFriendIds.filter((id) => id !== contactId);
    if (!serverBlockedIds.includes(contactId)) serverBlockedIds = [...serverBlockedIds, contactId];
  });
}

/** POST /friends/:contactId/unblock */
export function unblockUser(contactId) {
  return mutate(() => {
    serverBlockedIds = serverBlockedIds.filter((id) => id !== contactId);
  });
}
