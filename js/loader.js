export function handleLoader() {
  setTimeout(() => {
    const loader = document.getElementById("loader")
    loader.setAttribute("data-loading", "false");

    document.body.style.overflow = "unset";
  }, 1200);
}