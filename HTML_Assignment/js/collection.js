
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains("active");

      document.querySelectorAll(".accordion-item").forEach(i => {
        i.classList.remove("active");
        i.querySelector(".icon").textContent = "+";
      });

      if (!isOpen) {
        item.classList.add("active");
        header.querySelector(".icon").textContent = "−";
      }
    });
  });

