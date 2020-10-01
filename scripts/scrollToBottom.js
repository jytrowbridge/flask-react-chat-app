export function scrollToBottom() {
  const body = document.getElementsByTagName("BODY")[0];
  body.scrollTop = body.scrollHeight;
}