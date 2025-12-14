
  const counters = document.querySelectorAll(".number");
  let hasAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      let count = 0;

      const increment = target / 60; 

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.textContent = `${Math.floor(count)}%`;
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = `${target}%`;
        }
      };

      updateCount();
    });
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          hasAnimated = true;
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(document.getElementById("stats"));

