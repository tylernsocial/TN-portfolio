const projects = [
  {
    title: "Project One",
    description:
      "A short summary of a project you are proud of. Mention the problem, your role, and the result.",
    tags: ["HTML", "CSS", "JavaScript"],
    url: "#"
  },
  {
    title: "Project Two",
    description:
      "Use this card for a class project, freelance build, app prototype, or case study.",
    tags: ["Responsive", "UI", "Performance"],
    url: "#"
  },
  {
    title: "Project Three",
    description:
      "Swap in real links when you are ready. The layout will adapt as your portfolio grows.",
    tags: ["Accessibility", "Frontend", "Design"],
    url: "#"
  }
];

const projectGrid = document.querySelector("#project-grid");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const year = document.querySelector("#year");

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const tags = project.tags.map((tag) => `<li>${tag}</li>`).join("");

  card.innerHTML = `
    <div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
    </div>
    <ul class="tag-list" aria-label="${project.title} technologies">${tags}</ul>
    <a href="${project.url}" aria-label="View ${project.title}">View project</a>
  `;

  return card;
}

projects.forEach((project) => {
  projectGrid.append(createProjectCard(project));
});

year.textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});
