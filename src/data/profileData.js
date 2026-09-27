// Dummy social data for the sidebar Profile overlay (friend list / add / remove).
const contact = (id, name, handle, avatarBg, avatarFg = '#fff') => ({ id, name, handle, avatarBg, avatarFg });

export const profileUser = {
  name: 'Rahul',
  handle: '@rahul',
  avatarBg: 'linear-gradient(135deg, #7c5cff, #ff5b9e)',
};

// The full contact book. "Friends" are whichever of these are in the current friendIds list.
export const profileContacts = [
  contact('aisha', 'Aisha Khan', '@aisha.k', 'linear-gradient(135deg, #ff8a3d, #ff3d7f)'),
  contact('liam', 'Liam Chen', '@liamc', 'linear-gradient(135deg, #3aa0ff, #1560d8)'),
  contact('sofia', 'Sofia Rossi', '@sofia.r', 'linear-gradient(135deg, #ffd166, #ef476f)', '#3a2a06'),
  contact('kenji', 'Kenji Sato', '@kenjis', 'linear-gradient(135deg, #1ed3a1, #0a7a5c)'),
  contact('maya', 'Maya Patel', '@mayap', 'linear-gradient(135deg, #b04dff, #2a2dff)'),
  contact('noah', 'Noah Williams', '@noahw', 'linear-gradient(135deg, #4dffb0, #0f4a3a)', '#04241a'),
  contact('zara', 'Zara Ahmed', '@zara.a', 'linear-gradient(135deg, #ff4d5e, #b3122a)'),
  contact('leo', 'Leo Martins', '@leom', 'linear-gradient(135deg, #f7a072, #8c3b2a)', '#2a1406'),
];

// Dummy starting friends — a subset of the contact book above, by id.
export const initialFriendIds = ['aisha', 'liam', 'maya'];
