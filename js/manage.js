const container = document.getElementById("portfolioList");

async function loadPortfolios() {
  if (!container) return;

  const { data, error } = await supabaseClient
    .from("portfolios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "<p>Failed to load portfolios.</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No portfolios found.</p>";
    return;
  }

  container.innerHTML = "";

  data.forEach(portfolio => {
    const card = document.createElement("div");

    card.innerHTML = `
      <h3>${portfolio.full_name || "Unnamed Portfolio"}</h3>
      <p>${portfolio.email || ""}</p>

      <button onclick="editPortfolio('${portfolio.id}')">
        Edit
      </button>

      <button onclick="deletePortfolio('${portfolio.id}')">
        Delete
      </button>
    `;

    container.appendChild(card);
  });
}

function editPortfolio(id) {
  localStorage.setItem("editPortfolioId", id);
  window.location.href = "create.html";
}

async function deletePortfolio(id) {
  const confirmed = confirm("Delete this portfolio?");

  if (!confirmed) return;

  const { error } = await supabaseClient
    .from("portfolios")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Failed to delete portfolio: " + error.message);
    return;
  }

  alert("Portfolio deleted successfully!");
  loadPortfolios();
}

loadPortfolios();