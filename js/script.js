document.getElementById("searchButton").addEventListener("click", function() {
  const pokemonName = document.getElementById("pokemonName").value.toLowerCase().trim();

  if (pokemonName === "") {
    alert("Digite o nome ou número de um Pokémon!");
    return;
  }

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Pokémon não encontrado!");
    }
    return response.json();
  })
  .then(data => {
    console.log(data);

    document.getElementById("name").innerText = data.name.toUpperCase();
    document.getElementById("image").src = data.sprites.front_default;
    document.getElementById("image").alt = data.name;

    const types = data.types.map (typeInfo => typeInfo.type.name).join (", ");
    document.getElementById("type").innerText = `Tipo: ${types}`;

    document.getElementById("id").innerText = `ID: ${data.id}`;
    document.getElementById("weight").innerText = `Peso: ${data.weight / 10} kg`;
    document.getElementById("height").innerText = `Altura: ${data.height / 10} m`;

    const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name).join(", ");
    document.getElementById("abilities").innerText = `Habilidades: ${abilities}`;

    fetch(data.types[0].type.url)
      .then(response => response.json())
      .then(typeData => {
        const weaknesses = typeData.damage_relations.double_damage_from.map(w => w.name).join(", ");
        document.getElementById("weaknesses").innerText = `Fraquezas: ${weaknesses || "Nenhuma"}`;

        const resistences = typeData.damage_relations.half_damage_from.map(r => r.name).join(", ");
        document.getElementById("resistences").innerText = `Forte contra: ${resistences || "Nenhuma"}`;
      });

    fetch(data.species.url)
      .then(response => response.json())
      .then(speciesData => {
        fetch(speciesData.evolution_chain.url)
          .then(response => response.json())
          .then(evolutionData => {
            let evolutionText = "Não evolui.";
            let chain = evolutionData.chain;

            if(chain.evolves_to.length > 0) {
              const firstEvolution = chain.evolves_to[0];
              evolutionText = `${chain.species.name} => ${firstEvolution.species.name}`;

              if(firstEvolution.evolves_to.length > 0) {
              const secondEvolution = firstEvolution.evolves_to[0];
              evolutionText += ` => ${secondEvolution.species.name}`;
              }
            }

            document.getElementById("evolution").innerText = `Evolução: ${evolutionText}`;
          });
      });
    
    document.querySelector(".pokemonInfo").style.display = "block";
  })
  .catch(error => {
    alert(error.message);
    document.querySelector(".pokemonInfo").style.display = "none"; // Esconder se houver erro
  });
});
