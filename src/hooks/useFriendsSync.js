import { useEffect, useRef } from 'react';
import * as friendsApi from '../api/friendsApi.js';

const API_BY_OP = {
  add: friendsApi.addFriend,
  delete: friendsApi.deleteFriend,
  block: friendsApi.blockUser,
  unblock: friendsApi.unblockUser,
};

/**
 * Drains the reducer's `pendingSync` outbox in the background. Add/remove/block/unblock
 * already update local state optimistically (instant, remote-control-friendly) — this
 * just syncs each one to the dummy friends API, and resyncs from "the server" if one
 * fails. Called once from TvShell (not from inside ProfileOverlay) so an in-flight sync
 * isn't abandoned if the user closes the Profile panel right after triggering it.
 */
export function useFriendsSync(state, dispatch) {
  const inFlight = useRef(new Set());

  useEffect(() => {
    state.pendingSync.forEach((entry) => {
      if (inFlight.current.has(entry.seq)) return;
      inFlight.current.add(entry.seq);

      const call = API_BY_OP[entry.op] ?? (() => Promise.resolve());
      call(entry.contactId)
        .catch(async () => {
          try {
            const { friendIds, blockedIds } = await friendsApi.getFriendList();
            dispatch({ type: 'FRIENDS_LOAD_SUCCESS', friendIds, blockedIds });
          } catch {
            // best-effort resync only; leave the optimistic local state as-is
          }
          dispatch({ type: 'SHOW_TOAST', message: "Couldn't sync with server — try again" });
        })
        .finally(() => {
          inFlight.current.delete(entry.seq);
          dispatch({ type: 'FRIENDS_SYNC_DEQUEUE', seq: entry.seq });
        });
    });
  }, [state.pendingSync, dispatch]);
}
