// ===== Base Constructor =====
function Project(title, images, category = 'normal') {
  this.title = title;
  this.images = images;
  this.category = category;
}

// ===== Shared Methods via Prototype =====
Project.prototype.render = function() {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.category = this.category;

  const title = document.createElement('h3');
  title.textContent = this.title;

  const slider = document.createElement('div');
  slider.className = 'slider';

  this.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    if (i === 0) img.classList.add('active');
    slider.appendChild(img);
  });

  const prev = document.createElement('button');
  prev.textContent = 'Prev';

  const next = document.createElement('button');
  next.textContent = 'Next';

  const toggle = document.createElement('button');
  toggle.textContent = 'Details';

  const details = document.createElement('div');
  details.className = 'details';
  details.textContent = 'Some project info...';

  card.append(title, slider, prev, next, toggle, details);

  // ===== Slider Logic =====
  let index = 0;
  const imgs = slider.querySelectorAll('img');

  function show(i) {
    imgs.forEach(img => img.classList.remove('active'));
    imgs[i].classList.add('active');
  }

  prev.onclick = () => {
    index = (index - 1 + imgs.length) % imgs.length;
    show(index);
  };

  next.onclick = () => {
    index = (index + 1) % imgs.length;
    show(index);
  };

  // Auto-play
  setInterval(() => {
    index = (index + 1) % imgs.length;
    show(index);
  }, 3000);

  // Toggle details
  toggle.onclick = () => {
    details.style.display =
      details.style.display === 'block' ? 'none' : 'block';
  };

  return card;
};

// ===== Inheritance =====
function FeaturedProject(title, images, text) {
  Project.call(this, title, images, 'featured');
  this.text = text;
}

FeaturedProject.prototype = Object.create(Project.prototype);
FeaturedProject.prototype.constructor = FeaturedProject;

// Override method
FeaturedProject.prototype.render = function() {
  const card = Project.prototype.render.call(this);

  const badge = document.createElement('div');
  badge.textContent = this.text;
  badge.style.color = 'gold';

  card.appendChild(badge);
  return card;
};

// ===== Prototype Chain Demo =====
console.log(
  FeaturedProject.prototype.__proto__ === Project.prototype
); // true

// ===== Data =====
const projects = [
  new Project('Portfolio Website', [
    'https://picsum.photos/300/200?1',
    'https://picsum.photos/300/200?2'
  ]),
  new FeaturedProject(
    'E-commerce App',
    [
      'https://picsum.photos/300/200?3',
      'https://picsum.photos/300/200?4'
    ],
    '⭐ Featured'
  )
];

// ===== Render Function =====
const container = document.getElementById('projectContainer');

function render(list) {
  container.innerHTML = '';
  list.forEach(p => container.appendChild(p.render()));
}

render(projects);

// ===== Theme Persistence =====
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') document.body.classList.add('light');

document.getElementById('toggleTheme').onclick = () => {
  document.body.classList.toggle('light');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('light') ? 'light' : 'dark'
  );
};

// ===== Filter =====
let filtered = false;

document.getElementById('filterFeatured').onclick = () => {
  filtered = !filtered;
  const list = filtered
    ? projects.filter(p => p.category === 'featured')
    : projects;

  render(list);
};

// ===== Search =====
document.getElementById('searchInput').oninput = (e) => {
  const value = e.target.value.toLowerCase();

  const filteredList = projects.filter(p =>
    p.title.toLowerCase().includes(value)
  );

  render(filteredList);
};