// MealPal PWA - JavaScript Application
class MealPal {
  constructor() {
    this.meals = []
    this.isLoading = true
    this.editingMeal = null
    this.currentMessage = "Olá! Vamos registrar suas refeições hoje?"

    this.STORAGE_KEY = "mealpal-meals"
    this.motivationalMessages = {
      mealAdded: [
        "Ótima escolha! Continue assim!",
        "Que delícia! Você está cuidando bem da sua alimentação!",
        "Parabéns por registrar sua refeição!",
        "Estou orgulhoso de você! Continue nesse ritmo!",
      ],
      encouragement: [
        "Você está indo muito bem!",
        "Cada refeição registrada é um passo em direção aos seus objetivos!",
        "Continue assim, você está no caminho certo!",
        "Que orgulho de você!",
      ],
    }

    this.init()
  }

  async init() {
    await this.loadMeals()
    this.setupEventListeners()
    this.setupOfflineHandling()
    this.updateUI()
    this.hideLoading()

    // Initialize Lucide icons
    const lucide = window.lucide // Declare the lucide variable
    if (lucide) {
      lucide.createIcons()
    }
  }

  async loadMeals() {
    try {
      const savedMeals = localStorage.getItem(this.STORAGE_KEY)
      if (savedMeals) {
        this.meals = JSON.parse(savedMeals)
      }
    } catch (error) {
      console.error("Error loading meals:", error)
    } finally {
      this.isLoading = false
    }
  }

  saveMeals() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.meals))
    } catch (error) {
      console.error("Error saving meals:", error)
    }
  }

  setupOfflineHandling() {
    // Check online status
    this.isOnline = navigator.onLine
    this.updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true
      this.updateOnlineStatus()
      this.syncOfflineData()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
      this.updateOnlineStatus()
    })

    // Check for updates when coming back online
    window.addEventListener("focus", () => {
      if (this.isOnline) {
        this.checkForUpdates()
      }
    })
  }

  updateOnlineStatus() {
    const statusIndicator = document.getElementById("online-status") || this.createStatusIndicator()
    
    if (this.isOnline) {
      statusIndicator.className = "online-indicator online"
      statusIndicator.innerHTML = '<i data-lucide="wifi" class="w-4 h-4"></i> Online'
    } else {
      statusIndicator.className = "online-indicator offline"
      statusIndicator.innerHTML = '<i data-lucide="wifi-off" class="w-4 h-4"></i> Offline'
    }

    // Reinitialize icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  createStatusIndicator() {
    const indicator = document.createElement("div")
    indicator.id = "online-status"
    indicator.className = "online-indicator"
    
    const header = document.querySelector("header .flex")
    header.appendChild(indicator)
    
    return indicator
  }

  async syncOfflineData() {
    // This would sync any offline data when back online
    console.log("Syncing offline data...")
    // For now, just update the UI
    this.updateUI()
  }

  async checkForUpdates() {
    // Check if there are updates available
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        registration.update()
      }
    }
  }

  setupEventListeners() {
    // Settings toggle
    document.getElementById("settings-btn").addEventListener("click", () => {
      const panel = document.getElementById("settings-panel")
      panel.classList.toggle("hidden")
    })

    // Add meal button
    document.getElementById("add-meal-btn").addEventListener("click", () => {
      this.openMealModal()
    })

    // Modal controls
    document.getElementById("close-modal").addEventListener("click", () => {
      this.closeMealModal()
    })

    document.getElementById("cancel-btn").addEventListener("click", () => {
      this.closeMealModal()
    })

    // Form submission
    document.getElementById("meal-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleMealSubmit()
    })

    // Data management
    document.getElementById("export-btn").addEventListener("click", () => {
      this.exportData()
    })

    document.getElementById("import-btn").addEventListener("click", () => {
      document.getElementById("import-input").click()
    })

    document.getElementById("import-input").addEventListener("change", (e) => {
      this.importData(e.target.files[0])
    })

    document.getElementById("clear-btn").addEventListener("click", () => {
      if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
        this.clearAllMeals()
      }
    })

    // Close modal on backdrop click
    document.getElementById("meal-modal").addEventListener("click", (e) => {
      if (e.target.id === "meal-modal") {
        this.closeMealModal()
      }
    })
  }

  hideLoading() {
    document.getElementById("loading-screen").classList.add("hidden")
    document.getElementById("main-app").classList.remove("hidden")
  }

  openMealModal(meal = null) {
    this.editingMeal = meal
    const modal = document.getElementById("meal-modal")
    const title = document.getElementById("modal-title")
    const form = document.getElementById("meal-form")

    title.textContent = meal ? "Editar Refeição" : "Registrar Refeição"

    if (meal) {
      document.getElementById("meal-name").value = meal.name
      document.getElementById("meal-type").value = meal.type
      document.getElementById("meal-time").value = meal.time
      document.getElementById("meal-description").value = meal.description || ""
    } else {
      form.reset()
      // Set current time as default
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      document.getElementById("meal-time").value = now.toISOString().slice(0, 16)
    }

    modal.classList.remove("hidden")
  }

  closeMealModal() {
    document.getElementById("meal-modal").classList.add("hidden")
    this.editingMeal = null
  }

  handleMealSubmit() {
    const formData = {
      name: document.getElementById("meal-name").value,
      type: document.getElementById("meal-type").value,
      time: document.getElementById("meal-time").value,
      description: document.getElementById("meal-description").value,
    }

    if (this.editingMeal) {
      this.updateMeal(this.editingMeal.id, formData)
    } else {
      this.addMeal(formData)
    }

    this.closeMealModal()
    this.updateMascotMessage(this.getRandomMessage("mealAdded"))
  }

  addMeal(mealData) {
    const newMeal = {
      ...mealData,
      id: Date.now().toString(),
    }

    this.meals.push(newMeal)
    this.saveMeals()
    this.updateUI()
    return newMeal
  }

  updateMeal(id, updates) {
    const index = this.meals.findIndex((meal) => meal.id === id)
    if (index !== -1) {
      this.meals[index] = { ...this.meals[index], ...updates }
      this.saveMeals()
      this.updateUI()
    }
  }

  deleteMeal(id) {
    this.meals = this.meals.filter((meal) => meal.id !== id)
    this.saveMeals()
    this.updateUI()
  }

  clearAllMeals() {
    this.meals = []
    this.saveMeals()
    this.updateUI()
    this.updateMascotMessage("Dados limpos! Vamos começar de novo?")
  }

  getTodayMeals() {
    const today = new Date().toDateString()
    return this.meals.filter((meal) => new Date(meal.time).toDateString() === today)
  }

  getWeeklyStats() {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekMeals = this.meals.filter((meal) => new Date(meal.time) >= weekAgo)

    return {
      totalMeals: weekMeals.length,
      averagePerDay: Math.round((weekMeals.length / 7) * 10) / 10,
    }
  }

  getRandomMessage(type) {
    const messages = this.motivationalMessages[type] || this.motivationalMessages.encouragement
    return messages[Math.floor(Math.random() * messages.length)]
  }

  updateMascotMessage(message) {
    this.currentMessage = message
    document.getElementById("mascot-message").textContent = message
  }

  updateUI() {
    const todayMeals = this.getTodayMeals()
    const weeklyStats = this.getWeeklyStats()

    // Update counters
    document.getElementById("today-count").textContent = todayMeals.length
    document.getElementById("total-today").textContent = todayMeals.length
    document.getElementById("weekly-avg").textContent = weeklyStats.averagePerDay

    // Update motivational message
    this.updateMotivationalMessage(todayMeals.length)

    // Update meal history
    this.updateMealHistory()
  }

  updateMotivationalMessage(mealCount) {
    let message = "Continue assim!"

    if (mealCount === 0) {
      message = "Que tal registrar sua primeira refeição do dia?"
    } else if (mealCount >= 3) {
      message = "Excelente! Você está mantendo uma boa rotina alimentar!"
    } else if (mealCount >= 1) {
      message = "Ótimo começo! Continue registrando suas refeições!"
    }

    document.getElementById("motivational-message").textContent = message
  }

  updateMealHistory() {
    const historyContainer = document.getElementById("meal-history")

    if (this.meals.length === 0) {
      historyContainer.innerHTML = `
                <p class="text-center text-muted-foreground py-8">
                    Nenhuma refeição registrada ainda.
                </p>
            `
      return
    }

    // Sort meals by time (newest first)
    const sortedMeals = [...this.meals].sort((a, b) => new Date(b.time) - new Date(a.time))

    historyContainer.innerHTML = sortedMeals
      .map(
        (meal) => `
            <div class="meal-item">
                <div class="meal-info">
                    <h4>${meal.name}</h4>
                    <p>${this.formatMealType(meal.type)} • ${this.formatDateTime(meal.time)}</p>
                    ${meal.description ? `<p class="text-xs mt-1">${meal.description}</p>` : ""}
                </div>
                <div class="meal-actions">
                    <button class="btn btn-ghost btn-sm" onclick="app.openMealModal(${JSON.stringify(meal).replace(/"/g, "&quot;")})">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="app.deleteMeal('${meal.id}')">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("")

    // Reinitialize icons for new elements
    const lucide = window.lucide // Declare the lucide variable
    if (lucide) {
      lucide.createIcons()
    }
  }

  formatMealType(type) {
    const types = {
      breakfast: "Café da manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      snack: "Lanche",
    }
    return types[type] || type
  }

  formatDateTime(dateTime) {
    const date = new Date(dateTime)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateStr = date.toDateString()
    const todayStr = today.toDateString()
    const yesterdayStr = yesterday.toDateString()

    let dayStr
    if (dateStr === todayStr) {
      dayStr = "Hoje"
    } else if (dateStr === yesterdayStr) {
      dayStr = "Ontem"
    } else {
      dayStr = date.toLocaleDateString("pt-BR")
    }

    const timeStr = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    return `${dayStr} às ${timeStr}`
  }

  exportData() {
    const data = {
      meals: this.meals,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mealpal-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    this.updateMascotMessage("Dados exportados com sucesso!")
  }

  async importData(file) {
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (data.meals && Array.isArray(data.meals)) {
        this.meals = data.meals
        this.saveMeals()
        this.updateUI()
        this.updateMascotMessage("Dados importados com sucesso! Bem-vindo de volta!")
      } else {
        throw new Error("Formato de arquivo inválido")
      }
    } catch (error) {
      console.error("Error importing data:", error)
      alert("Erro ao importar dados. Verifique se o arquivo está correto.")
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new MealPal()
})

// PWA Installation and Service Worker
class PWAManager {
  constructor() {
    this.deferredPrompt = null
    this.isInstalled = false
    this.init()
  }

  init() {
    this.registerServiceWorker()
    this.setupInstallPrompt()
    this.checkInstallStatus()
  }

  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration)
            this.updateServiceWorker(registration)
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError)
          })
      })
    }
  }

  updateServiceWorker(registration) {
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          // New content is available, show update notification
          this.showUpdateNotification()
        }
      })
    })
  }

  setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("PWA install prompt triggered")
      e.preventDefault()
      this.deferredPrompt = e
      this.showInstallButton()
    })

    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed")
      this.isInstalled = true
      this.hideInstallButton()
      this.deferredPrompt = null
    })
  }

  checkInstallStatus() {
    // Check if app is running in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      this.isInstalled = true
    }
    
    // Check if app is running in iOS standalone mode
    if (window.navigator.standalone === true) {
      this.isInstalled = true
    }
  }

  showInstallButton() {
    if (this.isInstalled) return

    const installButton = document.createElement("button")
    installButton.id = "install-pwa-btn"
    installButton.className = "btn btn-outline w-full mb-4"
    installButton.innerHTML = `
      <i data-lucide="download" class="w-4 h-4 mr-2"></i>
      Instalar App
    `
    
    installButton.addEventListener("click", () => {
      this.installPWA()
    })

    // Add to settings panel
    const settingsPanel = document.getElementById("settings-panel")
    const firstButton = settingsPanel.querySelector(".btn")
    settingsPanel.insertBefore(installButton, firstButton)

    // Reinitialize icons
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }

  hideInstallButton() {
    const installButton = document.getElementById("install-pwa-btn")
    if (installButton) {
      installButton.remove()
    }
  }

  async installPWA() {
    if (!this.deferredPrompt) return

    this.deferredPrompt.prompt()
    const { outcome } = await this.deferredPrompt.userChoice
    
    if (outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }
    
    this.deferredPrompt = null
  }

  showUpdateNotification() {
    // Show a notification that an update is available
    const notification = document.createElement("div")
    notification.className = "card p-4 mb-4 bg-primary text-primary-foreground"
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold">Atualização Disponível!</p>
          <p class="text-sm">Uma nova versão do app está disponível.</p>
        </div>
        <button id="reload-btn" class="btn btn-ghost btn-sm">
          <i data-lucide="refresh-cw" class="w-4 h-4"></i>
        </button>
      </div>
    `

    const mainApp = document.getElementById("main-app")
    mainApp.insertBefore(notification, mainApp.firstChild)

    document.getElementById("reload-btn").addEventListener("click", () => {
      window.location.reload()
    })

    if (window.lucide) {
      window.lucide.createIcons()
    }
  }
}

// Initialize PWA Manager
const pwaManager = new PWAManager()

// Service Worker Registration (legacy support)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
