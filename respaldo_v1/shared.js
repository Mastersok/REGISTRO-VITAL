/**
 * Dosis Vital - Shared Logic & Data Management
 */

const DosisVital = {
    // Basic config
    config: {
        appName: "Dosis Vital",
        storageKey: "dosis_vital_data",
        profilesKey: "dosis_vital_profiles",
        activeProfileKey: "dosis_vital_active_profile"
    },

    // Initialize data
    init() {
        if (!localStorage.getItem(this.config.storageKey)) {
            localStorage.setItem(this.config.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.config.profilesKey)) {
            localStorage.setItem(this.config.profilesKey, JSON.stringify([{ id: 'default', name: 'Juan', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7RWVByUNqAasUxSyV_Mloe_4eqENuU7HcogyifqpAJtEAi4gVCEx9sXIc4Gjz8kAbNfqoUUtPJvwZP_wd1TK9z6T663nJJea9ryVvrmpKadTZeWACPHEbsBlq60eco8c5cjcWm5J4_ljTbSBKWwPHswKAqnB9VeXWmnhcHRR6LlIHWrSM-CMqn9JgiRZI1hKHpDxxMOL98GlYaz2fGex1Wg8BrRMeQPn1ES9nFUVXWRC_9j3b9mEMlWRqUQh_s41CY53Zke3Et-8m' }]));
        }
        if (!localStorage.getItem(this.config.activeProfileKey)) {
            localStorage.setItem(this.config.activeProfileKey, 'default');
        }
    },

    // Save a new measurement
    saveReading(type, values, timing = null) {
        const readings = JSON.parse(localStorage.getItem(this.config.storageKey));
        const activeProfileId = localStorage.getItem(this.config.activeProfileKey);
        
        const newReading = {
            id: Date.now(),
            profileId: activeProfileId,
            type: type, // 'pressure', 'glucose', 'oxygen_temp', 'weight', 'pain', 'bristol'
            values: values,
            timing: timing,
            timestamp: new Date().toISOString()
        };

        readings.push(newReading);
        localStorage.setItem(this.config.storageKey, JSON.stringify(readings));
        
        this.showToast("¡Registro guardado con éxito! ✅");
        
        // Return to home after 1.5s
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    },

    // Get all readings for active profile
    getReadings() {
        const readings = JSON.parse(localStorage.getItem(this.config.storageKey)) || [];
        const activeProfileId = localStorage.getItem(this.config.activeProfileKey);
        return readings.filter(r => r.profileId === activeProfileId).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    // Get active profile info
    getActiveProfile() {
        const profiles = JSON.parse(localStorage.getItem(this.config.profilesKey));
        const activeId = localStorage.getItem(this.config.activeProfileKey);
        return profiles.find(p => p.id === activeId);
    },

    // Feedback System (Toast)
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-full shadow-2xl z-[9999] font-bold animate-bounce';
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    // Streak calculation (simple)
    getStreak() {
        const readings = this.getReadings();
        if (readings.length === 0) return 0;
        
        // This is a simplified streak: count unique days in the last 30 days
        const days = new Set();
        readings.forEach(r => {
            days.add(new Date(r.timestamp).toDateString());
        });
        return days.size; 
    }
};

// Auto-init
DosisVital.init();
