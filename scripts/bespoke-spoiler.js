// requires the spoiler.styl file to work, which is imported by main.styl
export default function spoiler(selector) {
  return function(deck) {
    const spoilers = deck.parent.querySelectorAll(selector);
    spoilers.forEach(el => {
      el.classList.add('spoiler-active')
      el.addEventListener('click', () => el.classList.remove('spoiler-active'))
    })
  }
}