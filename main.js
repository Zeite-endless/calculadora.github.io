cont = 1

class calculator {
    constructor(input, output) {
        this.inputDisplay = input;
        this.outputDisplay = output;
        this.Historico = []
    }

    //FUNÇÕES PRIMÁRIAS
    limparHistorico() {
        this.Historico = [];
        this.attInput();
        this.attOutput("0");
        cont = 1
    }

    backspace() {
        switch (this.tipoLastInput()) {
            case "number":
                if (this.lastInputValue().length > 1) {
                    this.editarUltimoInput(this.lastInputValue().slice(0, -1), "number");
                } else {
                    this.deleteLastInput();
                }
                break;
            case "operator":
                this.deleteLastInput();
                break;
            default:
                return;
        }
    }

    abrirGuia() {
        window.open('https://class.faculdadeiv2.com.br/')
    }

    inserirNumero(value) {
        if (this.tipoLastInput() === "number") {
            this.apenderUltimoInput(value);
            cont++;
            if(cont > 8){
                alert("Números com mais de 8 casas decimais não são permitidos")
                this.limparHistorico()
            }
        } else if (this.tipoLastInput() === "operator" || this.tipoLastInput() === null) {
            this.adicionarNovoInput(value, "number")
        }
    }

    inserirOperacao(value) {
        cont = 1;
        switch (this.tipoLastInput()) {
            case "number":
                this.adicionarNovoInput(value, "operator");
                break;
            case "operator":
                this.editarUltimoInput(value, "operator");
                break;
            case "equals":
                let output = this.getOutputValues();
                this.limparHistorico();
                this.adicionarNovoInput(output, "number");
                this.adicionarNovoInput(value, "operator");
                break;
            default:
                return;
        }
    }

    negateNumber() {
        cont--;
        if (this.tipoLastInput() === "number") {
            this.editarUltimoInput(parseFloat(this.lastInputValue()) * -1, "number");
        }
    }

    insertDecimalPoint() {
        cont--;
        if (this.tipoLastInput() === "number" && !this.lastInputValue().includes(".")) {
            this.apenderUltimoInput(".")
        } else if (this.tipoLastInput() === "operator" || this.tipoLastInput() === null) {
            this.adicionarNovoInput("0.", "number");
        }
    }

    gerarResultado() {
        if (this.tipoLastInput() === "number") {
            const self = this;
            const simplificarExpressao = function (currentExpression, operator) {
                if (currentExpression.indexOf(operator) === -1) {
                    return currentExpression;
                } else {
                    let operatorIdx = currentExpression.indexOf(operator);
                    let leftOperatorIdx = operatorIdx - 1;
                    let rightOperatorIdx = operatorIdx + 1;

                    let partialSolution = self.performOperation(...currentExpression.slice(leftOperatorIdx, rightOperatorIdx + 1));

                    currentExpression.splice(leftOperatorIdx, 3, partialSolution.toString());

                    return simplificarExpressao(currentExpression, operator);
                }
            }

            let result = ["x", "÷", "-", "+"].reduce(simplificarExpressao, this.pegarTodosValores());
            this.adicionarNovoInput("=", "equals");
            this.attOutput(result.toString());
        }
    }


    //FUNÇÕES SECUNDÁRIAS
    tipoLastInput() {
       return (this.Historico.length === 0) ? null : this.Historico[this.Historico.length - 1].type;
       
    }

    lastInputValue() {
        return (this.Historico.length === 0) ? null : this.Historico[this.Historico.length - 1].value;
    }

    getOutputValues() {
        return this.outputDisplay.value.replace(/,/g, ",");
    }

    adicionarNovoInput(value, type) {
        this.Historico.push({ "type": type, "value": value.toString() });
        this.attInput();
    }

    apenderUltimoInput(value) {
        this.Historico[this.Historico.length - 1].value += value.toString();
        this.attInput();
    }

    pegarTodosValores() {
        return this.Historico.map(entry => entry.value);
    }

    editarUltimoInput(value, type) {
        this.Historico.pop();
        this.adicionarNovoInput(value, type);
    }

    deleteLastInput() {
        this.Historico.pop();
        this.attInput();
    }

    attInput() {
        this.inputDisplay.value = this.pegarTodosValores().join(" ");
    }

    attOutput(value) {
        this.outputDisplay.value = Number(value).toLocaleString();
    }

    performOperation(leftOperator, operation, rightOperator) {
        leftOperator = parseFloat(leftOperator);
        rightOperator = parseFloat(rightOperator);

        if (Number.isNaN(leftOperator) || Number.isNaN(rightOperator)) {
            return;
        }

        switch (operation) {
            case "x":
                return leftOperator * rightOperator;
            case "÷":
                return leftOperator / rightOperator;
            case "-":
                return leftOperator - rightOperator;
            case "+":
                return leftOperator + rightOperator;
        }
    }
}

const inputDisplay = document.querySelector("#historico");
const outputDisplay = document.querySelector("#result");
const botaoLimparTudo = document.querySelector("[data-all-clear]");
const botaobackspace = document.querySelector("[data-backspace]");
const botaoPorcento = document.querySelector("[data-percent]");
const botoesoperator = document.querySelectorAll("[data-operator]");
const botoesNumeros = document.querySelectorAll("[data-number]");
const botaoNegativar = document.querySelector("[data-negation]");
const botaoDecimal = document.querySelector("[data-decimal]");
const botaoResultado = document.querySelector("[data-equals]");

const calculadora = new calculator(inputDisplay, outputDisplay);

botaoLimparTudo.addEventListener("click", () => {
    calculadora.limparHistorico();
});

botaobackspace.addEventListener("click", () => {
    calculadora.backspace();
});

botaoPorcento.addEventListener("click", () => {
    calculadora.abrirGuia();
});

botoesoperator.forEach(button => {
    button.addEventListener("click", (event) => {
        let { target } = event;
        calculadora.inserirOperacao(target.dataset.operator);
    })
});

botoesNumeros.forEach(button => {
    button.addEventListener("click", (event) => {
        let { target } = event;
        calculadora.inserirNumero(target.dataset.number);

    })
});

botaoNegativar.addEventListener("click", () => {
    calculadora.negateNumber();
});

botaoDecimal.addEventListener("click", () => {
    calculadora.insertDecimalPoint();
});

botaoResultado.addEventListener("click", () => {
    calculadora.gerarResultado();
});