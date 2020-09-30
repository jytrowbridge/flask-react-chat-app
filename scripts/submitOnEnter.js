export function submitOnEnter(event){
  if(event.which === 13 && !event.shiftKey){
      event.target.form.dispatchEvent(new Event("submit", {cancelable: true}));
      event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
  }
}