
document.addEventListener("DOMContentLoaded", () => {

const mainImage = document.getElementById("mainProductImage");
const thumbs = Array.from(document.querySelectorAll(".thumb"));
const dots = Array.from(document.querySelectorAll("#galleryDots .dot"));

let images = ["assets/product1.png", ...thumbs.map(t => t.dataset.src)];

let index = 0;

function updateGallery() {
  mainImage.src = images[index];

  thumbs.forEach((t, i) => {
    t.classList.toggle("active", i + 1 === index); 
  });


  dots.forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

updateGallery();

document.getElementById("prevImg").addEventListener("click", () => {
  index = (index - 1 + images.length) % images.length;
  updateGallery();
});

document.getElementById("nextImg").addEventListener("click", () => {
  index = (index + 1) % images.length;
  updateGallery();
});

thumbs.forEach((t, i) =>
  t.addEventListener("click", () => {
    index = i + 1; 
    updateGallery();
  })
);

dots.forEach((d, i) => {
  d.addEventListener("click", () => {
    index = i;
    updateGallery();
  });
});

  const singleRadio = document.querySelector("input[value='single']");
  const doubleRadio = document.querySelector("input[value='double']");
  const singlePanel = document.getElementById("singlePanel");
  const doublePanel = document.getElementById("doublePanel");

  function updateSubscriptionPanels() {
    if (!singlePanel || !doublePanel) return;

    if (singleRadio && singleRadio.checked) {
      singlePanel.classList.add("active");
      doublePanel.classList.remove("active");
    } else {
      singlePanel.classList.remove("active");
      doublePanel.classList.add("active");
    }
  }

  if (singleRadio) singleRadio.addEventListener("change", updateSubscriptionPanels);
  if (doubleRadio) doubleRadio.addEventListener("change", updateSubscriptionPanels);

  updateSubscriptionPanels();

  const addToCart = document.getElementById("addToCartBtn");

  function updateCartLink() {
    if (!addToCart) return;

    const type = (singleRadio && singleRadio.checked) ? "single" : "double";

    const f1 = (document.querySelector("input[name='fragrance1']:checked") || {}).value || "";
    const f2a = (document.querySelector("input[name='fragrance2a']:checked") || {}).value || "";
    const f2b = (document.querySelector("input[name='fragrance2b']:checked") || {}).value || "";

    let url = "";

    if (type === "single") {
      url = `https://example.com/cart?type=single&f=${encodeURIComponent(f1)}`;
    } else {
      url = `https://example.com/cart?type=double&f1=${encodeURIComponent(f2a)}&f2=${encodeURIComponent(f2b)}`;
    }

    addToCart.href = url;
  }

  updateCartLink();

  document.querySelectorAll(
    "input[name='purchase'], input[name='fragrance1'], input[name='fragrance2a'], input[name='fragrance2b']"
  ).forEach(input => {
    input.addEventListener("change", updateCartLink);
  });


  const starRating = document.querySelector(".star-rating");

  if (starRating) {
    const ratingValue = parseFloat(starRating.dataset.rating); 
    const stars = starRating.querySelectorAll("i");

    stars.forEach((star, index) => {
      let starNumber = index + 1;

      if (ratingValue >= starNumber) {
        star.className = "bx bxs-star";
      } else if (ratingValue >= starNumber - 0.5) {
        star.className = "bx bxs-star-half";
      } else {
        star.className = "bx bx-star";
      }
    });
  }

});


