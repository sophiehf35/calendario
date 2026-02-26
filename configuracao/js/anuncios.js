window.addEventListener("DOMContentLoaded", function() {
    
    if (document.querySelector('h1').dataset.tipoPagina === 'calculadora-idade' || document.querySelector('h1').dataset.tipoPagina === 'contador-de-dias-calculadora' || document.querySelector('h1').dataset.tipoPagina === 'contador-de-dias-corridos' || document.querySelector('h1').dataset.tipoPagina === 'contador-de-dias-uteis') {

        //INSERE ANUNCIO NAS PAGINAS (ESTADO, CIDADE, BAIRRO, UNIDADE)

        inserirAnuncio('anuncioDiv1_desktop', '7ae65acda698d7ecb357e633aaa82c88', 60, 468, 'https://www.highperformanceformat.com/7ae65acda698d7ecb357e633aaa82c88/invoke.js');
        inserirAnuncio('anuncioDiv1_mobile', '4f433edac6414ab49b9156bbab351cf5', 250, 300, 'https://www.highperformanceformat.com/4f433edac6414ab49b9156bbab351cf5/invoke.js');
        inserirAnuncio('anuncioDiv2_desktop', '4f433edac6414ab49b9156bbab351cf5', 250, 300, 'https://www.highperformanceformat.com/4f433edac6414ab49b9156bbab351cf5/invoke.js');
        inserirAnuncio('anuncioDiv2_mobile', '814fa0e04ee22143d7b1fb072a826fc2', 300, 160, 'https://www.highperformanceformat.com/814fa0e04ee22143d7b1fb072a826fc2/invoke.js');
        inserirAnuncio('anuncioDiv3', '814fa0e04ee22143d7b1fb072a826fc2', 300, 160, 'https://www.highperformanceformat.com/814fa0e04ee22143d7b1fb072a826fc2/invoke.js');
    
    } else if (document.querySelector('h1').dataset.tipoPagina === 'home' || document.querySelector('h1').dataset.tipoPagina === 'loterica-mais-proxima') {

        //INSERE ANUNCIO NAS PAGINAS HOME | LOTERICA MAIS PROXIMA

        inserirAnuncio('anuncioDiv1_desktop', '7ae65acda698d7ecb357e633aaa82c88', 60, 468, 'https://www.highperformanceformat.com/7ae65acda698d7ecb357e633aaa82c88/invoke.js');
        inserirAnuncio('anuncioDiv1_mobile', '4f433edac6414ab49b9156bbab351cf5', 250, 300, 'https://www.highperformanceformat.com/4f433edac6414ab49b9156bbab351cf5/invoke.js');
        inserirAnuncio('anuncioDiv2_desktop', '4f433edac6414ab49b9156bbab351cf5', 250, 300, 'https://www.highperformanceformat.com/4f433edac6414ab49b9156bbab351cf5/invoke.js');
        inserirAnuncio('anuncioDiv2_mobile', '814fa0e04ee22143d7b1fb072a826fc2', 300, 160, 'https://www.highperformanceformat.com/814fa0e04ee22143d7b1fb072a826fc2/invoke.js');
        inserirAnuncio('anuncioDiv3', '2b05db3dd656640ca9d2bdc9e9e29e1c', 90, 728, 'https://www.highperformanceformat.com/2b05db3dd656640ca9d2bdc9e9e29e1c/invoke.js');

    }

    
});