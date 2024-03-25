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
            var dataAtual = new Date();
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
                enviaDados('');

                function enviaDados(feriados_e_facultativosString) {
                    setTimeout(function () {
                        var parametro_feriados_e_facultativos = feriados_e_facultativosString !== '' ? `&feriados_e_facultativos=${encodeURIComponent(feriados_e_facultativosString)}` : '';
                        var parametros = `?data_inicial=${encodeURIComponent(inputDataNascimento.value)}&data_final=${encodeURIComponent(inputDataFinal.value)}&incluir_dia_inicial=${encodeURIComponent(inputIncluirDiaInicial.checked)}&incluir_feriados_e_facultativos=${encodeURIComponent(inputIncluirFeriadoseFacultativos.checked)}${parametro_feriados_e_facultativos}`;
                        window.location.href = window.location.pathname + parametros;
                    }, 1200);
                }


            }

        }


    });

    inputDataNascimento.addEventListener("focus", function() {
        ocultaNotificacao(verificaTipoAlerta(divNotificacaoContador), inputDataNascimento, divNotificacaoContador);
    });

    inputDataFinal.addEventListener("focus", function() {
        ocultaNotificacao(verificaTipoAlerta(divNotificacaoContador), inputDataFinal, divNotificacaoContador);
    });

function calculaMeses(dataNascimento,dataFinal, roundUpFractionalMonths) {

    var startDate = dataNascimento;
    var endDate = dataFinal;
    endDate.setDate(endDate.getDate() + 2)
    var inverse=false;
    
    if(dataNascimento>dataFinal) {
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

function calculaIntervalo(dataNascimentoStr, dataFinalStr, incluirDiaInicial, incluirFeriadoseFacultativos, datasEspeciais) {

    var dataNascimento = new Date(dataNascimentoStr);
    var dataFinal = new Date(dataFinalStr);
    
    //INCLUI O DIA INICIAL NA CONTAGEM CASO FOR TRUE
    if(incluirDiaInicial === 'true') {
        dataNascimento.setDate(dataNascimento.getDate() - 1);
    }

    // Função para verificar se uma data é feriado
    function isFeriado(data) {
        return datasEspeciais.some(feriado => {
            var feriadoDataObj = new Date(feriado.data.split('/').reverse().join('-'));
            return data.toDateString() === feriadoDataObj.toDateString() && feriado.tipo === 'Feriado';
        });
    }

    // Função para verificar se uma data é ponto facultativo
    function isFacultativo(data) {
        return datasEspeciais.some(facultativo => {
            var facultativoDataObj = new Date(facultativo.data.split('/').reverse().join('-'));
            return data.toDateString() === facultativoDataObj.toDateString() && facultativo.tipo === 'Facultativo';
        });
    }

    // Inicializa variáveis
    var diasUteis = 0;
    var feriados = 0;
    var facultativos = 0;
    var dataAtual = new Date(dataNascimento);
    var conteudoTabela = '';

    // Loop através dos dias entre as datas
    while (dataAtual <= dataFinal) {
        if (isFeriado(dataAtual)) {
            feriados++;
            var feriado = datasEspeciais.find(feriado => {
                var feriadoDataObj = new Date(feriado.data.split('/').reverse().join('-'));
                return dataAtual.toDateString() === feriadoDataObj.toDateString() && feriado.tipo === 'Feriado';
            });
            
            if (feriado) {
                conteudoTabela += `<tr><td class="dtr-control">${feriado.data.substr(0, 10).split('-').reverse().join('/')}</td><td class="dtr-control">${feriado.nome}</td><td class="dtr-control">Feriado</td></tr>`;
            }

        }

        if (isFacultativo(dataAtual)) {
            facultativos++;
            var facultativo = datasEspeciais.find(facultativo => {
                var facultativoDataObj = new Date(facultativo.data.split('/').reverse().join('-'));
                return dataAtual.toDateString() === facultativoDataObj.toDateString() && facultativo.tipo === 'Facultativo';
            });

            if (facultativo) {
                conteudoTabela += `<tr><td class="dtr-control">${facultativo.data.substr(0, 10).split('-').reverse().join('/')}</td><td class="dtr-control">${facultativo.nome}</td><td class="dtr-control">Ponto Facultativo</td></tr>`;
            }

        }
        
        if ((dataAtual.toDateString() !== dataNascimento.toDateString() && !isFeriado(dataAtual) && dataAtual.getDay() !== 5 && dataAtual.getDay() !== 6)) {
            diasUteis++;
        }

        // Avança para o próximo dia
        dataAtual.setDate(dataAtual.getDate() + 1);
    }

    //CALCULA OS DIAS CORRIDOS
    var diasCorridos = Math.floor((dataFinal - dataNascimento) / (1000 * 60 * 60 * 24));

    var tabela = `<div style="padding-bottom: 25px;" class="container"><div><table style="margin-top:0px;" class="table tabela-customizada table-striped table-bordered dt-responsive nowrap dataTable no-footer dtr-inline"><thead style="background-color: var(--cor-primaria); color: #FFF;"><tr><th>DATA</th><th>NOME</th><th>TIPO</th></tr></thead><tbody>${conteudoTabela}</tbody></table></div></div>`;

    return {
        diasCorridos: diasCorridos,
        diasUteis: diasUteis,
        feriados: feriados,
        facultativos: facultativos,
        meses: calculaMeses(dataNascimento, dataFinal),
        sectionTabela: conteudoTabela !== '' ? tabela : ''
    };
}

//RECUPERA OS PARÂMETROS DA URL
var urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('data_inicial') && urlParams.has('data_final') && urlParams.has('incluir_dia_inicial')) {

    //RECUPERA E SETA OS PARÂMETROS
    var dataNascimento = urlParams.get('data_inicial');
    var dataFinal = urlParams.get('data_final');
    var incluirDiaInicial = urlParams.get('incluir_dia_inicial');
    var incluirFeriadoseFacultativos = urlParams.get('incluir_feriados_e_facultativos');
    var feriados_e_facultativosArray = [];
    
    //RECUPERA OS FERIADOS E FACULTATIVOS DA URL CASO ESTEJA SOLICITADO PARA INCLUIR
    if(incluirFeriadoseFacultativos === 'true') {
        var feriados_e_facultativos = urlParams.get('feriados_e_facultativos');
        feriados_e_facultativosArray = JSON.parse(decodeURIComponent(feriados_e_facultativos));
    }
    
    //TRATA DATA PARA FORMATO UNIVERSAL
    var dataNascimentoUniversal = dataNascimento.substring(0, 10).split('/').reverse().join('-');
    var dataFinalUniversal = dataFinal.substring(0, 10).split('/').reverse().join('-');

    var intervalo = calculaIntervalo(dataNascimentoUniversal, dataFinalUniversal, incluirDiaInicial, incluirFeriadoseFacultativos, feriados_e_facultativosArray);

    var diasUteis = intervalo.diasUteis;
    var diasCorridos = intervalo.diasCorridos;
    var meses = intervalo.meses;
    var semanas = Math.floor(intervalo.diasCorridos / 7);
    var feriados = intervalo.feriados;
    var facultativos = intervalo.facultativos;

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
                <div class="col-md-4">
                    <div class="form-group">
                    <label class="label"><b style="font-weight:600">DATA INICIAL</b></label>
                    <input style="font-size: 1.5rem;" type="text" value="${dataNascimento}" class="form-control add__date-one" id="data_inicial" readonly="readonly">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                    <label class="label"><b style="font-weight:600">DATA FINAL</b></label>
                    <input style="font-size: 1.5rem;" type="text" value="${dataFinal}" class="form-control add__date-two" id="data_final" readonly="readonly"/>
                    </div>
                </div>
                <div class="col-md-4 mt-3 mt-md-4">
                    <a href="/ferramentas/contador-de-dias-calculadora-prazo-entre-datas" class="align-middle"><button style="width:100%;" class="btn_1 full-width fe-pulse" type="button">FAZER NOVO CÁLCULO</button></a>
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
                            <h2 class="titulo_item_contador">${diasUteis !== 0 ? String(diasUteis).padStart(2, '0') : '0'}</h2>
                            <span class="descricao_item_contador">${diasUteis >= 2 ? 'Dias úteis' : 'Dia útil'}</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-6 col-sm-6 col-6">
                    <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h2 class="titulo_item_contador">${diasCorridos !== 0 ? String(diasCorridos).padStart(2, '0') : '0'}</h2>
                            <span class="descricao_item_contador">${diasCorridos >= 2 ? 'Dias corridos' : 'Dia corrido'}</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-6 col-sm-6 col-12">
                    <div class="card">
                    <div class="card-content">
                        <div class="card-body">
                            <h2 class="titulo_item_contador">${semanas !== 0 ? String(semanas).padStart(2, '0') : 'Nenhuma'}</h2>
                            <span class="descricao_item_contador">${semanas >= 2 ? 'Semanas' : 'Semana'}${semanas !== 0 ? (diasCorridos % 7 !== 0 ? (diasCorridos % 7 >= 2 ? ' e ' + (diasCorridos % 7) + ' dias' : ' e ' + (diasCorridos % 7) + ' dia') : '') : ''}</span>
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
                ${incluirFeriadoseFacultativos === 'true' ? `
                    <div class="col-xl-6 col-sm-6 col-6">
                        <div class="card">
                            <div class="card-content">
                                <div class="card-body">
                                    <h2 class="titulo_item_contador">${feriados !== 0 ? String(feriados).padStart(2, '0') : 'Nenhum'}</h2>
                                    <span class="descricao_item_contador">${feriados >= 2 ? 'Feriados' : 'Feriado'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-6 col-sm-6 col-6">
                        <div class="card">
                            <div class="card-content">
                                <div class="card-body">
                                    <h2 class="titulo_item_contador">${facultativos !== 0 ? String(facultativos).padStart(2, '0') : 'Nenhum'}</h2>
                                    <span class="descricao_item_contador">${facultativos >= 2 ? 'Facultativos' : 'Facultativo'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    </section>`;

    document.getElementById("section_inicial").insertAdjacentHTML('afterend', sectionResultado);
    intervalo.tabela !== '' ? document.getElementById("resultado").insertAdjacentHTML('afterend', intervalo.sectionTabela) : null;

}

});