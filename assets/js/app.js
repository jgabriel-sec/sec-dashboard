/* ==========================================================================
   SecDashboard - Lógica de Análise e Validação de Senhas
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("password-form");
  const passwordInput = document.getElementById("password-input");
  const resultBox = document.getElementById("result-box");

  // Escuta o evento de submissão do formulário
  form.addEventListener("submit", (event) => {
    // Evita o recarregamento padrão da página
    event.preventDefault();

    const password = passwordInput.value;

    // Executa a validação de segurança
    const analysis = analyzePasswordStrength(password);

    // Renderiza o resultado na tela de forma segura
    renderResult(analysis);
  });

  /**
   * Função que analisa os critérios de segurança e entropia básica da senha
   * @param {string} pwd - Senha inserida pelo usuário
   * @returns {Object} - Relatório com status, cor e recomendações
   */
  function analyzePasswordStrength(pwd) {
    if (!pwd) {
      return {
        status: "aviso",
        message: "Por favor, insira uma senha válida para iniciar a análise.",
        color: "var(--text-secondary)"
      };
    }

    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      symbols: /[^A-Za-z0-9]/.test(pwd)
    };

    // Pontuação baseada em critérios clássicos de hardening de senhas
    if (checks.length) score++;
    if (checks.lowercase && checks.uppercase) score++;
    if (checks.numbers) score++;
    if (checks.symbols) score++;
    if (pwd.length >= 12) score++; // Bônus para senhas longas

    // Classificação do nível de segurança
    if (score <= 2) {
      return {
        status: "Fraca",
        message: "Senha vulnerável a ataques de força bruta. Adicione mais caracteres, números e símbolos.",
        color: "#f87171" // Vermelho de alerta
      };
    } else if (score <= 4) {
      return {
        status: "Moderada",
        message: "Boa complexidade, mas considere aumentar o comprimento para pelo menos 12 caracteres.",
        color: "#fbbf24" // Amarelo de atenção
      };
    } else {
      return {
        status: "Forte",
        message: "Excelente entropia! Atende aos padrões robustos de segurança de credenciais.",
        color: "#4ade80" // Verde de sucesso
      };
    }
  }

  /**
   * Atualiza o elemento visual de resultado na interface
   * @param {Object} analysis - Objeto contendo o resultado da análise
   */
  function renderResult(analysis) {
    resultBox.style.borderLeftColor = analysis.color;
    resultBox.innerHTML = `
      <p><strong>Diagnóstico:</strong> <span style="color: ${analysis.color}; font-weight: bold;">${analysis.status}</span></p>
      <p style="margin-top: 0.5rem;">${analysis.message}</p>
    `;
  }
});