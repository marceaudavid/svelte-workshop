import Signin from './pages/Signin.svelte';
import SignUp from './pages/SignUp.svelte';
import Chat from './pages/Chat.svelte';
import { writable } from 'svelte/store';

const router = {
  '/': Signin,
  '/signup': SignUp,
  '/chat': Chat,
};

export function navigateTo(path, data) {
  route.set(path);
  window.history.pushState({ path, data }, '', window.location.origin + path);
}

export const route = writable('/signin');

export default router;
