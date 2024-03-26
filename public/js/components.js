import './axios.min.js'; // 1.6.8
import './Users.js';

document.addEventListener('DOMContentLoaded', () => {
  const { createApp } = Vue;
  const app = createApp();
  app.component("Users", Users);
  app.mount("#app");
});
