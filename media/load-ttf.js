window.onload = () => {
  searchIcons();
};

function searchIcons() {
  const search = document.getElementById("glyph-search-input");
  const glyphs = document.querySelectorAll(".glyph");

  search.addEventListener("input", (inputEvent) => {
    console.log(inputEvent);
    const value = inputEvent.target.value;
    const items = document.getElementById("glyphs").querySelectorAll(".glyph");

    items.forEach((item) => {
      const text = item.querySelector(".glyph-name").innerText;

      if (text.includes(value.toLowerCase())) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  });
}

function copy(self) {
  const innerHTML = self.innerHTML;
  const value = innerHTML.replace("&amp;", "&");
  console.log(value);
  copyToClipboard(value);
  self.innerHTML = "copied!";
  const cb = self.onclick;
  self.onclick = null;
  self.style = "cursor: default;";

  setTimeout(() => {
    self.innerHTML = innerHTML;
    self.onclick = cb;
    self.style = "cursor: pointer;";
  }, 500);
}

function copyToClipboard(content) {
  const input = document.createElement("input");
  input.setAttribute("value", content);
  input.setAttribute("readonly", "readonly");
  document.body.appendChild(input);
  input.setSelectionRange(0, 999);
  input.select();
  if (document.queryCommandSupported("copy")) {
    document.execCommand("copy");
  }
  document.body.removeChild(input);
}
