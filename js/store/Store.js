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

        this.init();
    }

    init() {
        if (!localStorage.getItem(this.profilesKey)) {
            const defaultProfiles = [
                { id: 'p1', name: 'Usuario', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Usuario&backgroundColor=0ea5e9&fontWeight=800', color: '#0ea5e9' }
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
            theme: localStorage.getItem(this.themeKey)
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

    getSemaphore(type, values) {
        // Safe checks if values are missing
        if (!values) return 'normal';

        const ranges = {
            pressure: {
                systolic: { normal: 120, caution: 140 },
                diastolic: { normal: 80, caution: 90 }
            },
            glucose: {
                fasting: { normal: 100, caution: 125 },
                post: { normal: 140, caution: 199 }
            }
        };

        if (type === 'pressure') {
            if (values.systolic > ranges.pressure.systolic.caution || values.diastolic > ranges.pressure.diastolic.caution) return 'alert';
            if (values.systolic > ranges.pressure.systolic.normal || values.diastolic > ranges.pressure.diastolic.normal) return 'caution';
            return 'normal';
        }

        if (type === 'glucose') {
            const limit = values.timing === 'Ayunas' ? ranges.glucose.fasting : ranges.glucose.post;
            if (values.value > limit.caution) return 'alert';
            if (values.value > limit.normal) return 'caution';
            return 'normal';
        }

        return 'normal';
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
