document.getElementById('financiamento-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtém os valores dos inputs
    const valor = parseFloat(document.getElementById('valor').value);
    const taxa = parseFloat(document.getElementById('taxa').value) / 100;
    const parcelas = parseInt(document.getElementById('parcelas').value);

    // Valida os valores
    if (isNaN(valor) || isNaN(taxa) || isNaN(parcelas) || valor <= 0 || taxa <= 0 || parcelas <= 0) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Calcula o valor da parcela
    const taxaMensal = taxa / 12;
    const parcela = (valor * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -parcelas));
    const total = parcela * parcelas;
    const juros = total - valor;

    // Exibe o resultado
    document.getElementById('parcela').textContent = parcela.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
    document.getElementById('juros').textContent = juros.toFixed(2);

    // Mostra a seção de resultado com animação
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.classList.add('show');

    // Se já houver gráfico, destrua-o antes de criar um novo
    const ctx = document.getElementById('grafico').getContext('2d');
    if (window.grafico) {
        window.grafico.destroy(); // Destruir gráfico anterior se existir
    }

    // Exibe o gráfico
    window.grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: parcelas }, (_, i) => `Parcela ${i + 1}`),
            datasets: [{
                label: 'Saldo Devedor',
                data: Array.from({ length: parcelas }, (_, i) => valor - (parcela * (i + 1))),
                borderColor: '#007bff',
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return `R$ ${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
});

// Limpar os campos e o gráfico
document.getElementById('reset').addEventListener('click', function() {
    document.getElementById('valor').value = '';
    document.getElementById('taxa').value = '';
    document.getElementById('parcelas').value = '';
    document.getElementById('resultado').classList.remove('show');

    // Limpar o gráfico
    const ctx = document.getElementById('grafico').getContext('2d');
    if (window.grafico) {
        window.grafico.destroy(); // Destruir o gráfico
    }
});