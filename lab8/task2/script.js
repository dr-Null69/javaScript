function createSlider(config) {
  const slider = document.getElementById(config.id);
  const slidesContainer = slider.querySelector('.slides');
  const dotsContainer = slider.querySelector('.dots');
  const leftBtn = slider.querySelector('.left');
  const rightBtn = slider.querySelector('.right');

  let index = 0;
  let auto = null;

  config.images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');

    const img = document.createElement('img');
    img.src = src;

    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');

    dot.onclick = () => {
      index = i;
      update();
    };

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  function update() {
    slidesContainer.style.transform =
      `translateX(-${index * 100}%)`;

    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }

  rightBtn.onclick = () => {
    index = (index + 1) % config.images.length;
    update();
  };

  leftBtn.onclick = () => {
    index = (index - 1 + config.images.length) % config.images.length;
    update();
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') rightBtn.click();
    if (e.key === 'ArrowLeft') leftBtn.click();
  });

  function startAuto() {
    if (!config.autoplay) return;

    auto = setInterval(() => {
      rightBtn.click();
    }, config.duration);
  }

  function stopAuto() {
    clearInterval(auto);
  }

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  startAuto();
}

createSlider({
  id: 'slider',
  images: [
    'https://picsum.photos/id/1015/600/300',
    'https://picsum.photos/id/1016/600/300',
    'https://picsum.photos/id/1018/600/300',
    'https://picsum.photos/id/1020/600/300'
  ],
  duration: 3000,
  autoplay: true
});