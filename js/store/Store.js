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

    t(key) {
        const lang = this.state?.settings?.language || 'es';
        return window.DosisTranslations[lang][key] || key;
    }

    init() {
        if (!localStorage.getItem(this.settingsKey)) {
            const defaultSettings = {
                language: 'es',
                isPremium: false,
                units: 'metric', // metric or imperial
                timeFormat: '24h',
                pin: null, // null means no PIN
                biometryEnabled: false,
                doctorPhone: null,
                securityQuestion: null,
                securityAnswer: null,
                autoTheme: false
            };
            localStorage.setItem(this.settingsKey, JSON.stringify(defaultSettings));
        }
        if (!localStorage.getItem(this.profilesKey)) {
            localStorage.setItem(this.profilesKey, JSON.stringify([]));
        }

        if (!localStorage.getItem(this.activeProfileKey)) {
            localStorage.setItem(this.activeProfileKey, '');
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

    addProfile(name, color = '#0ea5e9', height = 1.70, birthdate = null) {
        const id = 'p' + Date.now();
        const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${color.replace('#', '')}&fontWeight=800&chars=2`;
        const newProfile = { id, name, avatar, color, height: parseFloat(height) || 1.70, birthdate };

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

        // Delete all readings associated with this profile to keep storage clean
        this.state.readings = this.state.readings.filter(r => r.profileId !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(this.state.readings));

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

    togglePremium() {
        const newState = !this.state.settings.isPremium;
        this.updateSettings({ isPremium: newState });
        return newState;
    }

    setPIN(pin, question = null, answer = null) {
        this.updateSettings({
            pin,
            securityQuestion: question,
            securityAnswer: answer
        });
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
                const pulse = parseInt(values.pulse);

                let bpStatus = 'normal';
                let bpMsg = this.t('status_optimal');

                // Evaluate BP (4 levels)
                // Danger (Red)
                if (sys >= 150 || dia >= 95 || (sys > 0 && sys < 85) || (dia > 0 && dia < 55)) {
                    bpStatus = 'danger';
                    bpMsg = (sys < 85 || dia < 55) ? this.t('status_hypotension') : this.t('status_hypertension_stage2');
                }
                // Caution (Orange)
                else if (sys >= 140 || dia >= 90 || (sys > 0 && sys < 90) || (dia > 0 && dia < 60)) {
                    bpStatus = 'caution';
                    bpMsg = this.t('status_hypertension_stage1');
                }
                // Warning (Yellow)
                else if (sys >= 130 || dia >= 85 || (sys > 0 && sys < 100) || (dia > 0 && dia < 65)) {
                    bpStatus = 'warning';
                    bpMsg = this.t('status_elevated');
                }

                // Evaluate Pulse (BPM)
                let pulseStatus = 'normal';
                let pulseMsg = this.t('status_normal');
                if (pulse > 0) {
                    if (pulse > 130 || pulse < 45) {
                        pulseStatus = 'danger';
                        pulseMsg = pulse < 45 ? this.t('status_bradycardia') : this.t('status_tachycardia');
                    } else if (pulse > 110 || pulse < 55) {
                        pulseStatus = 'caution';
                        pulseMsg = this.t('status_review');
                    } else if (pulse > 100 || pulse < 60) {
                        pulseStatus = 'warning';
                        pulseMsg = this.t('status_elevated');
                    }
                }

                // Severity Priority (Danger > Caution > Warning > Normal)
                if (bpStatus === 'danger' || pulseStatus === 'danger') {
                    status = 'danger';
                    message = bpStatus === 'danger' ? bpMsg : pulseMsg;
                } else if (bpStatus === 'caution' || pulseStatus === 'caution') {
                    status = 'caution';
                    message = bpStatus === 'caution' ? bpMsg : pulseMsg;
                } else if (bpStatus === 'warning' || pulseStatus === 'warning') {
                    status = 'warning';
                    message = bpStatus === 'warning' ? bpMsg : pulseMsg;
                } else {
                    status = 'normal';
                    message = this.t('status_optimal');
                }
                break;

            case 'glucose':
                const glu = parseInt(values.value);

                // Contextos médicos específicos con rangos ADA + Color Naranja (Caution)
                const glucoseRanges = {
                    fasting: { normal: [70, 100], warning: [100, 115], caution: [115, 126], danger: 126 },
                    before_meal: { normal: [70, 130], warning: [130, 150], caution: [150, 180], danger: 180 },
                    after_meal: { normal: [0, 140], warning: [140, 170], caution: [170, 200], danger: 200 },
                    before_sleep: { normal: [100, 140], warning: [140, 170], caution: [170, 200], danger: 200 },
                    random: { normal: [0, 140], warning: [140, 180], caution: [180, 250], danger: 250 }
                };

                let context = 'fasting';
                if (timing) {
                    if (timing === 'fasting' || timing.toLowerCase().includes('ayunas')) context = 'fasting';
                    else if (timing === 'before_meal') context = 'before_meal';
                    else if (timing === 'after_meal' || timing.toLowerCase().includes('post')) context = 'after_meal';
                    else if (timing === 'before_sleep') context = 'before_sleep';
                    else if (timing === 'random') context = 'random';
                }

                const range = glucoseRanges[context];

                if (glu > 0 && glu < 60) {
                    status = 'danger';
                    message = this.t('status_hypoglycemia');
                } else if (glu >= range.danger) {
                    status = 'danger';
                    message = this.t('status_diabetes');
                } else if (glu >= range.caution[0]) {
                    status = 'caution';
                    message = this.t('status_high');
                } else if (glu >= range.warning[0]) {
                    status = 'warning';
                    message = this.t('status_prediabetes');
                } else {
                    status = 'normal';
                    message = this.t('status_normal');
                }
                break;

            case 'oxygen_temp':
                const spo2 = values.spo2 ? parseInt(values.spo2) : null;
                const temp = values.temp ? parseFloat(values.temp) : null;

                let spo2Status = 'normal';
                let tempStatus = 'normal';

                if (spo2 !== null) {
                    if (spo2 < 85) spo2Status = 'danger';
                    else if (spo2 < 90) spo2Status = 'caution';
                    else if (spo2 < 95) spo2Status = 'warning';
                }

                if (temp !== null) {
                    if (temp > 39.0 || temp < 35.0) tempStatus = 'danger';
                    else if (temp > 38.0 || temp < 35.5) tempStatus = 'caution';
                    else if (temp >= 37.3) tempStatus = 'warning';
                }

                if (spo2Status === 'danger' || tempStatus === 'danger') status = 'danger';
                else if (spo2Status === 'caution' || tempStatus === 'caution') status = 'caution';
                else if (spo2Status === 'warning' || tempStatus === 'warning') status = 'warning';

                message = status === 'danger' ? this.t('status_alert') :
                    status === 'caution' ? this.t('status_review') :
                        status === 'warning' ? this.t('status_elevated') : this.t('status_normal');
                break;

            case 'weight':
                const bmi = parseFloat(values.bmi);
                if (bmi >= 35 || bmi < 15) {
                    status = 'danger';
                    message = bmi < 15 ? this.t('status_low') : this.t('status_obesity_stage2');
                } else if (bmi >= 30 || bmi < 16) {
                    status = 'caution';
                    message = bmi < 16 ? this.t('status_low') : this.t('status_obesity_stage1');
                } else if (bmi >= 25 || bmi < 18.5) {
                    status = 'warning';
                    message = bmi < 18.5 ? this.t('status_low') : this.t('status_overweight');
                } else {
                    status = 'normal';
                    message = this.t('status_normal');
                }
                break;

            case 'pain':
                const pain = parseInt(values.value);
                if (pain >= 9) {
                    status = 'danger';
                    message = this.t('status_severe_pain');
                } else if (pain >= 7) {
                    status = 'caution';
                    message = this.t('status_high_pain');
                } else if (pain >= 4) {
                    status = 'warning';
                    message = this.t('status_moderate_pain');
                } else {
                    status = 'normal';
                    message = this.t('status_mild_pain');
                }
                break;

            case 'bristol':
                const typeB = parseInt(values.value);
                if (typeB === 1 || typeB === 7) {
                    status = 'danger';
                    message = this.t('status_alert');
                } else if (typeB === 2 || typeB === 6) {
                    status = 'caution';
                    message = this.t('status_review');
                } else if (typeB === 5 || typeB === 3) {
                    status = 'warning';
                    message = this.t('status_attention');
                } else {
                    status = 'normal';
                    message = this.t('status_ideal');
                }
                break;

            case 'sleep':
                const duration = parseFloat(values.duration); // en horas
                const feeling = parseInt(values.feeling); // 1-5
                const sleepType = values.sleepType; // 'night' | 'nap'

                if (sleepType === 'nap') {
                    // Para siestas, la evaluación es menos punitiva
                    if (duration > 2.5) {
                        status = 'warning';
                        message = this.t('status_excessive_sleep');
                    } else {
                        status = 'normal';
                        message = this.t('status_optimal_sleep');
                    }
                } else {
                    // Sueño nocturno
                    if (duration < 4 || feeling === 1) {
                        status = 'danger';
                        message = this.t('status_insufficient_sleep');
                    } else if (duration < 6 || duration > 10 || feeling === 2) {
                        status = 'caution';
                        message = this.t('status_review');
                    } else if (duration < 7 || duration > 9 || feeling === 3) {
                        status = 'warning';
                        message = this.t('status_attention');
                    } else {
                        status = 'normal';
                        message = this.t('status_optimal_sleep');
                    }
                }
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
