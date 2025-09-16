# MealPal PWA - Aplicativo de Rastreamento de Refeições

Um Progressive Web App (PWA) completo para rastrear e gerenciar suas refeições diárias, otimizado para dispositivos móveis Android e iOS.

## 🚀 Características

- **PWA Completo**: Instalável como app nativo em Android e iOS
- **Funcionalidade Offline**: Funciona sem conexão com a internet
- **Cache Inteligente**: Armazena dados localmente para acesso rápido
- **Interface Responsiva**: Otimizada para dispositivos móveis
- **Modo Escuro**: Suporte automático ao tema do sistema
- **Exportar/Importar Dados**: Backup completo dos seus dados
- **Notificações**: Lembretes e atualizações do app

## 📱 Como Instalar

### No Android (Chrome/Edge)

1. Abra o aplicativo no navegador Chrome ou Edge
2. Toque no menu (três pontos) no canto superior direito
3. Selecione "Instalar app" ou "Adicionar à tela inicial"
4. Confirme a instalação
5. O app aparecerá na sua tela inicial como um app nativo

### No iOS (Safari)

1. Abra o aplicativo no Safari
2. Toque no botão de compartilhar (quadrado com seta)
3. Role para baixo e toque em "Adicionar à Tela Inicial"
4. Toque em "Adicionar" no canto superior direito
5. O app aparecerá na sua tela inicial

### No Desktop (Chrome/Edge/Firefox)

1. Abra o aplicativo no navegador
2. Procure pelo ícone de instalação na barra de endereços
3. Clique em "Instalar" quando aparecer
4. O app será instalado como uma aplicação desktop

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com variáveis CSS
- **JavaScript ES6+**: Funcionalidades modernas
- **Service Worker**: Cache e funcionalidade offline
- **Web App Manifest**: Configuração do PWA
- **Lucide Icons**: Ícones modernos e consistentes

## 📋 Funcionalidades

### Rastreamento de Refeições
- Registre refeições com nome, tipo, horário e descrição
- Visualize estatísticas diárias e semanais
- Histórico completo de todas as refeições
- Editar e excluir refeições existentes

### Gerenciamento de Dados
- **Exportar**: Baixe seus dados em formato JSON
- **Importar**: Restaure dados de backup
- **Limpar**: Remova todos os dados (com confirmação)
- **Cache Local**: Dados salvos automaticamente no dispositivo

### Interface Intuitiva
- Design limpo e moderno
- Navegação simples e intuitiva
- Feedback visual para todas as ações
- Mensagens motivacionais personalizadas

## 🔧 Configuração Técnica

### Service Worker
O app inclui um Service Worker robusto que:
- Cache recursos estáticos para carregamento rápido
- Funciona offline com fallbacks inteligentes
- Atualiza automaticamente quando há novas versões
- Gerencia cache dinâmico para melhor performance

### Manifest.json
Configurado com:
- Ícones em múltiplos tamanhos (192x192, 512x512)
- Suporte para modo standalone
- Cores de tema personalizadas
- Orientação portrait para mobile

### Meta Tags
Inclui meta tags específicas para:
- iOS (apple-mobile-web-app-*)
- Android (mobile-web-app-*)
- Windows (msapplication-*)
- Acessibilidade e SEO

## 📱 Compatibilidade

### Navegadores Suportados
- **Android**: Chrome 80+, Edge 80+, Samsung Internet 12+
- **iOS**: Safari 14+, Chrome 80+
- **Desktop**: Chrome 80+, Edge 80+, Firefox 74+

### Recursos PWA
- ✅ Service Worker
- ✅ Web App Manifest
- ✅ Cache API
- ✅ Background Sync
- ✅ Push Notifications (preparado)
- ✅ Install Prompt

## 🚀 Como Executar Localmente

1. Clone ou baixe o repositório
2. Abra um servidor HTTP local:
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # Usando Node.js
   npx serve .
   
   # Usando PHP
   php -S localhost:8000
   ```
3. Acesse `http://localhost:8000` no navegador
4. Para testar como PWA, use HTTPS (necessário para Service Worker)

## 📦 Estrutura do Projeto

```
meal-tracker-app/
├── index.html          # Página principal
├── manifest.json       # Configuração do PWA
├── sw.js              # Service Worker
├── app.js             # Lógica da aplicação
├── styles.css         # Estilos CSS
├── icons/             # Ícones do PWA
│   ├── icon-192x192.jpg
│   └── icon-512x512.jpg
└── README.md          # Este arquivo
```

## 🔒 Privacidade e Segurança

- **Dados Locais**: Todos os dados são armazenados localmente no dispositivo
- **Sem Servidor**: Não há coleta de dados externa
- **HTTPS**: Funciona apenas com conexões seguras
- **Cache Seguro**: Dados em cache são criptografados pelo navegador

## 🐛 Solução de Problemas

### App não instala
- Verifique se está usando HTTPS
- Confirme que o navegador suporta PWA
- Limpe o cache do navegador

### Dados não salvam
- Verifique se o localStorage está habilitado
- Confirme que há espaço suficiente no dispositivo
- Teste em modo incógnito

### Service Worker não funciona
- Verifique se está em HTTPS
- Confirme que o arquivo sw.js está acessível
- Verifique o console do navegador para erros

## 📈 Próximas Funcionalidades

- [ ] Notificações push para lembretes
- [ ] Sincronização entre dispositivos
- [ ] Análise nutricional básica
- [ ] Metas e objetivos personalizados
- [ ] Compartilhamento de refeições
- [ ] Modo escuro manual

## 🤝 Contribuição

Este é um projeto de demonstração. Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Contribuir com código
- Compartilhar feedback

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

**MealPal PWA** - Seu companheiro de refeições sempre com você! 🍽️
