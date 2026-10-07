const form = document.getElementById("portfolioForm");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const education = [...document.querySelectorAll(".education-item")].map(item => ({
      school: item.querySelector(".education-school").value.trim(),
      degree: item.querySelector(".education-degree").value.trim(),
      year: item.querySelector(".education-year").value.trim(),
      description: item.querySelector(".education-description").value.trim()
    }));

    const projects = [...document.querySelectorAll(".project-item")].map(item => ({
      name: item.querySelector(".project-name").value.trim(),
      link: item.querySelector(".project-link").value.trim(),
      description: item.querySelector(".project-description").value.trim()
    }));

    const experience = [...document.querySelectorAll(".experience-item")].map(item => ({
      position: item.querySelector(".experience-position").value.trim(),
      company: item.querySelector(".experience-company").value.trim(),
      duration: item.querySelector(".experience-duration").value.trim(),
      description: item.querySelector(".experience-description").value.trim()
    }));

    const profilePictureInput = document.getElementById("profilePicture");

let profileImageUrl = null;

if (profilePictureInput && profilePictureInput.files.length > 0) {
  const file = profilePictureInput.files[0];

  profileImageUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

const portfolio = {
  profile_image_url: profileImageUrl,

  full_name: document.getElementById("fullName").value.trim(),
  email: document.getElementById("email").value.trim(),
  contact_number: document.getElementById("contactNumber").value.trim(),
  address: document.getElementById("address").value.trim(),
  about_me: document.getElementById("aboutMe").value.trim(),
  skills: document.getElementById("skills").value.trim(),
  github: document.getElementById("github").value.trim(),
  linkedin: document.getElementById("linkedin").value.trim(),
  facebook: document.getElementById("facebook").value.trim(),
  website: document.getElementById("website").value.trim(),
  education,
  projects,
  experience
};
    const editId = localStorage.getItem("editPortfolioId");

    let data;
    let error;

    if (editId) {
      const result = await supabaseClient
        .from("portfolios")
        .update(portfolio)
        .eq("id", editId)
        .select()
        .single();

      data = result.data;
      error = result.error;
    } else {
      const result = await supabaseClient
        .from("portfolios")
        .insert([portfolio])
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error(error);
      alert("Failed to save portfolio: " + error.message);
      return;
    }

    localStorage.setItem(
      "currentPortfolio",
      JSON.stringify(data)
    );

    localStorage.removeItem("editPortfolioId");

    alert(editId
      ? "Portfolio updated successfully!"
      : "Portfolio saved successfully!"
    );

    window.location.href = "templates.html";
  });
}

async function loadExistingPortfolio() {
  let editId = localStorage.getItem("editPortfolioId");

  // If no edit ID, try to get the current portfolio ID
  if (!editId) {
    const currentPortfolio = JSON.parse(
      localStorage.getItem("currentPortfolio")
    );

    if (currentPortfolio && currentPortfolio.id) {
      editId = currentPortfolio.id;
      localStorage.setItem("editPortfolioId", editId);
    }
  }

  // Still no ID = this is a new portfolio
  if (!editId) {
    console.log("Creating a new portfolio.");
    return;
  }

  console.log("Loading portfolio ID:", editId);

  const { data: portfolio, error } = await supabaseClient
    .from("portfolios")
    .select("*")
    .eq("id", editId)
    .single();

  if (error) {
    console.error("LOAD ERROR:", error);
    alert("Failed to load portfolio: " + error.message);
    return;
  }

  if (!portfolio) {
    alert("Portfolio not found.");
    return;
  }

  // Basic information
  document.getElementById("fullName").value =
    portfolio.full_name || "";

  document.getElementById("email").value =
    portfolio.email || "";

  document.getElementById("contactNumber").value =
    portfolio.contact_number || "";

  document.getElementById("address").value =
    portfolio.address || "";

  document.getElementById("aboutMe").value =
    portfolio.about_me || "";

  document.getElementById("skills").value =
    portfolio.skills || "";

  // Social links
  document.getElementById("github").value =
    portfolio.github || "";

  document.getElementById("linkedin").value =
    portfolio.linkedin || "";

  document.getElementById("facebook").value =
    portfolio.facebook || "";

  document.getElementById("website").value =
    portfolio.website || "";

  // Education
  if (
    Array.isArray(portfolio.education) &&
    portfolio.education.length > 0
  ) {
    while (
      document.querySelectorAll(".education-item").length <
      portfolio.education.length
    ) {
      addEducation();
    }

    const educationItems =
      document.querySelectorAll(".education-item");

    portfolio.education.forEach((education, index) => {
      const item = educationItems[index];

      item.querySelector(".education-school").value =
        education.school || "";

      item.querySelector(".education-degree").value =
        education.degree || "";

      item.querySelector(".education-year").value =
        education.year || "";

      item.querySelector(".education-description").value =
        education.description || "";
    });
  }

  // Projects
  if (
    Array.isArray(portfolio.projects) &&
    portfolio.projects.length > 0
  ) {
    while (
      document.querySelectorAll(".project-item").length <
      portfolio.projects.length
    ) {
      addProject();
    }

    const projectItems =
      document.querySelectorAll(".project-item");

    portfolio.projects.forEach((project, index) => {
      const item = projectItems[index];

      item.querySelector(".project-name").value =
        project.name || "";

      item.querySelector(".project-link").value =
        project.link || "";

      item.querySelector(".project-description").value =
        project.description || "";
    });
  }

  // Work Experience
  if (
    Array.isArray(portfolio.experience) &&
    portfolio.experience.length > 0
  ) {
    while (
      document.querySelectorAll(".experience-item").length <
      portfolio.experience.length
    ) {
      addExperience();
    }

    const experienceItems =
      document.querySelectorAll(".experience-item");

    portfolio.experience.forEach((experience, index) => {
      const item = experienceItems[index];

      item.querySelector(".experience-position").value =
        experience.position || "";

      item.querySelector(".experience-company").value =
        experience.company || "";

      item.querySelector(".experience-duration").value =
        experience.duration || "";

      item.querySelector(".experience-description").value =
        experience.description || "";
    });
  }

  console.log("Existing portfolio loaded:", portfolio);
}

loadExistingPortfolio();