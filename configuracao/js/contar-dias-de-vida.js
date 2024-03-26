window.addEventListener("pageshow", function(event) {
    var historyTraversal = event.persisted || (typeof window.performance != "undefined" && window.performance.getEntriesByType("navigation")[0].type === "back_forward");
    if (historyTraversal) {
        window.location.reload();
    }
});

document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll(".calendario").forEach(function(element) {
        element.addEventListener('focus', function(e) {
            // Selecionar e remover a classe com fadeOut
            var alertDismissible = document.querySelector(".alert-dismissible");
            if (alertDismissible) {
                alertDismissible.style.transition = "opacity 0.5s ease";
                alertDismissible.style.opacity = 0;
                setTimeout(function() {
                    alertDismissible.remove();
                }, 500);
            }
        });
    });

    document.getElementById("data_nascimento").addEventListener("focusout", function() {
        var dataNascimento = document.getElementById("data_nascimento");
        if (dataNascimento.value == "__/__/____") {
            dataNascimento.value = "";
            var dataNascimentoExtensa = document.getElementById("data_nascimento_extensa");
            if (dataNascimentoExtensa) {
                dataNascimentoExtensa.remove();
            }
        }
    });

    var momentFormat = 'DD/MM/YYYY';
    var momentMask = IMask(document.getElementById('data_nascimento'), {
        mask: Date,
        pattern: momentFormat,
        lazy: false,
        format: function(date) {
            return moment(date).format(momentFormat);
        },
        parse: function(str) {
            return moment(str, momentFormat);
        },
        blocks: {
            YYYY: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 9999
            },
            MM: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 12
            },
            DD: {
                mask: IMask.MaskedRange,
                from: 1,
                to: 31
            }
        }
    }).on('complete', function() {
        GeraDataExtenso('data_nascimento');
    });

    //LIMPA DATAS INICIAIS SETADAS PELA MASK
    $("#data_nascimento").val("");

    function GeraDataExtenso(campo) {
        let nome_campo = campo.replace('_', ' ');
        moment.locale('pt-br');
        let data_extenso = moment(document.getElementById(campo).value, 'DD/MM/YYYY', true).format('dddd[,] DD [de] MMMM [de] YYYY');
        $("#descricao_" + campo).html('<span id="' + campo + '_extensa"><strong style="text-transform: capitalize;">' + nome_campo + ':</strong> ' + data_extenso + '</span>');
    }

    /* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE CONTATO */
    const formContador = document.querySelector("#formulario-contar-dias-de-vida");

    const inputDataNascimento = formContador.querySelector("#data_nascimento");

    const botaoCalcularIdade = document.querySelector("#calcular_idade");
    const divNotificacaoContador = document.querySelector("#div_notificacao_contador");
    const divBarraContador = document.querySelector("#div_barra_contador");
    
    botaoCalcularIdade.addEventListener("click", function(event) {
        event.preventDefault();

        if (inputDataNascimento.value === "") {
            exibirNotificacao("erro", "Erro, preencha a data de nascimento", inputDataNascimento, divNotificacaoContador);
        } else {

            // Converta a data para o formato ISO (yyyy-mm-dd)
            var dataAtual = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
            var dataNascimento = new Date(inputDataNascimento.value.split('/').reverse().join('-'));

            //CALCULA O INTERVALO
            var diffInMilliseconds = Math.abs(dataAtual - dataNascimento);
            var intervaloEmDias = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

            if (intervaloEmDias === 0) {
                exibirNotificacao("erro",  "Erro, a data de nascimento é igual à data atual.", inputDataNascimento, divNotificacaoContador);
            } else if (intervaloEmDias < 1) {
                exibirNotificacao("erro",  "Erro, a data de nascimento é menor que a data atual.", inputDataNascimento, divNotificacaoContador);
            } else {

                divBarraContador.innerHTML = '<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
                divBarraContador.classList.remove("d-none");
                divBarraContador.classList.add("d-block", "fade", "show");
                
                criaBarraProgresso(1350);
                enviaDados();

                function enviaDados() {
                    setTimeout(function () {
                        var parametros = `?data_nascimento=${encodeURIComponent(inputDataNascimento.value)}&data_atual=${encodeURIComponent(dataAtual)}`;
                        window.location.href = window.location.pathname + parametros;
                    }, 1200);
                }


            }

        }


    });

    inputDataNascimento.addEventListener("focus", function() {
        ocultaNotificacao(verificaTipoAlerta(divNotificacaoContador), inputDataNascimento, divNotificacaoContador);
    });

    inputDataNascimento.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            botaoCalcularIdade.click();
        }
    });

function calculaMeses(dataNascimento, dataAtual, roundUpFractionalMonths) {

    var startDate = dataNascimento;
    var endDate = dataAtual;
    endDate.setDate(endDate.getDate() + 2)
    var inverse=false;
    
    if(dataNascimento>dataAtual) {
        startDate=date2;
        endDate=date1;
        inverse=true;
    }

    var yearsDifference=endDate.getFullYear()-startDate.getFullYear();
    var monthsDifference=endDate.getMonth()-startDate.getMonth();
    var daysDifference=endDate.getDate()-startDate.getDate();

    var monthCorrection=0;

    if(roundUpFractionalMonths===true && daysDifference>0) {
        monthCorrection=1;
    }

    else if(roundUpFractionalMonths!==true && daysDifference<0) {
        monthCorrection=-1;
    }

    return (inverse?-1:1)*(yearsDifference*12+monthsDifference+monthCorrection);
};

function calculaIntervalo(dataNascimentoStr, dataAtualStr) {

    var dataNascimento = new Date(dataNascimentoStr);
    var dataAtual = new Date(dataAtualStr);

    // Inicializa variáveis
    var diasUteis = 0;
    var conteudoTabela = '';

    //CALCULA OS DIAS CORRIDOS
    var dias = Math.floor((dataAtual - dataNascimento) / (1000 * 60 * 60 * 24));
    var anos = dataAtual.getFullYear() - dataNascimento.getFullYear();

    // Verifica se ainda não completou o aniversário deste ano
    if (dataAtual.getMonth() < dataNascimento.getMonth() || 
        (dataAtual.getMonth() === dataNascimento.getMonth() && dataAtual.getDate() < dataNascimento.getDate())) {
        anos--;
    }

    var tabela = `<div style="padding-bottom: 25px;" class="container"><div><table style="margin-top:0px;" class="table tabela-customizada table-striped table-bordered dt-responsive nowrap dataTable no-footer dtr-inline"><thead style="background-color: var(--cor-primaria); color: #FFF;"><tr><th>DATA</th><th>NOME</th><th>TIPO</th></tr></thead><tbody>${conteudoTabela}</tbody></table></div></div>`;

    return {
        dias: dias,
        meses: calculaMeses(dataNascimento, dataAtual),
        anos: anos,
        sectionTabela: conteudoTabela !== '' ? tabela : ''
    };
}

//RECUPERA OS PARÂMETROS DA URL
var urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('data_nascimento') && urlParams.has('data_atual')) {

    //RECUPERA E SETA OS PARÂMETROS
    var dataNascimento = urlParams.get('data_nascimento');
    var dataAtual = urlParams.get('data_atual');
    
    //TRATA DATA PARA FORMATO UNIVERSAL
    var dataNascimentoUniversal = dataNascimento.substring(0, 10).split('/').reverse().join('-');
    var dataAtualUniversal = dataAtual.substring(0, 10).split('/').reverse().join('-');

    var intervalo = calculaIntervalo(dataNascimentoUniversal, dataAtualUniversal);

    var dias = intervalo.dias;
    var anos = intervalo.anos;
    var meses = intervalo.meses;
    var semanas = Math.floor(intervalo.dias / 7);

    var todasAsSecoes = document.querySelectorAll('section');
    todasAsSecoes.forEach(function(secao) {
        if (secao.id !== 'section_inicial') {
            secao.remove();
        }
    });

    // Remover a classe "bg_color_1"
    document.getElementById("section_inicial").classList.remove("bg_color_1");
    var divAcaoContador = document.getElementById('div_acao_contador');

    divAcaoContador.innerHTML = `<div class="box_account">
        <div style="box-shadow: 0px 0px 30px 0px rgb(0 0 0 / 10%); background-color: #fff; padding: 25px;">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                    <label class="label"><b style="font-weight:600">DATA DE NASCIMENTO</b></label>
                    <input style="font-size: 1.5rem;" type="text" value="${dataNascimento}" class="form-control add__date-one" id="data_nascimento" readonly="readonly">
                    </div>
                </div>
                <div class="col-md-6 mt-3 mt-md-4">
                    <a href="/ferramentas/contador-de-dias-de-vida-calcular-idade" class="align-middle"><button style="width:100%;" class="btn_1 full-width fe-pulse" type="button">FAZER NOVO CÁLCULO</button></a>
                </div>
            </div>
        </div>
    </div> `;

    var sectionResultado = `<section id="resultado">
        <div class="container-xl pb-4">
            <div class="row">
                <div class="col-xl-6 col-sm-6 col-6">
                    <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h2 class="titulo_item_contador">${dias !== 0 ? String(dias).padStart(2, '0') : '0'}</h2>
                            <span class="descricao_item_contador">${dias >= 2 ? 'Dias' : 'Dia'}</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-6 col-sm-6 col-12">
                    <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h2 class="titulo_item_contador">${semanas !== 0 ? String(semanas).padStart(2, '0') : 'Nenhuma'}</h2>
                            <span class="descricao_item_contador">${semanas >= 2 ? 'Semanas' : 'Semana'}${semanas !== 0 ? (dias % 7 !== 0 ? (dias % 7 >= 2 ? ' e ' + (dias % 7) + ' dias' : ' e ' + (dias % 7) + ' dia') : '') : ''}</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-6 col-sm-6 col-12">
                    <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h2 class="titulo_item_contador">${meses !== 0 ? String(meses).padStart(2, '0') : 'Nenhum'}</h2>
                            <span class="descricao_item_contador">${meses >= 2 ? 'Meses' : 'Mês'}</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-6 col-sm-6 col-6">
                    <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h2 class="titulo_item_contador">${anos !== 0 ? String(anos).padStart(2, '0') : '0'}</h2>
                            <span class="descricao_item_contador">${anos >= 2 ? 'Anos' : 'Ano'}</span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

    document.getElementById("section_inicial").insertAdjacentHTML('afterend', sectionResultado);
    intervalo.tabela !== '' ? document.getElementById("resultado").insertAdjacentHTML('afterend', intervalo.sectionTabela) : null;

}

});