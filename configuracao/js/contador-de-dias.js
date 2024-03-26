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

    document.getElementById("data_inicial").addEventListener("focusout", function() {
        var dataInicial = document.getElementById("data_inicial");
        if (dataInicial.value == "__/__/____") {
            dataInicial.value = "";
            var dataInicialExtensa = document.getElementById("data_inicial_extensa");
            if (dataInicialExtensa) {
                dataInicialExtensa.remove();
            }
        }
    });

    document.getElementById("data_final").addEventListener("focusout", function() {
        var dataFinal = document.getElementById("data_final");
        if (dataFinal.value == "__/__/____") {
            dataFinal.value = "";
            var dataFinalExtensa = document.getElementById("data_final_extensa");
            if (dataFinalExtensa) {
                dataFinalExtensa.remove();
            }
        }
    });

    var momentFormat = 'DD/MM/YYYY';
    var momentMask = IMask(document.getElementById('data_inicial'), {
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
        GeraDataExtenso('data_inicial');
    });

    var momentMask = IMask(document.getElementById('data_final'), {
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
        GeraDataExtenso('data_final');
    });

    //LIMPA DATAS INICIAIS SETADAS PELA MASK
    $("#data_final").val("");
    $("#data_inicial").val("");

    function GeraDataExtenso(campo) {
        let nome_campo = campo.replace('_', ' ');
        moment.locale('pt-br');
        let data_extenso = moment(document.getElementById(campo).value, 'DD/MM/YYYY', true).format('dddd[,] DD [de] MMMM [de] YYYY');
        $("#descricao_" + campo).html('<span id="' + campo + '_extensa"><strong style="text-transform: capitalize;">' + nome_campo + ':</strong> ' + data_extenso + '</span>');
    }

    $(document).on("click", '#abrir_calendario_data_inicial', function() {
        var $picker_data_inicial = $('#data_inicial').pickadate({
            monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            editable: true,
            format: 'dd/mm/yyyy',
            today: '',
            clear: '',
            close: 'DIGITAR MANUALMENTE',
            onClose: function(thingSet) {
                picker.stop();
                momentMask.updateValue();
                GeraDataExtenso('data_inicial');
            }
        })
        var picker = $picker_data_inicial.pickadate('picker');
        picker.open();
    })

    $(document).on("click", '#abrir_calendario_data_final', function() {
        var $picker_data_final = $('#data_final').pickadate({
            monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            editable: true,
            format: 'dd/mm/yyyy',
            today: '',
            clear: '',
            close: 'DIGITAR MANUALMENTE',
            onClose: function(thingSet) {
                picker.stop();
                momentMask.updateValue();
                GeraDataExtenso('data_final');
            }
        })
        var picker = $picker_data_final.pickadate('picker');
        picker.open();
    })


    $(document).on("click", "#abrir_calendario_data_inicial", function() {
        setaPickerDataFinal();
        if (picker_data_final.get("select") != null) {
            setaPickerDataInicial(picker_data_final.get("select"));
        }
        setaPickerDataInicial();
        picker_data_inicial.open();
        picker_data_final.stop();
    });

    $(document).on("click", "#abrir_calendario_data_final", function() {
        setaPickerDataInicial();
        if (picker_data_inicial.get("select") != null) {
            setaPickerDataFinal(picker_data_inicial.get("select"));
        }
        setaPickerDataFinal();
        picker_data_final.open();
        picker_data_inicial.stop();
    });

    function setaPickerDataInicial(data_final) {
        var $picker_data_inicial = $("#data_inicial").pickadate({
            monthsFull: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", ],
            monthsShort: ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", ],
            weekdaysFull: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", ],
            weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            editable: true,
            format: "dd/mm/yyyy",
            today: "",
            clear: "",
            close: "DIGITAR MANUALMENTE",
            onClose: function(thingSet) {
                picker_data_inicial.stop();
                momentMask.updateValue();
                GeraDataExtenso("data_inicial");
            },
            onSet: function(thingSet) {
                picker_data_inicial.stop();
            },
        });
        picker_data_inicial = $picker_data_inicial.pickadate("picker");
        if (data_final != null) {
            picker_data_inicial.set("max", data_final);
        }
    }

    function setaPickerDataFinal(data_inicial) {
        let $picker_data_final = $("#data_final").pickadate({
            monthsFull: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", ],
            monthsShort: ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", ],
            weekdaysFull: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", ],
            weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            editable: true,
            format: "dd/mm/yyyy",
            today: "",
            clear: "",
            close: "DIGITAR MANUALMENTE",
            onClose: function(thingSet) {
                picker_data_final.stop();
                momentMask.updateValue();
                GeraDataExtenso("data_final");
            },
            onSet: function(thingSet) {
                picker_data_final.stop();
            },
        });
        picker_data_final = $picker_data_final.pickadate("picker");
        if (data_inicial != null) {
            picker_data_final.set("min", data_inicial);
        }
    }

    /* FUNÇÃO PARA VALIDAR E ENVIAR FORMULÁRIO DE CONTATO */
    const formContador = document.querySelector("#formulario-contador-de-dias");

    const inputDataInicial = formContador.querySelector("#data_inicial");
    const inputDataFinal = formContador.querySelector("#data_final");
    const inputIncluirDiaInicial = formContador.querySelector("#incluir_dia_inicial");
    const inputIncluirFeriadoseFacultativos = formContador.querySelector("#incluir_feriados_e_facultativos");
    
    const botaoCalcularDias = document.querySelector("#calcular_dias");
    const divNotificacaoContador = document.querySelector("#div_notificacao_contador");
    const divBarraContador = document.querySelector("#div_barra_contador");
    
    botaoCalcularDias.addEventListener("click", function(event) {
        event.preventDefault();

        if (inputDataInicial.value === "") {
            exibirNotificacao("erro", "Erro, preencha a data inicial", inputDataInicial, divNotificacaoContador);
        } else if (inputDataFinal.value === "") {
            exibirNotificacao("erro", "Erro, preencha a data final", inputDataFinal, divNotificacaoContador);
        } else {
            //TODOS OS CAMPOS PREENCHIDOS

            // Converta as datas para o formato ISO (yyyy-mm-dd)
            var dataInicial = new Date(inputDataInicial.value.split('/').reverse().join('-'));
            var dataFinal = new Date(inputDataFinal.value.split('/').reverse().join('-'));

            //CALCULA O INTERVALO
            var diffInMilliseconds = Math.abs(dataFinal - dataInicial);
            var intervaloEmDias = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

            if (intervaloEmDias === 0) {
                exibirNotificacao("erro",  "Erro, a data final é igual à data inicial.", inputDataFinal, divNotificacaoContador);
            } else if (intervaloEmDias < 1) {
                exibirNotificacao("erro",  "Erro, a final é menor que a data inicial.", inputDataFinal, divNotificacaoContador);
            } else {

                divBarraContador.innerHTML = '<div style="height: 1.5rem;" class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
                divBarraContador.classList.remove("d-none");
                divBarraContador.classList.add("d-block", "fade", "show");
                
                criaBarraProgresso(1350);
                
                if(inputIncluirFeriadoseFacultativos.checked === true) {

                    fetch('/configuracao/json/feriados-nacionais.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Erro ao buscar dados. Código de status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(json => {

                        var feriados_e_facultativos = [];
                        while (dataInicial <= dataFinal) {
                        
                            var listaDatasJson = json.find(datas => {
                                var dia = new Date(datas.data);
                                return dataInicial.toDateString() === dia.toDateString() && datas.tipo === 'Feriado' || dataInicial.toDateString() === dia.toDateString() && datas.tipo === 'Facultativo';
                            });
                        
                            if (listaDatasJson) {
                                feriados_e_facultativos.push({
                                    data: listaDatasJson.data.substr(0, 10).split('-').reverse().join('/'),
                                    nome: listaDatasJson.nome,
                                    tipo: listaDatasJson.tipo,
                                });
                            }
                        
                            dataInicial.setDate(dataInicial.getDate() + 1);
                        }
                        
                        var feriados_e_facultativosString = JSON.stringify(feriados_e_facultativos);
                        
                        enviaDados(feriados_e_facultativosString);
                        
            
                    })
                    .catch(error => {
                        console.error('Erro ao buscar dados:', error);
                    });
                    
                } else {
                    enviaDados('');
                }

                function enviaDados(feriados_e_facultativosString) {
                    setTimeout(function () {
                        var parametro_feriados_e_facultativos = feriados_e_facultativosString !== '' ? `&feriados_e_facultativos=${encodeURIComponent(feriados_e_facultativosString)}` : '';
                        var parametros = `?data_inicial=${encodeURIComponent(inputDataInicial.value)}&data_final=${encodeURIComponent(inputDataFinal.value)}&incluir_dia_inicial=${encodeURIComponent(inputIncluirDiaInicial.checked)}&incluir_feriados_e_facultativos=${encodeURIComponent(inputIncluirFeriadoseFacultativos.checked)}${parametro_feriados_e_facultativos}`;
                        window.location.href = window.location.pathname + parametros;
                    }, 1200);
                }


            }

        }


    });

    inputDataInicial.addEventListener("focus", function() {
        ocultaNotificacao(verificaTipoAlerta(divNotificacaoContador), inputDataInicial, divNotificacaoContador);
    });

    inputDataInicial.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            botaoCalcularDias.click();
        }
    });

    inputDataFinal.addEventListener("focus", function() {
        ocultaNotificacao(verificaTipoAlerta(divNotificacaoContador), inputDataFinal, divNotificacaoContador);
    });

    inputDataFinal.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            botaoCalcularDias.click();
        }
    });

function calculaMeses(dataInicial,dataFinal, roundUpFractionalMonths) {

    var startDate = dataInicial;
    var endDate = dataFinal;
    endDate.setDate(endDate.getDate() + 2)
    var inverse=false;
    
    if(dataInicial>dataFinal) {
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

function calculaIntervalo(dataInicialStr, dataFinalStr, incluirDiaInicial, incluirFeriadoseFacultativos, datasEspeciais) {

    var dataInicial = new Date(dataInicialStr);
    var dataFinal = new Date(dataFinalStr);
    
    //INCLUI O DIA INICIAL NA CONTAGEM CASO FOR TRUE
    if(incluirDiaInicial === 'true') {
        dataInicial.setDate(dataInicial.getDate() - 1);
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
    var dataAtual = new Date(dataInicial);
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
        
        if ((dataAtual.toDateString() !== dataInicial.toDateString() && !isFeriado(dataAtual) && dataAtual.getDay() !== 5 && dataAtual.getDay() !== 6)) {
            diasUteis++;
        }

        // Avança para o próximo dia
        dataAtual.setDate(dataAtual.getDate() + 1);
    }

    //CALCULA OS DIAS CORRIDOS
    var diasCorridos = Math.floor((dataFinal - dataInicial) / (1000 * 60 * 60 * 24));

    var tabela = `<div style="padding-bottom: 25px;" class="container"><div><table style="margin-top:0px;" class="table tabela-customizada table-striped table-bordered dt-responsive nowrap dataTable no-footer dtr-inline"><thead style="background-color: var(--cor-primaria); color: #FFF;"><tr><th>DATA</th><th>NOME</th><th>TIPO</th></tr></thead><tbody>${conteudoTabela}</tbody></table></div></div>`;

    return {
        diasCorridos: diasCorridos,
        diasUteis: diasUteis,
        feriados: feriados,
        facultativos: facultativos,
        meses: calculaMeses(dataInicial, dataFinal),
        sectionTabela: conteudoTabela !== '' ? tabela : ''
    };
}

//RECUPERA OS PARÂMETROS DA URL
var urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('data_inicial') && urlParams.has('data_final') && urlParams.has('incluir_dia_inicial')) {

    //RECUPERA E SETA OS PARÂMETROS
    var dataInicial = urlParams.get('data_inicial');
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
    var dataInicialUniversal = dataInicial.substring(0, 10).split('/').reverse().join('-');
    var dataFinalUniversal = dataFinal.substring(0, 10).split('/').reverse().join('-');

    var intervalo = calculaIntervalo(dataInicialUniversal, dataFinalUniversal, incluirDiaInicial, incluirFeriadoseFacultativos, feriados_e_facultativosArray);

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
                    <input style="font-size: 1.5rem;" type="text" value="${dataInicial}" class="form-control add__date-one" id="data_inicial" readonly="readonly">
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