function main() {
  const boton = document.querySelector(".boton") as any;
  const titulo = document.querySelector(".titulo") as any;

  boton.addEventListener("click", (e) => {
    const color = titulo.style.color;
    if (color == "red") {
      titulo.style.color = "black";
    } else {
      titulo.style.color = "red";
    }
  });
}

main();
