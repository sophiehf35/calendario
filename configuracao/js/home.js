/* FUNÇÃO EXIBIR SUMÁRIO */
window.addEventListener("DOMContentLoaded", function (event) {
    //Get all headings only from the actual contents.
    var contentContainer = document.getElementById("artigo");
    var headings = contentContainer.querySelectorAll("h2,h3,h4,h5");
  
    var tocContainer = document.getElementById("toc");
    // create ul element and set the attributes.
    var ul = document.createElement("ul");
  
    ul.setAttribute("id", "tocList");
    ul.setAttribute("class", "sidenav");
  
    // Loop through the headings NodeList
    for (i = 0; i <= headings.length - 1; i++) {
      var id = headings[i].innerHTML
        .toLowerCase()
        .replace(",", "")
        .replace("!", "")
        .replace(".", "")
        .replace(/ /g, "-"); // Set the ID to the header text, all lower case with hyphens instead of spaces.
      var level = headings[i].localName.replace("h", ""); // Getting the header a level for hierarchy
      var title = headings[i].innerHTML; // Set the title to the text of the header
  
      headings[i].setAttribute("id", id); // Set header ID to its text in lower case text with hyphens instead of spaces.
  
      var li = document.createElement("li"); // create li element.
      li.setAttribute("class", "sidenav__item"); // Assign a class to the li
  
      var a = document.createElement("a"); // Create a link'
      a.setAttribute("href", "#" + id); // Set the href to the heading ID
      a.innerHTML =
        "<span style='justify-content: center; align-items: center; line-height: unset;' class='mx-1' data-icon='&#x39;'></span>" +
        title; // Set the link text to the heading text
  
      li.setAttribute("class", "sidenav__item");
  
      if (level == 2) {
        li.appendChild(a);
        ul.appendChild(li);
      } else if (level == 3) {
        li.setAttribute("style", "padding-left: 1rem;");
        li.appendChild(a);
        ul.appendChild(li);
      } else if (level == 4) {
        li.setAttribute("style", "padding-left: 2rem;");
        li.appendChild(a);
        ul.appendChild(li);
      } else if (level == 5) {
        li.setAttribute("style", "padding-left: 3rem;");
        li.appendChild(a);
        ul.appendChild(li);
      }
    }
  
    toc.appendChild(ul); // add list to the container
  
    // Add a class to the first list item to allow for toggling active state.
    var links = tocContainer.getElementsByClassName("sidenav__item");
  
    links[0].classList.add("current");
  
    // Loop through the links and add the active class to the current/clicked link
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("current");
        current[0].className = current[0].className.replace(" current", "");
        this.className += " current";
      });
    }
  });
  /* FUNÇÃO EXIBIR SUMÁRIO */

  /* FUNÇÃO PARA CRIAR SECTION E CARREGAR O CONTEÚDO EM DESTAQUE */
function carregaConteudoDestaque(config) {

    fetch('/configuracao/json/conteudo-destaque.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            if (data.length > 0 && config.conteudo_destaque_pagina_artigo === 1) {
                let link = '';
            
                data.forEach(conteudo => {
                    const imagem = (conteudo.tipo === 'artigos' ? `/usuarios/${conteudo.slug_tipo_autor}/${conteudo.slug_autor}/artigos/thumb/${conteudo.imagem_destaque}` : `/ferramentas/${conteudo.imagem_destaque}`);
                    const slugConteudo = (conteudo.tipo === 'artigos' ? `${conteudo.slug_categoria}/${conteudo.slug}` : `ferramenta/${conteudo.slug}`);
                    const categoria = (conteudo.tipo === 'artigos' ? conteudo.categoria.toUpperCase() : conteudo.tipo.toUpperCase());
            
                    link += `
                        <li>
                            <div class="alignleft shadow-sm">
                                <a href="/${slugConteudo}">
                                    <figure>
                                        <img width="95px" height="53px" src="data:image/webp;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img")}${imagem}" data-srcset="${(config.cdn_imagens === 1 ? config.diretorio_cdn_imagens : "/img")}${imagem}?tr=w-150" class="img-fluid" alt="${conteudo.alt_imagem_destaque}" title="${conteudo.titulo_imagem_destaque}" itemprop="image">
                                    </figure>
                                </a>
                            </div>
                            <small class="p-1 badge badge-primary rounded-0">${categoria}</small>
                            <h4><a href="/${slugConteudo}">${conteudo.titulo_breadcumb}</a></h4>
                        </li>
                    `;
                });
            
                const conteudosEmDestaque = `
                    <div id="destaqueWidget" class="box_detail widget">
                        <div class="titulo_secao">
                            <h3 class="titulo">DESTAQUE</h3>
                        </div>
                        <div class="secao_artigos_em_destaque conteudo_secao_sidebar">
                            <ul>
                                ${link}
                            </ul>
                        </div>
                    </div>
                `;
                
                const sumarioWidget = document.getElementById('sumarioWidget');
                sumarioWidget.insertAdjacentHTML("afterend", conteudosEmDestaque);
                
            }
            
            AdiarImagens();
        
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });

}
/* FUNÇÃO PARA CRIAR SECTION E CARREGAR O CONTEÚDO EM DESTAQUE */