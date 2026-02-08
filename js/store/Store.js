/**
 * Dosis Vital - Professional Central Data Store
 * Refactored for file:// protocol compatibility (No ES Modules)
 */

class Store {
    constructor() {
        this.storageKey = 'dosis_vital_v2_data';
        this.profilesKey = 'dosis_vital_v2_profiles';
        this.activeProfileKey = 'dosis_vital_v2_active';
        this.themeKey = 'dosis_vital_v2_theme';
        this.settingsKey = 'dosis_vital_v2_settings';

        this.init();
    }

    init() {
        if (!localStorage.getItem(this.settingsKey)) {
            const defaultSettings = {
                language: 'es',
                units: 'metric', // metric or imperial
                timeFormat: '24h',
                pin: null, // null means no PIN
                autoTheme: false
            };
            localStorage.setItem(this.settingsKey, JSON.stringify(defaultSettings));
        }
        if (!localStorage.getItem(this.profilesKey)) {
            const defaultProfiles = [
                { id: 'p1', name: 'Usuario', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Usuario&backgroundColor=0ea5e9&fontWeight=800', color: '#0ea5e9', height: 1.70 }
            ];
            localStorage.setItem(this.profilesKey, JSON.stringify(defaultProfiles));
        }

        if (!localStorage.getItem(this.activeProfileKey)) {
            localStorage.setItem(this.activeProfileKey, 'p1');
        }

        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }

        if (!localStorage.getItem(this.themeKey)) {
            localStorage.setItem(this.themeKey, 'light');
        }

        this.state = {
            profiles: JSON.parse(localStorage.getItem(this.profilesKey)),
            activeProfileId: localStorage.getItem(this.activeProfileKey),
            readings: JSON.parse(localStorage.getItem(this.storageKey)),
            theme: localStorage.getItem(this.themeKey),
            settings: JSON.parse(localStorage.getItem(this.settingsKey))
        };

        this.applyTheme();
    }

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem(this.themeKey, this.state.theme);
        this.applyTheme();
        this.notify();
    }

    applyTheme() {
        if (this.state.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    getActiveProfile() {
        return this.state.profiles.find(p => p.id === this.state.activeProfileId);
    }

    setActiveProfile(id) {
        this.state.activeProfileId = id;
        localStorage.setItem(this.activeProfileKey, id);
        this.notify();
    }

    addReading(type, values, timing = null) {
        const newReading = {
            id: Date.now().toString(),
            profileId: this.state.activeProfileId,
            type,
            values,
            timing,
            timestamp: new Date().toISOString()
        };

        this.state.readings.push(newReading);
        this.saveState();
        return newReading;
    }

    getReadingById(id) {
        return this.state.readings.find(r => r.id === id);
    }

    deleteReading(id) {
        this.state.readings = this.state.readings.filter(r => r.id !== id);
        this.saveState();
    }

    updateReading(id, values, timing = null) {
        const index = this.state.readings.findIndex(r => r.id === id);
        if (index !== -1) {
            this.state.readings[index] = {
                ...this.state.readings[index],
                values,
                timing
            };
            this.saveState();
            return this.state.readings[index];
        }
        return null;
    }

    updateProfile(updatedData) {
        const profileIndex = this.state.profiles.findIndex(p => p.id === this.state.activeProfileId);
        if (profileIndex !== -1) {
            this.state.profiles[profileIndex] = { ...this.state.profiles[profileIndex], ...updatedData };
            localStorage.setItem(this.profilesKey, JSON.stringify(this.state.profiles));
            this.notify();
        }
    }

    addProfile(name, color = '#0ea5e9', height = 1.70) {
        const id = 'p' + Date.now();
        const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${color.replace('#', '')}&fontWeight=800&chars=2`;
        const newProfile = { id, name, avatar, color, height: parseFloat(height) || 1.70 };

        this.state.profiles.push(newProfile);
        localStorage.setItem(this.profilesKey, JSON.stringify(this.state.profiles));
        this.notify();
        return newProfile;
    }

    deleteProfile(id) {
        if (this.state.profiles.length <= 1) return; // Prevent deleting the last profile

        this.state.profiles = this.state.profiles.filter(p => p.id !== id);

        // If we deleted the active profile, switch to the first available one
        if (this.state.activeProfileId === id) {
            this.setActiveProfile(this.state.profiles[0].id);
        }

        // Optional: delete all readings associated with this profile? 
        // For now, let's keep them in storage but they won't be accessible

        localStorage.setItem(this.profilesKey, JSON.stringify(this.state.profiles));
        this.notify();
    }

    getReadings() {
        // Ensure state is loaded
        if (!this.state.readings) this.state.readings = JSON.parse(localStorage.getItem(this.storageKey)) || [];

        return this.state.readings
            .filter(r => r.profileId === this.state.activeProfileId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state.readings));
        this.notify();
    }


    updateSettings(newSettings) {
        this.state.settings = { ...this.state.settings, ...newSettings };
        localStorage.setItem(this.settingsKey, JSON.stringify(this.state.settings));
        this.notify();
    }

    setPIN(pin) {
        this.updateSettings({ pin });
    }

    verifyPIN(pin) {
        return this.state.settings.pin === pin;
    }

    exportData() {
        const data = {
            version: '2.0',
            profiles: this.state.profiles,
            readings: this.state.readings,
            settings: this.state.settings,
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (!data.profiles || !data.readings) throw new Error('Formato inválido');

            this.state.profiles = data.profiles;
            this.state.readings = data.readings;
            if (data.settings) this.state.settings = { ...this.state.settings, ...data.settings };

            localStorage.setItem(this.profilesKey, JSON.stringify(this.state.profiles));
            localStorage.setItem(this.storageKey, JSON.stringify(this.state.readings));
            localStorage.setItem(this.settingsKey, JSON.stringify(this.state.settings));

            this.notify();
            return true;
        } catch (e) {
            console.error('Error importando datos:', e);
            return false;
        }
    }

    evaluateReading(type, values, timing = null) {
        let status = 'normal'; // green, warning, danger
        let message = 'Normal';

        switch (type) {
            case 'pressure':
                const sys = parseInt(values.systolic);
                const dia = parseInt(values.diastolic);
                if (sys >= 140 || dia >= 90) {
                    status = 'danger';
                    message = 'Hipertensión';
                } else if (sys >= 120 || dia >= 80) {
                    status = 'warning';
                    message = 'Elevada';
                } else {
                    status = 'normal';
                    message = 'Óptima';
                }
                break;

            case 'glucose':
                const glu = parseInt(values.value);
                const isFasting = timing && (timing.toLowerCase().includes('ayunas') || timing.toLowerCase().includes('fasting'));

                if (isFasting) {
                    if (glu >= 126 || glu < 70) {
                        status = 'danger';
                        message = glu < 70 ? 'Hipoglicemia' : 'Diabetes';
                    } else if (glu >= 100) {
                        status = 'warning';
                        message = 'Prediabetes';
                    } else {
                        status = 'normal';
                        message = 'Normal';
                    }
                } else { // post-prandial
                    if (glu >= 200 || glu < 70) {
                        status = 'danger';
                        message = glu < 70 ? 'Hipoglicemia' : 'Diabetes';
                    } else if (glu >= 140) {
                        status = 'warning';
                        message = 'Prediabetes';
                    } else {
                        status = 'normal';
                        message = 'Normal';
                    }
                }
                break;

            case 'oxygen_temp':
                const spo2 = values.spo2 ? parseInt(values.spo2) : null;
                const temp = values.temp ? parseFloat(values.temp) : null;

                let spo2Status = 'normal';
                let tempStatus = 'normal';

                if (spo2 !== null) {
                    if (spo2 < 90) spo2Status = 'danger';
                    else if (spo2 < 95) spo2Status = 'warning';
                }

                if (temp !== null) {
                    if (temp > 38.0 || temp < 35.5) tempStatus = 'danger';
                    else if (temp >= 37.3) tempStatus = 'warning';
                }

                if (spo2Status === 'danger' || tempStatus === 'danger') status = 'danger';
                else if (spo2Status === 'warning' || tempStatus === 'warning') status = 'warning';

                message = status === 'danger' ? 'Alerta' : status === 'warning' ? 'Revisión' : 'Normal';
                break;

            case 'weight':
                const bmi = parseFloat(values.bmi);
                if (bmi >= 30 || bmi < 16) {
                    status = 'danger';
                    message = bmi < 16 ? 'Delgadez Severa' : 'Obesidad';
                } else if (bmi >= 25 || bmi < 18.5) {
                    status = 'warning';
                    message = bmi < 18.5 ? 'Bajo Peso' : 'Sobrepeso';
                } else {
                    status = 'normal';
                    message = 'Peso Saludable';
                }
                break;

            case 'pain':
                const pain = parseInt(values.value);
                if (pain >= 7) status = 'danger';
                else if (pain >= 4) status = 'warning';
                message = pain >= 7 ? 'Dolor Fuerte' : pain >= 4 ? 'Dolor Moderado' : 'Leve';
                break;

            case 'bristol':
                const typeB = parseInt(values.value);
                if (typeB === 1 || typeB === 2 || typeB === 7) status = 'danger';
                else if (typeB === 3 || typeB === 6) status = 'warning';
                message = (typeB >= 3 && typeB <= 5) ? 'Ideal' : 'Atención';
                break;
        }

        return { status, message };
    }

    listeners = [];
    subscribe(callback) {
        this.listeners.push(callback);
    }
    notify() {
        this.listeners.forEach(cb => cb(this.state));
    }
}

// Global assignment for non-module environments
window.DosisStore = new Store();
